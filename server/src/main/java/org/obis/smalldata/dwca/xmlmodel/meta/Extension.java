package org.obis.smalldata.dwca.xmlmodel.meta;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Value;

import java.util.List;

@Value
@Builder
@JacksonXmlRootElement(localName = "extension")
public class Extension {
  @JacksonXmlProperty(localName = "coreid")
  @Builder.Default
  private CoreId coreId = new CoreId(0);
  @JacksonXmlProperty(localName = "field")
  private List<Field> itemList;

  @AllArgsConstructor
  public static class CoreId {
    @JacksonXmlProperty(isAttribute = true)
    private final int index;
  }

}
