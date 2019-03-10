package org.obis.util;

import org.obis.util.model.DarwinCoreExtension;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.util.Map.entry;

public class OpenApiModelConstructor {

  private static final String REQUIRED = "required";
  private static final String TYPE = "type";

  private static final NamespaceMapper NS_MAPPER = NamespaceMapper.INSTANCE;

  private void addPropertyRequired(Map<String, Map<String, Object>> apiRaw, Map<String, Object> prop, String ns) {
    if ("true".equals(prop.get(REQUIRED))) {
      if (!apiRaw.get(ns).containsKey(REQUIRED)) {
        apiRaw.get(ns).put(REQUIRED, new ArrayList<String>());
      }
      ((List<String>) apiRaw.get(ns).get(REQUIRED)).add((String) prop.get("name"));
    }
  }

  private void addProperty(Map<String, Object> prop, Map<String, Object> propertyMap) {
    var examples = prop.getOrDefault("examples", "--");
    var type = prop.getOrDefault(TYPE, "string");
    propertyMap.put((String) prop.get("name"),
      Map.ofEntries(
        entry(TYPE, type),
        entry("description", prop.get("description") + " *-- examples: " + examples + "*"),
        entry("example", "-- " + examples + " --")));
  }

  private Map<String, Object> extractPropertyMap(Map<String, Map<String, Object>> apiRaw, String ns) {
    Map<String, Object> propertyMap;
    if (apiRaw.containsKey(ns)) {
      propertyMap = (Map<String, Object>) apiRaw.get(ns).get("properties");
    } else {
      propertyMap = new HashMap<>();
      Map<String, Object> nsMap = new HashMap<>();
      nsMap.put(TYPE, "object");
      nsMap.put("properties", propertyMap);
      apiRaw.put(ns, nsMap);
    }
    return propertyMap;
  }

  Map<String, Map<String, Object>> constructApiModel(DarwinCoreExtension xml) {
    Map<String, Map<String, Object>> apiRaw = new HashMap<>();
    xml.getProperties()
      .forEach(prop -> {
        String ns = NS_MAPPER.getKey((String) prop.get("namespace"));
        Map<String, Object> propertyMap = extractPropertyMap(apiRaw, ns);
        addProperty(prop, propertyMap);
        addPropertyRequired(apiRaw, prop, ns);
      });
    return apiRaw;
  }

}
