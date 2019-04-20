package org.obis.smalldata.dwca;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import io.vertx.core.json.JsonObject;
import lombok.Value;
import org.obis.smalldata.dwca.xmlmodel.eml.Dataset;
import org.obis.smalldata.dwca.xmlmodel.eml.Eml;

import java.util.Optional;

import static org.pmw.tinylog.Logger.error;

class EmlGenerator {

  private static XmlMapper xmlMapper = new XmlMapper();

  EmlGenerator() {
    xmlMapper.setDefaultUseWrapper(false);
    xmlMapper.setSerializationInclusion(JsonInclude.Include.NON_EMPTY);
  }

  Optional<DataSetEmlMap> generate(JsonObject json) {
    return this.generate(json.mapTo(Dataset.class));
  }

  Optional<DataSetEmlMap> generate(Dataset dataset) {
    return this.generate(Eml.builder().dataset(dataset).build());
  }

  Optional<DataSetEmlMap> generate(Eml eml) {
    try {
      return Optional.of(new DataSetEmlMap(
        eml.getDataset().getId(),
        xmlMapper.writerWithDefaultPrettyPrinter().writeValueAsString(eml)));
    } catch (JsonProcessingException e) {
      error(e.getMessage());
      return Optional.empty();
    }
  }

  @Value
  static class DataSetEmlMap {
    private final String id;
    private final String eml;
  }
}

