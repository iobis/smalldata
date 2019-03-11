package org.obis.util;

import java.util.HashMap;
import java.util.Map;

public enum NamespaceMapper {
  INSTANCE;

  private Map<String, String> keyNs = new HashMap<>();
  private Map<String, String> nsKey = new HashMap<>();

  public void put(String key, String ns) {
    keyNs.put(key, ns);
    nsKey.put(ns, key);
  }

  public String getNs(String key) {
    return keyNs.get(key);
  }

  public String getKey(String ns) {
    return nsKey.get(ns);
  }
}
