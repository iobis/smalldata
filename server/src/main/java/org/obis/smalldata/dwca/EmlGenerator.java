package org.obis.smalldata.dwca;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.fasterxml.jackson.dataformat.xml.ser.ToXmlGenerator;
import io.vertx.core.json.JsonObject;
import lombok.Value;
import org.obis.smalldata.dwca.xmlmodel.eml.Dataset;
import org.obis.smalldata.dwca.xmlmodel.eml.Eml;

import java.io.File;
import java.io.IOException;
import java.util.Optional;

import static org.pmw.tinylog.Logger.error;

class EmlGenerator {

  private static XmlMapper xmlMapper = new XmlMapper();

  EmlGenerator() {
    xmlMapper.configure(ToXmlGenerator.Feature.WRITE_XML_DECLARATION, false);
    xmlMapper.findAndRegisterModules().configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
    xmlMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
    xmlMapper.setDefaultUseWrapper(false);
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

  boolean writeXml(JsonObject json, File emlFile) {
    return this.writeXml(json.mapTo(Dataset.class), emlFile);
  }

  boolean writeXml(Dataset dataset, File emlFile) {
    return this.writeXml(Eml.builder().dataset(dataset).build(), emlFile);
  }

  boolean writeXml(Eml eml, File emlFile) {
    try {
      xmlMapper.writerWithDefaultPrettyPrinter().writeValue(emlFile, eml);
      return true;
    } catch (IOException e) {
      error(e.getMessage());
      return false;
    }
  }

  @Value
  static class DataSetEmlMap {
    private final String id;
    private final String eml;
  }
}

