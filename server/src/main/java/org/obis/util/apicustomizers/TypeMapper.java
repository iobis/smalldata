package org.obis.util.apicustomizers;

import lombok.Value;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import static org.pmw.tinylog.Logger.info;

public class TypeMapper implements Function<Map<String, Map<String, Object>>, Map<String, Map<String, Object>>> {
  private static final String TYPE = "type";
  private static final String FORMAT = "format";

  @Override
  public Map<String, Map<String, Object>> apply(Map<String, Map<String, Object>> apiMap) {
    apiMap.entrySet().forEach(nsEntry ->
      ((Map<String, Object>) nsEntry.getValue().get("properties"))
        .entrySet().forEach(new Mapper(nsEntry)::mapTypes));
    return apiMap;
  }

  @Value
  static class Mapper {

    private Map.Entry<String, Map<String, Object>> nsEntry;
    private Map<String, Map<String, Object>> typeMapper = Map.of(
      "decimal", Map.of(
        TYPE, "number",
        FORMAT, "float"),
      "uri", Map.of(
        TYPE, "string",
        FORMAT, "uri"),
      "date", Map.of(
        TYPE, "string",
        FORMAT, "iso8601")
    );

    void mapTypes(Map.Entry<String, Object> termEntry) {
      var fields = new HashMap<>((Map<String, Object>) termEntry.getValue());
      var type = (String) fields.get("type");
      if (typeMapper.containsKey(type)) {
        var typeFields = typeMapper.get(type);
        fields.putAll(typeFields);
        termEntry.setValue(fields);
        info("mapped type '{}' for '{}.{}': {}", type, nsEntry.getKey(), termEntry.getKey(), typeFields);
      }
    }
  }
}
