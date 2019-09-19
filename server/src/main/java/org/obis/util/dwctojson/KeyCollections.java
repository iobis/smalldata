package org.obis.util.dwctojson;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

class KeyCollections {

  static final Map<String, List<String>> COL_HEADER_NAMESPACES =
      Map.of(
          "purl", List.of("type", "modified", "bibliographicCitation", "references"),
          "iobis", List.of("measurementTypeID", "measurementValueID", "measurementUnitID"),
          "tdwg", Collections.emptyList(),
          "*", List.of("id"));

  static final Map<String, Map<String, Function<String, Object>>> TYPE_COLUMNS =
      Map.of(
          "purl", Collections.emptyMap(),
          "iobis", Collections.emptyMap(),
          "tdwg",
              Map.of(
                  "decimalLongitude", Double::parseDouble,
                  "decimalLatitude", Double::parseDouble,
                  "maximumDepthInMeters", Double::parseDouble,
                  "minimumDepthInMeters", Double::parseDouble,
                  "day", Integer::parseInt,
                  "month", Integer::parseInt,
                  "year", Integer::parseInt));
}
