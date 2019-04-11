package org.obis.util.dwctojson;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

public class TableNamespaceMapper {

  private final Map<String, String> record;
  private final List<String> specificNamespaceCols = KeyCollections.COL_HEADER_NAMESPACES.values().stream()
    .flatMap(List::stream)
    .collect(Collectors.toList());

  public TableNamespaceMapper(Map<String, String> record) {
    this.record = record;
  }

  Map<String, Object> mapTableNamespace(String namespace, Collection<String> keyCollection) {
    return mapTableNamespace(namespace, keyCollection, key -> !specificNamespaceCols.contains(key));
  }

  Map<String, Object> mapTableNamespace(String namespace, Collection<String> keyCollection, Predicate<String> keyFilter) {
    var converters = KeyCollections.TYPE_COLUMNS.get(namespace);
    return keyCollection.stream()
      .filter(keyFilter)
      .filter(k -> !record.get(k).isBlank())
      .collect(Collectors.toMap(
        Function.identity(),
        k -> {
          if (converters.keySet().contains(k)) {
            return converters.get(k).apply(record.get(k));
          } else {
            return record.get(k);
          }
        }));
  }
}
