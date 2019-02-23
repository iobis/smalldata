package org.obis.smalldata.rss;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.obis.smalldata.rss.model.Channel;
import org.obis.smalldata.rss.model.RssFeed;
import org.obis.smalldata.rss.model.RssItem;
import util.IoFile;

import java.net.MalformedURLException;
import java.net.URL;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;


public class RssComponentGeneratorTest {

  private RssGenerator rssGenerator = new RssGenerator(true);

  @BeforeEach
  public void beforeEach() {
  }

  @Test
  @DisplayName("Basic rss: expect same content")
  public void generateRss() throws MalformedURLException {
    var rssString = rssGenerator.writeRssAsString(new RssFeed(Channel.builder()
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
                .url(new URL(item[0]))
                .build()).build();
          } catch (MalformedURLException e) {
            e.printStackTrace();
            return null;
          }
        })
        .collect(Collectors.toList()))
      .language("nl-BE")
      .build()));
    IoFile.doWithFileContent("rss/rss.xml", xmlExpected -> assertEquals(xmlExpected, rssString));
  }
}
