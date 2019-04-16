package org.obis.smalldata.dwca.xmlmodel.meta;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import lombok.Builder;
import lombok.Value;

import java.util.List;

@Value
@Builder
@JacksonXmlRootElement(localName = "archive")
public class Archive {

  @JacksonXmlProperty
  private Core core;
  @JacksonXmlProperty(localName = "extension")
  private List<Extension> extensionList;
}
