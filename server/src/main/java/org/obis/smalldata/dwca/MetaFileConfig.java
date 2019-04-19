package org.obis.smalldata.dwca;

import lombok.AllArgsConstructor;
import lombok.Value;

import java.net.URI;
import java.util.List;

@Value
@AllArgsConstructor
class MetaFileConfig {
  private final List<String> files;
  private final String rowType;
  private final URI uri;
}
