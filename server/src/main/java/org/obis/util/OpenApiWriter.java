package org.obis.util;

import static org.pmw.tinylog.Logger.error;
import static org.pmw.tinylog.Logger.info;

import com.fasterxml.jackson.dataformat.yaml.YAMLGenerator;
import com.fasterxml.jackson.dataformat.yaml.YAMLMapper;
import java.io.File;
import java.io.IOException;
import java.util.Locale;
import java.util.Map;

public class OpenApiWriter {
  private final YAMLMapper yamlMapper =
      new YAMLMapper().enable(YAMLGenerator.Feature.MINIMIZE_QUOTES);

  void writeAsFile(Map<String, Map<String, Object>> api, String extensionName, String targetPath) {
    try {
      var yamlFile =
          new File(targetPath + "/" + extensionName.toLowerCase(Locale.ENGLISH) + ".yaml");
      yamlMapper.writeValue(yamlFile, Map.of(extensionName, Map.of("properties", api)));
      info("written to file {}", yamlFile);
    } catch (IOException e) {
      error(e);
    }
  }
}
