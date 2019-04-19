package org.obis.smalldata.rss.xmlmodel;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Value;

@Value
@RequiredArgsConstructor
@JacksonXmlRootElement(localName = "rss")
public class RssFeed {

  @JacksonXmlProperty(isAttribute = true)
  private String version = "2.0";

  @JacksonXmlProperty(isAttribute = true, localName = "xmlns:ipt")
  private String xmlnsIpt = "http://ipt.gbif.org/";

  @JacksonXmlProperty(isAttribute = true, localName = "xmlns:atom")
  private String xmlnsAtom = "http://www.w3.org/2005/Atom";

  @JacksonXmlProperty(isAttribute = true, localName = "xmlns:geo")
  private String xmlnsGeo = "http://www.w3.org/2003/01/geo/wgs84_pos#";

  @JacksonXmlProperty
  @NonNull
  private Channel channel;
}
