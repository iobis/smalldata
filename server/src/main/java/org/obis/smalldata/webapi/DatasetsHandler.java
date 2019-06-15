package org.obis.smalldata.webapi;

import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.RoutingContext;

import static org.pmw.tinylog.Logger.info;

class DatasetsHandler {

  private static final String ADDRESS_DATASETS = "datasets";

  static void fetch(RoutingContext context) {
    var dataset = context.request().getParam("datasetRef");
    if (dataset == null) {
      info("getting all datasets");
      context.vertx().eventBus().<JsonArray>send(
        ADDRESS_DATASETS,
        new JsonObject().put("action", "find"),
        m -> context.response().end(m.result().body().encode()));
    } else {
      info("getting dataset {}", dataset);
      context.vertx().eventBus().<JsonArray>send(
        ADDRESS_DATASETS,
        new JsonObject()
          .put("action", "find")
          .put("query", new JsonObject()
            .put("ref", dataset)),
        m -> context.response().end(m.result().body().getJsonObject(0).encode()));
    }
  }

  static void post(RoutingContext context) {
    context.vertx().eventBus().<JsonObject>send(
      ADDRESS_DATASETS,
      new JsonObject()
        .put("action", "insert")
        .put("dataset", context.getBodyAsJson()),
      ar -> context.response().end(ar.result().body().encode()));
  }

  private DatasetsHandler() {
  }
}
