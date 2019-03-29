package org.obis.util.apicustomizers;

import lombok.Value;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import static org.pmw.tinylog.Logger.debug;
import static org.pmw.tinylog.Logger.warn;

public class CustomFieldMerger implements Function<Map<String, Map<String, Object>>, Map<String, Map<String, Object>>> {

  private Map<QualTerm, Map<String, Object>> fieldMap = Map.of(
    new QualTerm("dwcg", "habitat"), Map.of("example", "oak savanna")
  );

  @Override
  public Map<String, Map<String, Object>> apply(Map<String, Map<String, Object>> api) {
    fieldMap.forEach(new FieldMerger(api)::mergeCustomFields);
    return api;
  }

  @Value
  private static class QualTerm {
    private final String ns;
    private final String term;
  }

  @Value
  private static class FieldMerger {
    private final Map<String, Map<String, Object>> api;

    private void mergeCustomFields(QualTerm qt, Map<String, Object> customFields) {
      try {
        Map<String, Object> apiFields = new HashMap(
          (Map<String, Object>) ((Map<String, Object>) api.get(qt.getNs()).get("properties")).get(qt.getTerm()));
        apiFields.putAll(customFields);
        ((Map<String, Object>) api.get(qt.getNs()).get("properties")).put(qt.getTerm(), apiFields);
        debug("merged fields for term '{}.{}': {}", qt.getNs(), qt.getTerm(), customFields);
      } catch (NullPointerException npe) {
        warn("Skipping field '{}.{}' - not present in model", qt.getNs(), qt.getTerm());
      }
    }
  }
}
