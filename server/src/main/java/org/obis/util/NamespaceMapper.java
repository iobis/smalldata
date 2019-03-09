package org.obis.util;

import java.util.HashMap;

public enum NamespaceMapper {
  INSTANCE;

  private HashMap<String, String> keyNs = new HashMap<>();
  private HashMap<String, String> nsKey = new HashMap<>();

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
