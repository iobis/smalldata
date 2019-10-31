package org.obis.smalldata.webapi;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.pmw.tinylog.Logger.info;

import io.vertx.core.DeploymentOptions;
import io.vertx.core.Vertx;
import io.vertx.core.buffer.Buffer;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.client.HttpRequest;
import io.vertx.ext.web.client.WebClient;
import io.vertx.ext.web.codec.BodyCodec;
import io.vertx.junit5.Timeout;
import io.vertx.junit5.VertxExtension;
import io.vertx.junit5.VertxTestContext;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.pmw.tinylog.Logger;

@ExtendWith(VertxExtension.class)
public class RssHandlerTest {

  private static final String BASE_URL = "baseUrl";
  private static final String SOME_BASE_URL = "some value";
  private static final int HTTP_PORT = 8080;
  private static final JsonObject CONFIG =
      new JsonObject()
          .put("mode", "DEMO")
          .put("auth", new JsonObject().put("provider", "demo").put("demokey", "verysecret"))
          .put("http", new JsonObject().put("port", HTTP_PORT));
  private static final JsonObject CONFIG_BASEURL = CONFIG.copy().put(BASE_URL, SOME_BASE_URL);

  @Test
  @Timeout(value = 5, timeUnit = TimeUnit.SECONDS)
  void baseUrlDefault(Vertx vertx, VertxTestContext testContext) {
    startRssConsumer(vertx, testContext, "http://localhost:8080");
    startAndCheckBaseUrl(vertx, CONFIG.copy());
  }

  @Test
  @Timeout(value = 5, timeUnit = TimeUnit.SECONDS)
  void baseUrlFromConfig(Vertx vertx, VertxTestContext testContext) {
    startRssConsumer(vertx, testContext, SOME_BASE_URL);
    startAndCheckBaseUrl(vertx, CONFIG_BASEURL);
  }

  @Test
  @Timeout(value = 5, timeUnit = TimeUnit.SECONDS)
  void baseUrlFromHeaderNoConfig(Vertx vertx, VertxTestContext testContext) {
    startRssConsumer(vertx, testContext, "https://a host : port");
    startAndCheckBaseUrl(
        vertx,
        CONFIG,
        req ->
            req.putHeader("X-Forwarded-Host", "a host : port")
                .putHeader("X-Forwarded-Proto", "https"));
  }

  @Test
  @Timeout(value = 5, timeUnit = TimeUnit.SECONDS)
  void baseUrlFromHeaderWithConfig(Vertx vertx, VertxTestContext testContext) {
    startRssConsumer(vertx, testContext, "https://a host : port");
    startAndCheckBaseUrl(
        vertx,
        CONFIG_BASEURL,
        req ->
            req.putHeader("X-Forwarded-Host", "a host : port")
                .putHeader("X-Forwarded-Proto", "https"));
  }

  private void startAndCheckBaseUrl(Vertx vertx, JsonObject configBaseurl) {
    startAndCheckBaseUrl(vertx, configBaseurl, Function.identity());
  }

  private void startAndCheckBaseUrl(
      Vertx vertx,
      JsonObject configBaseurl,
      Function<HttpRequest<Buffer>, HttpRequest<Buffer>> decorateClient) {
    vertx.deployVerticle(
        new HttpComponent(),
        new DeploymentOptions().setConfig(configBaseurl),
        id -> {
          WebClient client = WebClient.create(vertx);
          decorateClient
              .apply(
                  client
                      .get(8080, "localhost", "/api/rss/weekly")
                      .putHeader("Authorization", "Basic verysecret"))
              .as(BodyCodec.string())
              .send(Logger::info);
        });
  }

  private void startRssConsumer(Vertx vertx, VertxTestContext testContext, String expected) {
    vertx
        .eventBus()
        .<JsonObject>consumer(
            "internal.rss",
            message -> {
              info("Got message: {}", message.body());
              var baseUrl = message.body().getString("baseUrl");
              assertEquals(expected, baseUrl);
              vertx.close(done -> testContext.completeNow());
            });
  }
}
