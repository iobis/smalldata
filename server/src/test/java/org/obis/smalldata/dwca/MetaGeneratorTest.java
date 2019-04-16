package org.obis.smalldata.dwca;

import com.google.common.io.Resources;
import lombok.AllArgsConstructor;
import lombok.Value;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;

import static org.pmw.tinylog.Logger.info;

public class MetaGeneratorTest {

  @Value
  @AllArgsConstructor
  static class ResourcePathToURL {

    private final String baseDir;

    URI uri(String path) {
      try {
        return Resources.getResource(baseDir + path).toURI();
      } catch (URISyntaxException e) {
        return null;
      }
    }

  }

  @Test
  public void testSuccessFullMetaFile() throws IOException, URISyntaxException {
    var pathToURL = new ResourcePathToURL("mockdata/dwca/ware_hosono-v1.5-csv-namespaced/");

    var core =  pathToURL.uri("event.txt");
    var extensions =  List.of("emof.txt", "occurrence.txt").stream()
      .map(pathToURL::uri)
      .collect(Collectors.toList());


    var generator = new MetaGenerator();
    var xmlFile = generator.generateXml(core, extensions);
    info(xmlFile.get());

  }
}
