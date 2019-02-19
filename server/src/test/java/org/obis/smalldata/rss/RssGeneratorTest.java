package org.obis.smalldata.rss;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.pmw.tinylog.Logger;


public class RssGeneratorTest {

  private RssGenerator rssGenerator = new RssGenerator(true);

  @BeforeEach
  public void beforeEach() {
  }

  @Test
  @DisplayName("Basic rss")
  public void generateRss() {
    Logger.info(rssGenerator.writeRssAsString());
  }
}
