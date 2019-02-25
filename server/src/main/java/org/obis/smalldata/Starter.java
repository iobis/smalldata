package org.obis.smalldata;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import org.obis.smalldata.rss.RssComponent;
import org.obis.smalldata.webapi.WebApi;
import org.pmw.tinylog.Logger;

public class Starter extends AbstractVerticle {

  @Override
  public void start(Future<Void> startFuture) {
    vertx.deployVerticle(WebApi.class.getName());
    vertx.deployVerticle(RssComponent.class.getName());
  }

}
