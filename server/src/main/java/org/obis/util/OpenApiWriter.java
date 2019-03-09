package org.obis.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.dataformat.yaml.YAMLGenerator;
import com.fasterxml.jackson.dataformat.yaml.YAMLMapper;
import org.pmw.tinylog.Logger;

import java.io.File;
import java.io.IOException;
import java.util.Map;

public class OpenApiWriter {
  private YAMLMapper yamlMapper = new YAMLMapper().enable(YAMLGenerator.Feature.MINIMIZE_QUOTES);

  void writeAsString(Map<String, Map<String, Object>> api, String extensionName) {
    try {
      Logger.info(yamlMapper.writeValueAsString(
        Map.of(extensionName,
          Map.of("properties", api))));
    } catch (JsonProcessingException e) {
      e.printStackTrace();
    }
  }

  void writeAsFile(Map<String, Map<String, Object>> api, String extensionName, String targetPath) {
    try {
      var yamlFile = new File(targetPath + "/" + extensionName.toLowerCase() + ".yaml");
      yamlMapper.writeValue(yamlFile,
        Map.of(extensionName,
          Map.of("properties", api)));
      Logger.info("written to file {}", yamlFile);
    } catch (JsonProcessingException e) {
      e.printStackTrace();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

}
