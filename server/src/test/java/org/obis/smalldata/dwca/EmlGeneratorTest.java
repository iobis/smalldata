package org.obis.smalldata.dwca;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.vertx.core.json.JsonObject;
import org.junit.jupiter.api.Test;
import org.obis.smalldata.dwca.EmlGenerator.DataSetEmlMap;
import org.obis.util.file.IoFile;
import org.xmlunit.builder.DiffBuilder;
import org.xmlunit.diff.DefaultNodeMatcher;
import org.xmlunit.diff.Diff;
import org.xmlunit.diff.ElementSelectors;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

public class EmlGeneratorTest {

  private static ObjectMapper mapper = new ObjectMapper();

  @Test
  void generateDataSetEmlMapsFromJsonObject() throws IOException {
    var emlGenerator = new EmlGenerator();
    var datasets = IoFile.loadFromResources("testdata/dwca/datasets.json");
    var json = mapper.<List<Map<String, Object>>>readValue(datasets, new TypeReference<List<Map<String, Object>>>() {});

    var dataSetEmlMaps = json.stream()
      .map(JsonObject::new)
      .map(dataset -> emlGenerator.generate(dataset,
        "http://localhost:3000/" + dataset.getString("_ref")))
      .map(Optional::get);

    assertThat(dataSetEmlMaps)
      .hasSameSizeAs(json)
      .hasSize(4)
      .noneMatch(dataSetEmlMap -> diffWithExpectedXml(dataSetEmlMap).hasDifferences());
  }

  private static Diff diffWithExpectedXml(DataSetEmlMap dataSetEmlMap) {
    return DiffBuilder
      .compare(dataSetEmlMap.getEml())
      .withTest(IoFile.loadFromResources("testdata/dwca/" + dataSetEmlMap.getId() + ".xml"))
      .withNodeMatcher(new DefaultNodeMatcher(ElementSelectors.byName))
      .checkForSimilar()
      .ignoreWhitespace()
      .normalizeWhitespace()
      .ignoreComments()
      .build();
  }
}
