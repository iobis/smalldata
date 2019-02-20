package org.obis.smalldata.webapi;

import io.vertx.core.AsyncResult;
import io.vertx.core.Handler;
import io.vertx.core.eventbus.Message;
import io.vertx.core.http.HttpHeaders;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.RoutingContext;

public class RssHandler {

  static void fetch(RoutingContext context) {
    context.request().getParam("term");
    context.vertx().eventBus().send("", new JsonObject(),
      (Handler<AsyncResult<Message<String>>>) m -> {
        if (m.failed()) {
          context.fail(m.cause());
        } else {
          var filename = m.result().body();
          context.response()
            .putHeader(HttpHeaders.CONTENT_TYPE, "application/rss+xml")
            .putHeader("Content-Disposition", "attachment; filename=\"" + filename + "\"")
            .putHeader(HttpHeaders.TRANSFER_ENCODING, "chunked")
            .sendFile(filename);
        }
        context.response()
          .putHeader("content-type", "application/json")
          .end(new JsonObject().put("title", "Small Data Status").encode());
      });
  }
}
