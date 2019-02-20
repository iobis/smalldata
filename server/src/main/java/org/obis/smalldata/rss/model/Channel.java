package org.obis.smalldata.rss.model;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Builder;
import lombok.NonNull;
import lombok.Value;

import java.net.URL;
import java.time.Instant;
import java.util.List;

@Value
@Builder
public class Channel {

  @JacksonXmlProperty
  private String title;
  @JacksonXmlProperty
  private URL link;
  @JacksonXmlProperty(localName = "atom:link")
  private AtomLink atomLink;
  @JacksonXmlProperty
  private String description;
  @JacksonXmlProperty
  @Builder.Default
  private String language = "en-US";
  @JacksonXmlProperty
  @Builder.Default
  private Instant lastBuildDate = Instant.now();
  @JacksonXmlProperty
  private String generator = "SmallData r...";
  @JacksonXmlProperty
  private URL docs;
  @JacksonXmlProperty(localName = "item")
  private List<RssItem> itemList;

  @Value
  @Builder
  static class AtomLink {
    @JacksonXmlProperty(isAttribute = true)
    @Builder.Default
    private String rel = "self";
    @JacksonXmlProperty(isAttribute = true)
    @Builder.Default
    private String type = "application/rss+xml";
    @JacksonXmlProperty(isAttribute = true)
    @NonNull
    private URL href;
  }
}
