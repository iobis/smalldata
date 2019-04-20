package org.obis.smalldata.dwca;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.vertx.core.json.JsonObject;
import org.junit.jupiter.api.Test;
import org.obis.smalldata.util.IoFile;
import org.xmlunit.builder.DiffBuilder;
import org.xmlunit.diff.DefaultNodeMatcher;
import org.xmlunit.diff.ElementSelectors;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertFalse;

public class EmlGeneratorTest {

  private static ObjectMapper mapper = new ObjectMapper();

  @Test
  void testSimpleEml() throws IOException {
    var generator = new EmlGenerator();
    var datasets = IoFile.loadFromResources("testdata/dwca/datasets.json");
    var json = (List<Map<String, Object>>) mapper.readValue(datasets,
      new TypeReference<List<Map<String, Object>>>() {
      });
    json.stream()
      .map(JsonObject::new)
      .map(generator::generate)
      .map(Optional::get)
      .forEach(xml -> {
        var diff = DiffBuilder.compare(xml.getEml())
          .withTest(IoFile.loadFromResources("testdata/dwca/" + xml.getId() + ".xml"))
          .withNodeMatcher(new DefaultNodeMatcher(ElementSelectors.byName))
          .checkForSimilar()
          .ignoreWhitespace()
          .normalizeWhitespace()
          .ignoreComments()
          .build();
        assertFalse(diff.hasDifferences());
      });
  }
}
