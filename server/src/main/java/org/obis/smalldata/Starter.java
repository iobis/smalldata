package org.obis.smalldata;

import com.google.common.base.Preconditions;
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

import java.net.URI;
import java.net.URL;
import java.util.Map;
import java.util.Set;

import static com.google.common.base.Preconditions.checkArgument;
import static org.pmw.tinylog.Logger.debug;
import static org.pmw.tinylog.Logger.error;
import static org.pmw.tinylog.Logger.info;

public class Starter extends AbstractVerticle {

  private static final Set<String> SUPPORTED_PROTOCOLS = Set.of("http", "https");
  private static final JsonObject CONFIG_DEFAULT_STORAGE = new JsonObject()
    .put("bindIp", "localhost")
    .put("port", 27017)
    .put("path", "");

  @Override
  public void start(Future<Void> startFuture) {
    debug("starting the application with config: {}", config().encodePrettily());
    var baseUrl = (String) config().getValue("baseUrl", "http://localhost:3000/");
    var mode = config().getValue("mode", "DEV");

    if (!isValidUrl(baseUrl)) {
      var message = "BaseUrl is not valid, must be http or https protocol";
      error(message);
      startFuture.fail(message);
    }
    if (!Set.of("DEV", "DEMO").contains(mode) && isLocalhost(baseUrl)) {
      var message = "You can set the base url to localhost (127.0.0.x) only when running in 'DEV' or 'DEMO' mode";
      error(message);
      startFuture.fail(message);
    }

    vertx.sharedData()
      .getLocalMap("settings")
      .putAll(Map.of(
        "baseUrl", normalizeUrl(baseUrl),
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

  private static boolean isValidUrl(String urlString) {
    try {
      URL url = new URL(urlString);
      checkArgument(SUPPORTED_PROTOCOLS.contains(url.getProtocol()), "protocol of the base url should be 'http' or 'https'");
      url.toURI();
      return true;
    } catch (Exception e) {
      return false;
    }
  }

  private static boolean isLocalhost(String url) {
    return url.contains("//localhost") || url.contains("//127.0.0.");
  }

  private static String normalizeUrl(String url) {
    return url.endsWith("/") ? url : url + "/";
  }
}
