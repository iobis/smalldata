package org.obis.smalldata.dwca;

import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import org.obis.smalldata.util.IoFile;

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
      var zipFile = Files.createTempFile(tempDirectory, "dwca", ".zip");
			var fos = Files.newOutputStream(zipFile);
			var zos = new ZipOutputStream(fos);
      var fileAdder = new FileAdder(zos);
      var files = Set.of(Files.createTempFile(tempDirectory,"eml", ".xml"),
        Files.createTempFile(tempDirectory, "meta", ".xml"));
      files.stream()
        .forEach(fileAdder::add);
      zos.close();
      fos.close();
      return Optional.of(zipFile);
    } catch (IOException e) {
      error(e.getMessage());
      return Optional.empty();
    }
  }

  @Value
  @RequiredArgsConstructor
  static class FileAdder {
    private final ZipOutputStream fos;

    void add(Path fileName) {
      try {
        IoFile.addToZipFile(fileName, fos);
      } catch (IOException e) {
        error(e.getMessage());
      }
    }
  }
}
