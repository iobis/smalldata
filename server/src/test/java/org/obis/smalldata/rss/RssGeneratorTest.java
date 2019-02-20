package org.obis.smalldata.rss;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.obis.smalldata.rss.model.Channel;
import org.obis.smalldata.rss.model.RssFeed;
import org.obis.smalldata.rss.model.RssItem;
import org.pmw.tinylog.Logger;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;
import java.util.stream.Collectors;


public class RssGeneratorTest {

  private RssGenerator rssGenerator = new RssGenerator(true);

  @BeforeEach
  public void beforeEach() {
  }

  @Test
  @DisplayName("Basic rss")
  public void generateRss() throws MalformedURLException {
    Logger.info(rssGenerator.writeRssAsString(new RssFeed(Channel.builder()
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
      .build())));
  }
}
