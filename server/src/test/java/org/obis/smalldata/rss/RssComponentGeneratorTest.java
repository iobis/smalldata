package org.obis.smalldata.rss;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.obis.smalldata.rss.xmlmodel.Channel;
import org.obis.smalldata.rss.xmlmodel.RssFeed;
import org.obis.smalldata.rss.xmlmodel.RssItem;
import org.obis.smalldata.util.IoFile;

import java.net.MalformedURLException;
import java.net.URL;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class RssComponentGeneratorTest {

  private static final RssGenerator RSS_GENERATOR = new RssGenerator();

  @Test
  @DisplayName("basic rss: expect same content")
  public void writeRssAsString() throws MalformedURLException {
    var rssFeed = new RssFeed(Channel.builder()
      .title("title")
      .link(new URL("http://localhost"))
      .lastBuildDate(Instant.parse("2019-02-22T17:18:56.127701Z"))
      .atomLink(Channel.AtomLink.builder()
        .href(new URL("http://ipt.iobis.org/training/rss.do"))
        .build())
      .description("some description")
      .itemList(List.of(
        new String[]{"http://ipt.iobis.org/training/resource/daily", "2019-02-22T17:18:56.127535Z"},
        new String[]{"http://ipt.iobis.org/training/resource?id=test-kurt2/v1.0", "2019-02-22T17:18:56.127666Z"})
        .stream()
        .map(item -> {
          try {
            return RssItem.builder()
              .pubDate(Instant.parse(item[1]))
              .guid(RssItem.Guid.builder()
                .isPermaLink(false)
                .url(new URL(item[0]))
                .build())
              .build();
          } catch (MalformedURLException e) {
            throw new RuntimeException(e);
          }
        })
        .collect(Collectors.toList()))
      .language("nl-BE")
      .build());

    var actualRssXml = RSS_GENERATOR.writeRssAsString(rssFeed).replaceAll("\r\n", "\n");

    assertEquals(IoFile.loadFromResources("rss/rss.xml"), actualRssXml);
  }
}
