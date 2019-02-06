package org.obis.smalldata.rss;

import io.vertx.core.AbstractVerticle;
import org.pmw.tinylog.Logger;

public class Rss extends AbstractVerticle {

  @Override
  public void start () {
    vertx.eventBus().consumer("internal.rss",
      message -> {
        Logger.info("Got the message: {} ", message);
      });
  }
}
