package util;

import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

public class IoFile {

  public static String loadFromResources(String strPath) {
    try {
      var path = Paths.get(Thread.currentThread().getContextClassLoader().getResource(strPath).toURI());
      var bytes = Files.readAllBytes(path);
      return new String(bytes, StandardCharsets.UTF_8);
    } catch (IOException | URISyntaxException e) {
      throw new RuntimeException(e);
    }
  }

  private IoFile() {
  }
}
