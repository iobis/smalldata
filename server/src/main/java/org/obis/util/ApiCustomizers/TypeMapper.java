package org.obis.util.ApiCustomizers;

import org.pmw.tinylog.Logger;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import static java.util.Map.entry;

public class TypeMapper implements Function<Map<String, Map<String, Object>>, Map<String, Map<String, Object>>> {

  Map<String, Map<String, Object>> typeMapper = Map.ofEntries(
    entry("decimal", Map.of("type", "number", "format", "float")),
    entry("uri", Map.of("type", "string", "format", "uri")),
    entry("date", Map.of("type", "string", "format", "iso8601"))
  );

  @Override
  public Map<String, Map<String, Object>> apply(Map<String, Map<String, Object>> apiMap) {
    apiMap.entrySet().forEach(nsEntry ->
      ((Map<String, Object>)nsEntry.getValue().get("properties"))
        .entrySet().forEach(termEntry -> {
        var fields = new HashMap<> ((Map<String, Object>)termEntry.getValue());
        var type = (String)fields.get("type");
        if (typeMapper.containsKey(type)) {
          var typeFields = typeMapper.get(type);
          fields.putAll(typeFields);
          termEntry.setValue(fields);
          Logger.info("mapped type '{}' for '{}.{}': {}",
            type, nsEntry.getKey(), termEntry.getKey(), typeFields);
        }
      }));
    return apiMap;
  }
}
