package org.obis.util.apicustomizers;

import lombok.Value;
import org.pmw.tinylog.Logger;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import static java.util.Map.entry;

public class CustomFieldMerger implements Function<Map<String, Map<String, Object>>, Map<String, Map<String, Object>>> {

  private Map<QualTerm, Map<String, Object>> fieldMap = Map.ofEntries(
    entry(new QualTerm("dwcg", "habitat"),
      Map.ofEntries(
        entry("example", "oak savanna")
      ))
  );

  @Value
  static class QualTerm {
    private final String ns;
    private final String term;
  }

  @Value
  static class FieldMerger {

    private final Map<String, Map<String, Object>> api;

    private void mergeCustomFields(QualTerm qt, Map<String, Object> customFields) {
      try {
        Map<String, Object> apiFields = new HashMap(
          (Map<String, Object>) ((Map<String, Object>) api.get(qt.getNs()).get("properties")).get(qt.getTerm()));
        apiFields.putAll(customFields);
        ((Map<String, Object>) api.get(qt.getNs()).get("properties")).put(qt.getTerm(), apiFields);
        Logger.debug("merged fields for term '{}.{}': {}", qt.getNs(), qt.getTerm(), customFields);
      } catch (NullPointerException npe) {
        Logger.warn("Skipping field '{}.{}' - not present in model", qt.getNs(), qt.getTerm());
      }
    }
  }

  public Map<String, Map<String, Object>> apply(Map<String, Map<String, Object>> api) {
    fieldMap.forEach(new FieldMerger(api)::mergeCustomFields);
    return api;
  }
}
