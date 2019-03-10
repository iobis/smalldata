package org.obis.smalldata.rss;

import io.vertx.core.AbstractVerticle;

import static org.pmw.tinylog.Logger.info;

public class RssComponent extends AbstractVerticle {

  @Override
  public void start() {
    vertx.eventBus().consumer(
      "internal.rss",
      message -> info("Got the message: {} ", message));
  }
}
