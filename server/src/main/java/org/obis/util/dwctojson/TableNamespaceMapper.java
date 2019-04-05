package org.obis.util.dwctojson;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

public class TableNamespaceMapper {

  private static KeyCollections keyCollections = KeyCollections.INSTANCE;

  private final Map<String, Object> record;
  private final List<String> specificNamespaceCols = KeyCollections.INSTANCE.colHeaderNamespaces.values().stream()
    .flatMap(List::stream)
    .collect(Collectors.toList());

  public TableNamespaceMapper(Map<String, Object> record) {
    this.record = record;
  }

  Map<String, Object> mapTableNamespace(String namespace, Collection<String> keyCollection) {
    return mapTableNamespace(namespace, keyCollection, key -> !specificNamespaceCols.contains(key));
  }

  Map<String, Object> mapTableNamespace(String namespace, Collection<String> keyCollection, Predicate<String> keyFilter) {
    var converters = keyCollections.typeColumns.get(namespace);
    return keyCollection.stream()
      .filter(keyFilter)
      .filter(k -> !((String) record.get(k)).isBlank())
      .collect(Collectors.toMap(Function.identity(),
        k -> {
          if (converters.keySet().contains(k)) {
            return converters.get(k).apply((String) record.get(k));
          } else {
            return record.get(k);
          }
        }));
  }
}
