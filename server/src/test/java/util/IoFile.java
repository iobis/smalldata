package util;

import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.function.Consumer;
import java.util.stream.Collectors;

public class IoFile {

  public static void doWithFileContent(String strPath, Consumer<String> stringConsumer) {
    try {
      var path = Paths.get(IoFile.class.getClassLoader().getResource(strPath).toURI());
      var lines = Files.lines(path);
      var xmlExpected = lines.collect(Collectors.joining("\n"));
      lines.close();
      stringConsumer.accept(xmlExpected);
    } catch (IOException | URISyntaxException e) {
      e.printStackTrace();
    }
  }
}
