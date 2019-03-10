package org.obis.util.model;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@JacksonXmlRootElement(localName = "extension")
public class DarwinCoreExtension {
  @JacksonXmlProperty(isAttribute = true)
  private String schemaLocation;
  @JacksonXmlProperty(isAttribute = true)
  private String title;
  @JacksonXmlProperty(isAttribute = true)
  private String name;
  @JacksonXmlProperty(isAttribute = true)
  private String namespace;
  @JacksonXmlProperty(isAttribute = true)
  private String rowType;
  @JacksonXmlProperty(isAttribute = true)
  private String issued;
  @JacksonXmlProperty(isAttribute = true)
  private String subject;
  @JacksonXmlProperty(isAttribute = true)
  private String relation;
  @JacksonXmlProperty(isAttribute = true)
  private String description;
  @JacksonXmlProperty(localName = "property")
  @JacksonXmlElementWrapper(useWrapping = false)
  private List<Map<String, Object>> properties;
}
