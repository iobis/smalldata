package org.obis.smalldata.rss.model;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;

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
  private Channel channel = Channel.builder()
    .title("title")
    .link(new URL("http://localhost"))
    .atomLink(Channel.AtomLink.builder().build())
    .description("some description")
    .itemList(List.of(
      RssItem.builder().build(),
      RssItem.builder().build()))
    .language("nl-BE")
    .build();

  public RssFeed() throws MalformedURLException {
  }
}
