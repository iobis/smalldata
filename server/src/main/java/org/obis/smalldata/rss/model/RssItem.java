package org.obis.smalldata.rss.model;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlText;
import lombok.Builder;
import lombok.Value;

import java.net.MalformedURLException;
import java.net.URL;
import java.time.Instant;

@Value
@Builder
@JacksonXmlRootElement(localName = "item")
public class RssItem {
  @JacksonXmlProperty
  private String title;
  @JacksonXmlProperty
  private URL link;
  @JacksonXmlProperty
  private String description;
  @JacksonXmlProperty
  private String author;
  @JacksonXmlProperty(localName = "ipt:dwca")
  private URL dwca;
  @JacksonXmlProperty(localName = "ipt:eml")
  private URL eml;
  @JacksonXmlProperty
  private Instant pubDate = Instant.now();
  @JacksonXmlProperty
  private Guid guid = Guid.builder().build();

  @Builder
  static class Guid {
    @JacksonXmlProperty(isAttribute = true)
    @Builder.Default
    private boolean isPermaLink = false;
    @JacksonXmlText
    private URL url;

    {
      try {
        url = new URL("http://ipt.iobis.org/training/resource?id=test-kurt2/v1.0");
      } catch (MalformedURLException e) {
        e.printStackTrace();
      }
    }
  }
}
