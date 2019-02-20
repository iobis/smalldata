package org.obis.smalldata.rss.model;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;
import java.util.stream.Collectors;

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
    .atomLink(Channel.AtomLink.builder()
      .href(new URL("http://ipt.iobis.org/training/rss.do"))
      .build())
    .description("some description")
    .itemList(List.of(
      "http://ipt.iobis.org/training/resource/daily",
      "http://ipt.iobis.org/training/resource?id=test-kurt2/v1.0")
      .stream()
      .map(url -> {
        try {
          return RssItem.builder()
            .guid(RssItem.Guid.builder()
              .url(new URL(url))
              .build()).build();
        } catch (MalformedURLException e) {
          e.printStackTrace();
          return null;
        }
      })
      .collect(Collectors.toList()))
    .language("nl-BE")
    .build();

  public RssFeed() throws MalformedURLException {
  }
}
