package org.obis.smalldata.webapi;

import io.vertx.core.http.HttpHeaders;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.RoutingContext;

import static org.pmw.tinylog.Logger.info;

class DwcaHandler {

  public static final String KEY_USER_REF = "userRef";
  public static final String KEY_DWCA_ID = "dwcaId";

  public static void getRecords(RoutingContext context) {
    info("context: {}", context.request());
    context.vertx().eventBus().<JsonArray>send(
       "dwca",
      new JsonObject()
        .put("action", "recordsForUser")
        .put(KEY_USER_REF, context.request().getParam(KEY_USER_REF)),
      records -> context.response().end(records.result().body().encode()));
  }

  public static void getRecord(RoutingContext context) {
    info("context: {}", context.request());
    context.vertx().eventBus().<JsonObject>send(
      "dwca",
      new JsonObject()
        .put("action", "recordForUser")
        .put(KEY_USER_REF, context.request().getParam(KEY_USER_REF))
        .put(KEY_DWCA_ID, context.request().getParam(KEY_DWCA_ID)),
      record -> context.response().end(record.result().body().encode()));
  }

  static void getZip(RoutingContext context) {
    info("context: {}", context.request());
    var dataset = context.request().getParam("dataset");
    context.vertx().eventBus().<JsonObject>send(
      "dwca",
      new JsonObject()
        .put("action", "generate")
        .put("dataset", dataset),
      zip -> {
        var path = zip.result().body().getString("path");
        info("file to send: {}", path);
        context.response()
          .putHeader(HttpHeaders.CONTENT_TYPE, "application/zip")
          .sendFile(path);
      });
  }

  private DwcaHandler() {
  }
}
