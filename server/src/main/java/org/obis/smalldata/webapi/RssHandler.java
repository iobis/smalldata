package org.obis.smalldata.webapi;

import io.vertx.core.AsyncResult;
import io.vertx.core.Handler;
import io.vertx.core.eventbus.Message;
import io.vertx.core.http.HttpHeaders;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.RoutingContext;
import org.pmw.tinylog.Logger;

public class RssHandler {

  static void fetch(RoutingContext context) {
    var periodicity = context.request().getParam("periodicity");
    Logger.info("Getting RSS for periodicity: {}", periodicity);

    context.vertx().eventBus().send("internal.rss", new JsonObject(),
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
      });
  }
}
