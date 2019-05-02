package org.obis.smalldata.webapi;

import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.RoutingContext;

import static org.pmw.tinylog.Logger.info;

class DataSetsHandler {

  static void get(RoutingContext context) {
    var dataset = context.request().getParam("dataset");
    if (null == dataset) {
      info ("getting all datasets");
      context.vertx().eventBus().<JsonArray>send("dataset",
        new JsonObject(),
        m -> context.response().end(m.result().body().encode()));
    } else {
      info ("getting dataset {}", dataset);
      context.vertx().eventBus().<JsonArray>send("dataset",
        new JsonObject().put("_ref", dataset),
        m -> context.response().end(m.result().body().encode()));

    }

  }

  private DataSetsHandler() {}
}
