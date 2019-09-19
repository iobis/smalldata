package org.obis.smalldata.dwca.xmlmodel.meta;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.NonNull;
import lombok.Value;

@Value
@Builder
@JacksonXmlRootElement(localName = "core")
@EqualsAndHashCode(callSuper = true)
public class Core extends DwcTable {

  @JacksonXmlProperty(isAttribute = true)
  @NonNull
  private final String rowType;

  @JacksonXmlElementWrapper(localName = "files")
  @NonNull
  private final List<String> location;

  @JacksonXmlProperty @Builder.Default @NonNull private final Id id = new Id(0);

  @JacksonXmlProperty(localName = "field")
  @NonNull
  private final List<Field> fieldList;

  @AllArgsConstructor
  public static class Id {
    @JacksonXmlProperty(isAttribute = true)
    private final int index;
  }
}
