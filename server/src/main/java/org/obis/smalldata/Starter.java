package org.obis.smalldata;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import org.obis.smalldata.rss.Rss;
import org.obis.smalldata.webapi.WebApi;

public class Starter extends AbstractVerticle {

  @Override
  public void start(Future<Void> startFuture) {
    vertx.deployVerticle(WebApi.class.getName());
    vertx.deployVerticle(Rss.class.getName());
  }

}
