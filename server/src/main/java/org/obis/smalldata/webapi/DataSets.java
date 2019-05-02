package org.obis.smalldata.webapi;

import io.vertx.core.json.JsonArray;
import io.vertx.ext.web.RoutingContext;

import static org.pmw.tinylog.Logger.info;

class DataSetsHandler {

 static void get(RoutingContext context) {
    info("context: {}", context.request());
    var dataset = context.request().getParam("dataset");
    context.response().end(new JsonArray().encode());
  }

  private DataSetsHandler() {}
}
