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
    var baseUrl = generateBaseUrl(context);

    context
        .vertx()
        .eventBus()
        .send(
            "internal.rss",
            new JsonObject()
                .put("periodicity", periodicity)
                .put("baseUrl", baseUrl)
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
                            "attachment; filename=\""
                                + filename.substring(filename.lastIndexOf("/") + 1)
                                + "\"")
                        .putHeader(HttpHeaders.TRANSFER_ENCODING, "chunked")
                        .sendFile(filename);
                  }
                });
  }

  private static String generateBaseUrl(RoutingContext context) {
    var headers = context.request().headers();
    String baseUrl;
    if (headers.contains("X-Forwarded-Host") && headers.contains("X-Forwarded-Proto")) {
      baseUrl = headers.get("X-Forwarded-Proto") + "://" + headers.get("X-Forwarded-Host");
    } else if (context.vertx().getOrCreateContext().config().containsKey("baseUrl")) {
      baseUrl = context.vertx().getOrCreateContext().config().getString("baseUrl");
    } else {
      baseUrl = context.request().scheme() + "://" + context.request().host();
    }
    return baseUrl;
  }

  private RssHandler() {}
}
