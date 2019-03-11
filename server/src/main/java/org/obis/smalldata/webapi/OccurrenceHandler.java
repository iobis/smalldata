package org.obis.smalldata.webapi;

import io.vertx.core.http.HttpHeaders;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.RoutingContext;

import static org.pmw.tinylog.Logger.info;

public class OccurrenceHandler {

  static void post(RoutingContext context) {
    info("context: {}", context.request());
    context
      .response()
      .putHeader(HttpHeaders.CONTENT_TYPE, "application/json")
      .end(new JsonObject().put("occurenceID", "some ID").encode());
  }
}
