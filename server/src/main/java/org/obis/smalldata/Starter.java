package org.obis.smalldata;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.DeploymentOptions;
import io.vertx.core.Future;
import io.vertx.core.json.JsonObject;
import org.obis.smalldata.auth.AuthComponent;
import org.obis.smalldata.dataset.DatasetComponent;
import org.obis.smalldata.dbcontroller.StorageModule;
import org.obis.smalldata.dwca.DwcaComponent;
import org.obis.smalldata.rss.RssComponent;
import org.obis.smalldata.user.UserComponent;
import org.obis.smalldata.webapi.HttpComponent;
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
    var baseUrl = (String) config().getValue("baseUrl", "http://localhost:8080/");
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
      StorageModule.class.getName(),
      new DeploymentOptions().setConfig(config().getJsonObject("storage")),
      ar -> {
        info("Deployed Embedded DB verticle {}", ar.result());
        deploy(UserComponent.class, "user");
        deploy(DwcaComponent.class, "dwca");
        deploy(RssComponent.class, "rss");
        deploy(HttpComponent.class, "http");
        deploy(AuthComponent.class, "auth");
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
