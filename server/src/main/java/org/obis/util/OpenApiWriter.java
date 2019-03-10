package org.obis.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.dataformat.yaml.YAMLGenerator;
import com.fasterxml.jackson.dataformat.yaml.YAMLMapper;

import java.io.File;
import java.io.IOException;
import java.util.Locale;
import java.util.Map;

import static org.pmw.tinylog.Logger.error;
import static org.pmw.tinylog.Logger.info;

public class OpenApiWriter {
  private final YAMLMapper yamlMapper = new YAMLMapper().enable(YAMLGenerator.Feature.MINIMIZE_QUOTES);

  void writeAsString(Map<String, Map<String, Object>> api, String extensionName) {
    try {
      info(yamlMapper.writeValueAsString(
        Map.of(extensionName,
          Map.of("properties", api))));
    } catch (JsonProcessingException e) {
      error(e);
    }
  }

  void writeAsFile(Map<String, Map<String, Object>> api, String extensionName, String targetPath) {
    try {
      var yamlFile = new File(targetPath + "/" + extensionName.toLowerCase(Locale.ENGLISH) + ".yaml");
      yamlMapper.writeValue(
        yamlFile,
        Map.of(extensionName, Map.of("properties", api)));
      info("written to file {}", yamlFile);
    } catch (IOException e) {
      error(e);
    }
  }

}
