package org.obis.util.dwctojson;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

public enum KeyCollections {

  INSTANCE;

  public final Map<String, List<String>> colHeaderNamespaces = Map.of(
    "purl", List.of("type", "modified", "bibliographicCitation", "references"),
    "tdwg", Collections.emptyList(),
    "*", List.of("id"));

  public final Map<String, Map<String, Function<String, Object>>> typeColumns = Map.of(
    "purl", Collections.emptyMap(),
    "tdwg", Map.of("decimalLongitude", Double::parseDouble,
      "decimalLatitude", Double::parseDouble,
      "maximumDepthInMeters", Double::parseDouble,
      "minimumDepthInMeters", Double::parseDouble,
      "day", Integer::parseInt,
      "month", Integer::parseInt,
      "year", Integer::parseInt));

}
