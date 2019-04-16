package org.obis.smalldata.dwca.model;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Value;

import java.util.List;

@Value
@Builder
@JacksonXmlRootElement(localName = "core")
public class Core {
  @JacksonXmlProperty
  @Builder.Default
  private Id id = new Id(0);
  @JacksonXmlProperty(localName = "field")
  private List<Field> itemList;

  @AllArgsConstructor
  public static class Id {
    @JacksonXmlProperty(isAttribute = true)
    private final int index;
  }

}
