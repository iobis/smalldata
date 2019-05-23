package org.obis.smalldata.webapi;

import io.vertx.core.http.HttpHeaders;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.RoutingContext;

import static org.pmw.tinylog.Logger.info;

class DwcaHandler {

  static void get(RoutingContext context) {
    info("context: {}", context.request());
    var dataset = context.request().getParam("datasetRef");
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
