package org.obis.smalldata.dwca;

import java.net.URI;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Value;

@Value
@AllArgsConstructor
class MetaFileConfig {
  private final List<String> files;
  private final String rowType;
  private final URI uri;
}
