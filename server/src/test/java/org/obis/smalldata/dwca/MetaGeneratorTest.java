package org.obis.smalldata.dwca;

import com.google.common.base.Charsets;
import com.google.common.io.Resources;
import lombok.AllArgsConstructor;
import lombok.Value;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;

public class MetaGeneratorTest {

  @Test
  public void generateXmlSuccessFullMetaFile() throws IOException {
    var processor = new ResourcePathProcessor("testdata/dwca/ware_hosono-v1.5-csv-namespaced/");
    var core = processor.generateMetaConfig(processor.uri("event15584133909797684527.txt"));
    var extensions = List.of("emof15584133909797684527.txt", "occurrence15584133909797684527.txt").stream()
      .map(processor::uri)
      .map(processor::generateMetaConfig)
      .collect(Collectors.toList());
    var generator = new MetaGenerator();

    var generatedXmlFile = generator.generateXml(core, extensions,
      Files.createTempDirectory("iobis-dwca-meta"));

    assertThat(generatedXmlFile).isPresent();
    var originalXmlUrl = Resources.getResource("testdata/dwca/ware_hosono-v1.5/meta.xml");
    var expectedXml = Resources.toString(originalXmlUrl, Charsets.UTF_8);
    var actualXml = Files.lines(generatedXmlFile.get().toPath()).collect(Collectors.joining());
    assertThat(expectedXml).isEqualToIgnoringWhitespace(actualXml.replaceAll("\\d+\\.txt", ".txt"));
  }

  @Value
  @AllArgsConstructor
  private static class ResourcePathProcessor {
    private static final Map<String, String> ROW_TYPE_MAP =
      Map.of(
        "event15584133909797684527.txt", "http://rs.tdwg.org/dwc/terms/Event",
        "emof15584133909797684527.txt", "http://rs.iobis.org/obis/terms/ExtendedMeasurementOrFact",
        "occurrence15584133909797684527.txt", "http://rs.tdwg.org/dwc/terms/Occurrence");
    private final String baseDir;

    MetaFileConfig generateMetaConfig(URI uri) {
      try {
        var relativeUri = Resources.getResource(baseDir).toURI().relativize(uri).getPath();
        return new MetaFileConfig(List.of(relativeUri), ROW_TYPE_MAP.get(relativeUri), uri);
      } catch (URISyntaxException e) {
        throw new RuntimeException(e);
      }
    }

    URI uri(String path) {
      try {
        return Resources.getResource(baseDir + path).toURI();
      } catch (URISyntaxException e) {
        throw new RuntimeException(e);
      }
    }
  }
}
