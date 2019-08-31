package org.obis.smalldata.webapi;

import io.vertx.core.AsyncResult;
import io.vertx.core.Handler;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.client.HttpResponse;
import io.vertx.ext.web.client.WebClient;
import io.vertx.ext.web.codec.BodyCodec;

public class DefaultHandlerTest {

  private static final int HTTP_PORT = 8080;
  private static final String LOCALHOST = "localhost";
  protected static final JsonObject CONFIG = new JsonObject()
    .put("mode", "DEMO")
    .put("auth", new JsonObject().put("provider", "demo").put("demokey", "verysecret"))
    .put("http", new JsonObject().put("port", HTTP_PORT));

  protected void httpGetJsonBody(WebClient client, String url, Handler<AsyncResult<HttpResponse<JsonObject>>> handler) {
    client
      .get(HTTP_PORT, LOCALHOST, url)
      .putHeader("Authorization", "Basic verysecret")
      .as(BodyCodec.jsonObject())
      .send(handler);
  }

  protected void httpGetString(WebClient client, String url, Handler<AsyncResult<HttpResponse<String>>> handler) {
    client
      .get(HTTP_PORT, LOCALHOST, url)
      .putHeader("Authorization", "Basic verysecret")
      .as(BodyCodec.string())
      .send(handler);
  }

  protected void httpPostJsonBody(
    WebClient client,
    String url,
    JsonObject body,
    Handler<AsyncResult<HttpResponse<JsonObject>>> handler) {
    client
      .post(HTTP_PORT, LOCALHOST, url)
      .putHeader("Authorization", "Basic verysecret")
      .as(BodyCodec.jsonObject())
      .sendJson(body, handler);
  }
}
