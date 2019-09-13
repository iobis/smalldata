package org.obis.smalldata.rss.xmlmodel;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlText;
import java.net.URL;
import java.time.Instant;
import lombok.Builder;
import lombok.NonNull;
import lombok.Value;

@Value
@Builder
@JacksonXmlRootElement(localName = "item")
public class RssItem {
  @JacksonXmlProperty private String title;
  @JacksonXmlProperty private URL link;
  @JacksonXmlProperty private String description;
  @JacksonXmlProperty private String author;

  @JacksonXmlProperty(localName = "ipt:dwca")
  private URL dwca;

  @JacksonXmlProperty(localName = "ipt:eml")
  private URL eml;

  @JacksonXmlProperty @Builder.Default private Instant pubDate = Instant.now();
  @JacksonXmlProperty @NonNull private Guid guid;

  @Builder
  public static class Guid {
    @JacksonXmlProperty(isAttribute = true)
    private boolean isPermaLink;

    @JacksonXmlText @NonNull private URL url;
  }
}
