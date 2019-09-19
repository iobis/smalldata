package org.obis.smalldata.rss;

import static org.pmw.tinylog.Logger.info;

import io.vertx.core.AbstractVerticle;

public class RssComponent extends AbstractVerticle {

  @Override
  public void start() {
    vertx.eventBus().consumer("internal.rss", message -> info("Got the message: {} ", message));
  }
}
