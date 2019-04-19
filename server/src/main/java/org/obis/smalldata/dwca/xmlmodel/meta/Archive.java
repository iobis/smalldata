package org.obis.smalldata.dwca.xmlmodel.meta;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import lombok.Builder;
import lombok.NonNull;
import lombok.Value;

import java.util.List;

@Value
@Builder
@JacksonXmlRootElement(localName = "archive")
public class Archive {

  @SuppressWarnings("PMD.FinalFieldCouldBeStatic")
  @JacksonXmlProperty(isAttribute = true)
  private final String xmlns = "http://rs.tdwg.org/dwc/text/";

  @JacksonXmlProperty(isAttribute = true)
  @NonNull
  private final String metadata;

  @JacksonXmlProperty
  @NonNull
  private final Core core;

  @JacksonXmlProperty(localName = "extension")
  private final List<Extension> extensionList;
}
