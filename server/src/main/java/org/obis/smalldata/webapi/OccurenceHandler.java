package org.obis.smalldata.webapi;

import io.vertx.core.http.HttpHeaders;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.RoutingContext;
import org.pmw.tinylog.Logger;

public class OccurenceHandler {

  static void post(RoutingContext context) {
    Logger.info("context: {}", context.request());
    context.response()
      .putHeader(HttpHeaders.CONTENT_TYPE, "application/json")
      //.putHeader(HttpHeaders.TRANSFER_ENCODING, "chunked")
      .end(new JsonArray().add(new JsonObject().put("occurenceID", "some ID")).encode());
  }
}
