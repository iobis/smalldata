package org.obis.smalldata.dwca;

import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import org.obis.smalldata.util.IoFile;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;
import java.util.Set;
import java.util.zip.ZipOutputStream;

import static org.pmw.tinylog.Logger.error;

class DwcaZipGenerator {

  Optional<Path> generate(JsonArray dwcaRecords, JsonObject dataset) {
    try {
      var tempDirectory = Files.createTempDirectory("iobis-dwca");
      var files = Set.of(Files.createTempFile(tempDirectory,"eml", ".xml"),
        Files.createTempFile(tempDirectory, "meta", ".xml"));

      var zipFile = Files.createTempFile(tempDirectory, "dwca", ".zip");
      var fileAdder = new FileAdder(zipFile);
      files.stream().forEach(fileAdder::add);
      fileAdder.close();
      files.stream()
        .forEach(f -> {
          try {
            Files.delete(f);
          } catch (IOException e) {
            error(e.getMessage());
          }
        });
      return Optional.of(zipFile);
    } catch (IOException e) {
      error(e.getMessage());
      return Optional.empty();
    }
  }

  static class FileAdder {
    private final ZipOutputStream zos;
    private final FileOutputStream fos;

    FileAdder(Path zipFile) throws IOException {
      fos = (FileOutputStream) Files.newOutputStream(zipFile);
      zos = new ZipOutputStream(fos);
    }

    void add(Path fileName) {
      try {
        IoFile.addToZipFile(fileName, zos);
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
