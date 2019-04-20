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

import static org.assertj.core.api.Assertions.assertThat;

public class EmlGeneratorTest {

  private static ObjectMapper mapper = new ObjectMapper();

  @Test
  void generateDataSetEmlMapsFromJson() throws IOException {
    var emlGenerator = new EmlGenerator();
    var datasets = IoFile.loadFromResources("testdata/dwca/datasets.json");

    var json = mapper.<List<Map<String, Object>>>readValue(
      datasets,
      new TypeReference<List<Map<String, Object>>>() {
      });

    assertThat(json).hasSize(4);
    json.stream()
      .map(JsonObject::new)
      .map(emlGenerator::generate)
      .map(Optional::get)
      .map(xml -> DiffBuilder
        .compare(xml.getEml())
        .withTest(IoFile.loadFromResources("testdata/dwca/" + xml.getId() + ".xml"))
        .withNodeMatcher(new DefaultNodeMatcher(ElementSelectors.byName))
        .checkForSimilar()
        .ignoreWhitespace()
        .normalizeWhitespace()
        .ignoreComments()
        .build())
      .forEach(diff -> assertThat(diff.hasDifferences()).isFalse());
  }
}
