package org.obis.smalldata;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.DeploymentOptions;
import io.vertx.core.Future;
import io.vertx.core.json.JsonObject;
import org.obis.smalldata.auth.Auth;
import org.obis.smalldata.dataset.DatasetComponent;
import org.obis.smalldata.dbcontroller.EmbeddedDb;
import org.obis.smalldata.dwca.Dwca;
import org.obis.smalldata.rss.RssComponent;
import org.obis.smalldata.user.User;
import org.obis.smalldata.webapi.WebApi;
import org.obis.util.Urls;

import java.util.Map;
import java.util.Set;

import static org.pmw.tinylog.Logger.debug;
import static org.pmw.tinylog.Logger.error;
import static org.pmw.tinylog.Logger.info;

public class Starter extends AbstractVerticle {

  private static final JsonObject CONFIG_DEFAULT_STORAGE = new JsonObject()
    .put("bindIp", "localhost")
    .put("port", 27017)
    .put("path", "");

  @Override
  public void start(Future<Void> startFuture) {
    debug("starting the application with config: {}", config().encodePrettily());
    var baseUrl = (String) config().getValue("baseUrl", "http://localhost:3000/");
    var mode = config().getValue("mode", "DEV");

    if (!Urls.isValid(baseUrl)) {
      var message = "BaseUrl is not valid, must be http or https protocol";
      error(message);
      startFuture.fail(message);
    }
    if (!Set.of("DEV", "DEMO").contains(mode) && Urls.isLocalhost(baseUrl)) {
      var message = "You can set the base url to localhost (127.0.0.x) only when running in 'DEV' or 'DEMO' mode";
      error(message);
      startFuture.fail(message);
    }

    vertx.sharedData()
      .getLocalMap("settings")
      .putAll(Map.of(
        "baseUrl", Urls.normalize(baseUrl),
        "mode", mode,
        "storage", config().getJsonObject("storage", CONFIG_DEFAULT_STORAGE)));

    vertx.deployVerticle(
      EmbeddedDb.class.getName(),
      new DeploymentOptions().setConfig(config().getJsonObject("storage")),
      ar -> {
        info("Deployed Embedded DB verticle {}", ar.result());
        deploy(User.class, "user");
        deploy(Dwca.class, "dwca");
        deploy(RssComponent.class, "rss");
        deploy(WebApi.class, "http");
        deploy(Auth.class, "auth");
        deploy(DatasetComponent.class, "dataset");
      });
  }

  private void deploy(Class verticleClass, String configKey) {
    vertx.deployVerticle(
      verticleClass.getName(),
      new DeploymentOptions()
        .setConfig(config().getJsonObject(configKey)));
  }
}
