package org.obis.smalldata.dwca;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import io.vertx.core.json.JsonObject;
import lombok.Value;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.obis.smalldata.dwca.xmlmodel.eml.Dataset;
import org.obis.smalldata.dwca.xmlmodel.eml.Eml;
import org.obis.smalldata.util.IoFile;
import org.xmlunit.builder.DiffBuilder;
import org.xmlunit.diff.DefaultNodeMatcher;
import org.xmlunit.diff.ElementSelectors;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.fail;
import static org.pmw.tinylog.Logger.error;

public class EmlGeneratorTest {

  private static ObjectMapper mapper = new ObjectMapper();
  private static XmlMapper xmlMapper = new XmlMapper();

  @BeforeEach
  void setUp() {
    xmlMapper.setDefaultUseWrapper(false);
    xmlMapper.setSerializationInclusion(JsonInclude.Include.NON_EMPTY);
  }

  @Test
  void testSimpleEml() {
    var datasets = IoFile.loadFromResources("testdata/dwca/datasets.json");
    try {
      var json = (List<Map<String, Object>>) mapper.readValue(datasets,
        new TypeReference<List<Map<String, Object>>>() {});
      json.stream()
        .map(JsonObject::new)
        .map(ds -> ds.mapTo(Dataset.class))
        .map(ds -> Eml.builder().dataset(ds).build())
        .map(eml -> {
          try {
            return new DataSetEmlMap(eml.getDataset().getId(),
              xmlMapper.writerWithDefaultPrettyPrinter().writeValueAsString(eml));
          } catch (JsonProcessingException e) {
            error(e.getMessage());
            return new DataSetEmlMap("", "");
          }
        })
        .forEach(xml -> {
          var diff = DiffBuilder.compare(xml.eml)
            .withTest(IoFile.loadFromResources("testdata/dwca/" + xml.id + ".xml"))
            .withNodeMatcher(new DefaultNodeMatcher(ElementSelectors.byName))
            .checkForSimilar()
            .ignoreWhitespace()
            .normalizeWhitespace()
            .ignoreComments()
            .build();
          assertFalse(diff.hasDifferences());
        });
    } catch (IOException e) {
      error(e.getMessage());
      fail(e.getMessage());
    }
  }

  @Value
  static class DataSetEmlMap {
    private final String id;
    private final String eml;
  }
}
