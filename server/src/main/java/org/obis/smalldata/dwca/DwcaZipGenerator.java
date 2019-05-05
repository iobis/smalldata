package org.obis.smalldata.dwca;

import com.google.common.base.Throwables;
import io.vertx.core.json.JsonObject;
import org.obis.util.file.IoFile;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.zip.ZipOutputStream;

import static org.pmw.tinylog.Logger.error;

class DwcaZipGenerator {

  private static final Map<Pattern, String> ROW_TYPE_MAP =
    Map.of(
      Pattern.compile("event\\d+\\.txt"), "http://rs.tdwg.org/dwc/terms/Event",
      Pattern.compile("emof\\d+\\.txt"), "http://rs.iobis.org/obis/terms/ExtendedMeasurementOrFact",
      Pattern.compile("occurrence\\d+\\.txt"), "http://rs.tdwg.org/dwc/terms/Occurrence");

  Optional<Path> generate(List<JsonObject> dwcaRecords, JsonObject dataset) {
    try {
      var tempDirectory = Files.createTempDirectory("iobis-dwca");
      var emlXml = new File(tempDirectory + "/eml.xml");
      if (!new EmlGenerator().writeXml(dataset, emlXml)) {
        error("Cannot create eml file {}", emlXml);
        throw new IOException("Failed to create:  " + emlXml);
      }
      var csvFiles = generateCsvFiles(dwcaRecords, tempDirectory);
      var metaXml = generateMetaFile(dataset, csvFiles, tempDirectory);
      var files = Stream.of(csvFiles, Set.of(metaXml, emlXml.toPath()))
        .flatMap(Set::stream)
        .collect(Collectors.toSet());
      var zipFile = Files.createTempFile(tempDirectory, "dwca", ".zip");
      var zipFileEntries = new ZipFileEntries(zipFile);
      files.forEach(zipFileEntries::add);
      zipFileEntries.close();
      return Optional.of(zipFile);
    } catch (IOException e) {
      error(e.getMessage());
      return Optional.empty();
    }
  }

  private Set<Path> generateCsvFiles(List<JsonObject> dwcaRecords, Path directory) {
    var dwcaMap = DwcaData.datasetToDwcaMap(dwcaRecords);
    var dwcCsvWriter = new DwcCsvTable();
    return dwcaMap.entrySet().stream()
      .map(dataEntry -> {
        try {
          File generatedFile = File.createTempFile(dataEntry.getKey(), ".txt", directory.toFile());
          dwcCsvWriter.writeTableToFile(dataEntry.getValue(), generatedFile);
          return Path.of(generatedFile.toURI());
        } catch (IOException e) {
          error(Throwables.getStackTraceAsString(e));
          return null;
        }
      })
      .collect(Collectors.toSet());
  }

  private MetaFileConfig generateMetaConfig(Path path) {
    var coreName = path.toFile().getName();
    var coreRowType = ROW_TYPE_MAP.get(ROW_TYPE_MAP.keySet().stream()
      .filter(rt -> rt.matcher(coreName).matches())
      .findFirst()
      .get());
    return new MetaFileConfig(List.of(coreName), coreRowType, path.toUri());
  }

  private Path generateMetaFile(JsonObject dataset, Set<Path> paths, Path directory) {
    var generator = new MetaGenerator();
    var tableConfig = dataset.getJsonObject("meta").getJsonObject("dwcTables");
    var coreTable = tableConfig.getString("core");
    var groupedPaths = paths.stream()
      .collect(Collectors.groupingBy(path -> path.toFile().getName().startsWith(coreTable)));
    var corePath = groupedPaths.get(true).get(0);
    var coreMeta = this.generateMetaConfig(corePath);
    var extensionPaths = groupedPaths.get(false).stream()
      .map(this::generateMetaConfig)
      .collect(Collectors.toList());

    return generator.generateXml(coreMeta, extensionPaths, directory).get().toPath();
  }

  private static class ZipFileEntries {
    private final ZipOutputStream zos;
    private final OutputStream fos;

    ZipFileEntries(Path zipFile) throws IOException {
      fos = Files.newOutputStream(zipFile);
      zos = new ZipOutputStream(fos);
    }

    void add(Path fileName) {
      try {
        IoFile.addToZipFile(fileName, zos);
        Files.delete(fileName);
      } catch (IOException e) {
        error(e.getMessage());
      }
    }

    void close() throws IOException {
      zos.close();
      fos.close();
    }
  }
}