package org.obis.smalldata.dwca;

import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import org.obis.util.file.IoFile;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.zip.ZipOutputStream;

import static org.pmw.tinylog.Logger.error;

class DwcaZipGenerator {

  Optional<Path> generate(List<JsonObject> dwcaRecords, JsonObject dataset) {
    try {
      var tempDirectory = Files.createTempDirectory("iobis-dwca");
      var files = Set.of(Files.createTempFile(tempDirectory, "eml", ".xml"),
        Files.createTempFile(tempDirectory, "meta", ".xml"));

      var zipFile = Files.createTempFile(tempDirectory, "dwca", ".zip");
      var zipFileEntries = new ZipFileEntries(zipFile);
      files.stream().forEach(zipFileEntries::add);
      zipFileEntries.close();
      return Optional.of(zipFile);
    } catch (IOException e) {
      error(e.getMessage());
      return Optional.empty();
    }
  }

  Optional<Path> generate(JsonArray dwcaRecords, JsonObject dataset) {
    return generate(dwcaRecords.getList(), dataset);
  }

  static class ZipFileEntries {
    private final ZipOutputStream zos;
    private final FileOutputStream fos;

    ZipFileEntries(Path zipFile) throws IOException {
      fos = (FileOutputStream) Files.newOutputStream(zipFile);
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
