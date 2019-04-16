package org.obis.smalldata.dwca;

import com.google.common.io.Resources;
import lombok.AllArgsConstructor;
import lombok.Value;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.fail;
import static org.pmw.tinylog.Logger.error;

public class MetaGeneratorTest {

  @Test
  public void testSuccessFullMetaFile() {
    var processor = new ResourcePathProcessor("mockdata/dwca/ware_hosono-v1.5-csv-namespaced/");

    var core = processor.generateMetaConfig(processor.uri("event15584133909797684527.txt"));
    var extensions = List.of("emof15584133909797684527.txt", "occurrence15584133909797684527.txt").stream()
      .map(processor::uri)
      .map(processor::generateMetaConfig)
      .collect(Collectors.toList());

    var generator = new MetaGenerator();
    var xmlFile = generator.generateXml(core, extensions);
    var resource = Resources.getResource("mockdata/dwca/ware_hosono-v1.5/meta.xml");
    try {
      var expected = Files.lines(Paths.get(resource.getPath())).collect(Collectors.joining());
      var actual = Files.lines(xmlFile.get().toPath()).collect(Collectors.joining());
      assertEquals(expected.replaceAll("\\s", ""),
        actual.replaceAll("\\s", "").replaceAll("\\d+\\.txt", ".txt"));
    } catch (IOException e) {
      error("failed to assert {}", e.getMessage());
      fail("failing to read files, cannot assert equality");
    }
  }

  @Value
  @AllArgsConstructor
  static class ResourcePathProcessor {
    private final Map<String, String> rowTypeMap =
      Map.of("event15584133909797684527.txt", "http://rs.tdwg.org/dwc/terms/Event",
        "emof15584133909797684527.txt", "http://rs.iobis.org/obis/terms/ExtendedMeasurementOrFact",
        "occurrence15584133909797684527.txt", "http://rs.tdwg.org/dwc/terms/Occurrence");
    private final String baseDir;

    MetaFileConfig generateMetaConfig(URI uri) {
      try {
        var relativeUri = Resources.getResource(baseDir).toURI().relativize(uri).getPath();
        return new MetaFileConfig(List.of(relativeUri), rowTypeMap.get(relativeUri), uri);
      } catch (URISyntaxException e) {
        error(e.getMessage());
        return null;
      }
    }

    URI uri(String path) {
      try {
        return Resources.getResource(baseDir + path).toURI();
      } catch (URISyntaxException e) {
        return null;
      }
    }
  }
}
