package org.obis.smalldata.webapi;

import io.vertx.core.AsyncResult;
import io.vertx.core.Handler;
import io.vertx.core.eventbus.Message;
import io.vertx.core.http.HttpHeaders;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.RoutingContext;

class RssHandler {

  public static void fetch(RoutingContext context) {
    var periodicity = context.request().getParam("periodicity");
    context
        .vertx()
        .eventBus()
        .send(
            "internal.rss",
            new JsonObject()
                .put("periodicity", periodicity)
                .put("baseUrl", context.request().scheme() + "://" + context.request().host())
                .put("atomLink", context.request().absoluteURI()),
            (Handler<AsyncResult<Message<String>>>)
                m -> {
                  if (m.failed()) {
                    context.fail(m.cause());
                  } else {
                    var filename = m.result().body();
                    context
                        .response()
                        .putHeader(HttpHeaders.CONTENT_TYPE, "application/rss+xml")
                        .putHeader(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + filename.substring(filename.lastIndexOf("/") + 1) + "\"")
                        .putHeader(HttpHeaders.TRANSFER_ENCODING, "chunked")
                        .sendFile(filename);
                  }
                });
  }

  private RssHandler() {}
}
