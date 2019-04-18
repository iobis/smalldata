package org.obis.smalldata.dwca;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import io.vertx.core.json.JsonObject;
import org.junit.jupiter.api.Test;
import org.obis.smalldata.dwca.csvmodel.eml.Dataset;
import org.obis.smalldata.util.IoFile;
import org.pmw.tinylog.Logger;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public class EmlGeneratorTest {

  private static ObjectMapper mapper = new ObjectMapper();
  private static XmlMapper xmlMapper = new XmlMapper();
  {
    xmlMapper.setDefaultUseWrapper(false);
    xmlMapper.setSerializationInclusion(JsonInclude.Include.NON_EMPTY);
  }

  @Test
  void testSimpleEml() {
    var datasets = IoFile.loadFromResources("mockdata/dwca/datasets.json");
    try {
      var json = (List<Map<String, Object>>) mapper.readValue(datasets,
        new TypeReference<List<Map<String, Object>>>() {});
      Logger.info(json);
      json.stream()
        .map(JsonObject::new)
        .map(ds -> ds.mapTo(Dataset.class))
        .map(ds -> {
          try {
            return xmlMapper.writerWithDefaultPrettyPrinter().writeValueAsString(ds);
          } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "";
          }
        })
        .forEach(Logger::info);
    } catch (IOException e) {
      e.printStackTrace();
    }


  }
}
