package org.obis.smalldata.dwca.xmlmodel.meta;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
@JacksonXmlRootElement(localName = "field")
public class Field {
  @JacksonXmlProperty(isAttribute = true)
  private int index;

  @JacksonXmlProperty(isAttribute = true)
  private String term;
}
