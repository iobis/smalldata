package org.obis.smalldata;

import static org.pmw.tinylog.Logger.debug;
import static org.pmw.tinylog.Logger.error;
import static org.pmw.tinylog.Logger.info;

import io.vertx.config.ConfigRetriever;
import io.vertx.config.ConfigRetrieverOptions;
import io.vertx.config.ConfigStoreOptions;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.DeploymentOptions;
import io.vertx.core.Future;
import io.vertx.core.Vertx;
import io.vertx.core.VertxOptions;
import io.vertx.core.json.JsonObject;
import java.util.Map;
import java.util.Set;
import org.obis.smalldata.auth.AuthComponent;
import org.obis.smalldata.dataset.DatasetComponent;
import org.obis.smalldata.dbcontroller.StorageModule;
import org.obis.smalldata.dwca.DwcaComponent;
import org.obis.smalldata.rss.RssComponent;
import org.obis.smalldata.user.UserComponent;
import org.obis.smalldata.webapi.HttpComponent;
import org.obis.util.Urls;

public class Starter extends AbstractVerticle {

  private static final JsonObject CONFIG_DEFAULT_STORAGE =
      new JsonObject().put("bindIp", "localhost").put("port", 27017).put("path", "");

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
      var message =
          "You can set the base url to localhost (127.0.0.x) only when running in 'DEV' or 'DEMO' mode";
      error(message);
      startFuture.fail(message);
    }

    vertx
        .sharedData()
        .getLocalMap("settings")
        .putAll(
            Map.of(
                "baseUrl", Urls.normalize(baseUrl),
                "mode", mode,
                "storage", config().getJsonObject("storage", CONFIG_DEFAULT_STORAGE)));

    vertx.deployVerticle(
        StorageModule.class.getName(),
        new DeploymentOptions().setConfig(config().getJsonObject("storage")),
        ar ->
            vertx.deployVerticle(
                HttpComponent.class.getName(),
                new DeploymentOptions().setConfig(config()),
                arHttp -> {
                  info("Deployed Embedded DB verticle {}", ar.result());
                  deploy(AuthComponent.class, "auth");
                  deploy(DatasetComponent.class, "dataset");
                  deploy(DwcaComponent.class, "dwca");
                  deploy(RssComponent.class, "rss");
                  deploy(UserComponent.class, "user");
                }));
  }

  private void deploy(Class verticleClass, String configKey) {
    vertx.deployVerticle(
        verticleClass.getName(),
        new DeploymentOptions().setConfig(config().getJsonObject(configKey)));
  }

  public static void main(String... args) {
    var vertx = Vertx.vertx();
    ConfigRetriever retriever =
        ConfigRetriever.create(
            vertx,
            new ConfigRetrieverOptions()
                .addStore(
                    new ConfigStoreOptions()
                        .setType("file")
                        .setConfig(new JsonObject().put("path", "./server/config/config.json"))));
    retriever.getConfig(
        json -> {
          JsonObject result = json.result();
          vertx.close();
          VertxOptions options = new VertxOptions(result);
          Vertx newVertx = Vertx.vertx(options);
          newVertx.deployVerticle(
              Starter.class.getName(), new DeploymentOptions().setConfig(result));
        });
  }
}
