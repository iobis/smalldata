package org.obis.smalldata.webapi;

import io.vertx.core.http.HttpHeaders;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.RoutingContext;

class DwcaHandler {

  static void get(RoutingContext context) {
    var dataset = context.request().getParam("datasetRef");
    context
        .vertx()
        .eventBus()
        .<JsonObject>send(
            "dwca",
            new JsonObject().put("action", "generate").put("dataset", dataset),
            zip -> {
              var path = zip.result().body().getString("path");
              context
                  .response()
                  .putHeader(HttpHeaders.CONTENT_TYPE, "application/zip")
                  .putHeader(
                      HttpHeaders.CONTENT_DISPOSITION,
                      "attachment; filename=\"" + path.substring(path.lastIndexOf("/")+1) + "\"")
                  .putHeader(HttpHeaders.TRANSFER_ENCODING, "chunked")
                  .sendFile(path);
            });
  }

  private DwcaHandler() {}
}
