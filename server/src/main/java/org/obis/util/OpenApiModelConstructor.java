package org.obis.util;

import org.obis.util.model.DarwinCoreExtension;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.util.Map.entry;

public class OpenApiModelConstructor {

  private NamespaceMapper nsMapper = NamespaceMapper.INSTANCE;

  private void addPropertyRequired(Map<String, Map<String, Object>> apiRaw, Map<String, Object> prop, String ns) {
    if (prop.get("required").equals("true")) {
      if (!apiRaw.get(ns).containsKey("required")) {
        apiRaw.get(ns).put("required", new ArrayList<String>());
      }
      ((List<String>)apiRaw.get(ns).get("required")).add((String)prop.get("name"));
    }
  }

  private void addProperty(Map<String, Object> prop, Map<String, Object> propertyMap) {
    var examples = prop.containsKey("examples") ? prop.get("examples") : "--";
    var type = prop.containsKey("type") ? prop.get("type") : "string";
    propertyMap.put((String)prop.get("name"),
      Map.ofEntries(
        entry("type", type),
        entry("description",  prop.get("description") + " *-- examples: " + examples + "*"),
        entry("example", "-- " + examples + " --")));
  }

  private Map<String, Object> extractPropertyMap(Map<String, Map<String, Object>> apiRaw, String ns) {
    Map<String, Object> propertyMap;
    if (apiRaw.containsKey(ns)) {
      propertyMap = (Map<String, Object>) apiRaw.get(ns).get("properties");
    } else {
      propertyMap = new HashMap<>();
      Map<String, Object> nsMap = new HashMap<>();
      nsMap.put("type", "object");
      nsMap.put("properties", propertyMap);
      apiRaw.put(ns, nsMap);
    }
    return propertyMap;
  }

  Map<String, Map<String, Object>> constructApiModel(DarwinCoreExtension xml) {
    Map<String, Map<String, Object>> apiRaw = new HashMap<>();
    xml.getProperties()
      .forEach(prop -> {
        String ns = nsMapper.getKey((String)prop.get("namespace"));
        Map<String, Object> propertyMap = extractPropertyMap(apiRaw, ns);
        addProperty(prop, propertyMap);
        addPropertyRequired(apiRaw, prop, ns);
      });
    return apiRaw;
  }

}
