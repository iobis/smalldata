package org.obis.smalldata.webapi;

import io.vertx.core.http.HttpHeaders;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.RoutingContext;

import static org.pmw.tinylog.Logger.info;

public class DwcaRecordsHandler {

  public static void put(RoutingContext context) {
    info("context: {}", context.request());
    info("host: {}", context.request().host());
    context
      .response()
      .putHeader(HttpHeaders.CONTENT_TYPE, "application/json")
      .end(new JsonObject().put("occurenceID", "some ID").encode());
  }

  public static void post(RoutingContext context) {
    if (!validate(context.getBodyAsJson())) {
      context.response()
        .setStatusCode(400)
        .setStatusMessage("Invalid request body");
    }
    var datasetRef = context.request().getParam("datasetRef");
    var userRef = context.request().getParam("userRef");
    context.vertx().eventBus().<JsonObject>send(
      "dwca.record",
      new JsonObject().put("action", "insert")
        .put("datasetRef", datasetRef)
        .put("userRef", userRef)
        .put("record", context.getBodyAsJson()),
      ar -> context.response()
        .putHeader(HttpHeaders.CONTENT_TYPE, "application/json")
        .end(ar.result().body().encode()));
  }

  private static boolean validate(JsonObject dwcaRecord) {
    info(dwcaRecord);
    return true;
  }

  private DwcaRecordsHandler() {
  }
}
