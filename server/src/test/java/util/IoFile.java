package util;

import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.stream.Collectors;

public class IoFile {

  public static String loadFromResources(String strPath) {
    try {
      var path = Paths.get(IoFile.class.getClassLoader().getResource(strPath).toURI());
      var lines = Files.lines(path);
      var text = lines.collect(Collectors.joining("\n"));
      lines.close();
      return text;
    } catch (IOException | URISyntaxException e) {
      throw new RuntimeException(e);
    }
  }
}
