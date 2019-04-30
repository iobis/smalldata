package org.obis.smalldata;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.DeploymentOptions;
import io.vertx.core.Future;
import io.vertx.core.json.JsonObject;
import org.obis.smalldata.auth.Auth;
import org.obis.smalldata.dbcontroller.EmbeddedDb;
import org.obis.smalldata.dwca.Dwca;
import org.obis.smalldata.rss.RssComponent;
import org.obis.smalldata.webapi.WebApi;

import java.net.URI;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.InvalidAlgorithmParameterException;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.spec.ECGenParameterSpec;
import java.util.Arrays;
import java.util.Base64;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static org.pmw.tinylog.Logger.debug;
import static org.pmw.tinylog.Logger.error;
import static org.pmw.tinylog.Logger.info;

public class Starter extends AbstractVerticle {

  private static final String PUBLIC_KEY = "publicKey";
  private static final String SECURITY_KEY = "securityKey";
  private static final JsonObject CONFIG_DEFAULT_STORAGE = new JsonObject()
    .put("bindIp", "localhost").put("port", 27017)
    .put("path", "");

  static boolean isValidUrl(String urlString) {
    try {
      URL url = new URL(urlString);
      if (!(url.getProtocol().equals("http") || url.getProtocol().equals("https"))) {
        throw new IllegalArgumentException("protocol of the base url should be 'http' or 'https'");
      }
      URI uri = url.toURI();
      info("running base url {}", uri);
      return true;
    } catch (RuntimeException e) {
      error("runtime exception");

      throw e;
    } catch (Exception e) {
      return false;
    }
  }

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
    if (!Set.of("DEV", "DEMO").contains(mode)
      && (baseUrl.contains("//localhost") || baseUrl.contains("//127.0.0."))) {
      var message = "You can set the base url to localhost (127.0.0.x) only when running in 'DEV' or 'DEMO' mode";
      error(message);
      startFuture.fail(message);
    }
    baseUrl = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";

    vertx.sharedData().getLocalMap("settings")
      .putAll(Map.of(
        "baseUrl", baseUrl,
        "mode", mode,
        "storage", config().getJsonObject("storage", CONFIG_DEFAULT_STORAGE)));

    vertx.deployVerticle(EmbeddedDb.class.getName(),
      new DeploymentOptions().setConfig(config().getJsonObject("storage")),
      deployHandler -> {
        info("Deployed Embedded DB verticle {}", deployHandler.result());
        vertx.deployVerticle(Dwca.class.getName());
        vertx.deployVerticle(RssComponent.class.getName());
        vertx.deployVerticle(WebApi.class.getName(),
          new DeploymentOptions().setConfig(config().getJsonObject("http")));
        try {
          vertx.deployVerticle(Auth.class.getName(),
            new DeploymentOptions().setConfig(updateAuthConfig(config().getJsonObject("auth"))));
        } catch (NoSuchAlgorithmException | InvalidAlgorithmParameterException e) {
          error(Arrays.stream(e.getStackTrace())
            .map(Object::toString)
            .collect(Collectors.joining("\n\t")));
          vertx.undeploy(this.deploymentID());
        }
      });
  }

  private static boolean isNullOrBlank(String val) {
    return val == null || val.isBlank();
  }

  private static JsonObject updateAuthConfig(JsonObject authConfig)
    throws NoSuchAlgorithmException, InvalidAlgorithmParameterException {
    if ("local".equals(authConfig.getString("provider", "local"))
      && isNullOrBlank(authConfig.getString(PUBLIC_KEY)) || isNullOrBlank(authConfig.getString(SECURITY_KEY))) {
      KeyPairGenerator generator = KeyPairGenerator.getInstance("EC");
      ECGenParameterSpec spec = new ECGenParameterSpec("secp256r1");
      generator.initialize(spec);
      KeyPair keyPair = generator.generateKeyPair();
      authConfig.put(PUBLIC_KEY, createPublicKey(keyPair));
      authConfig.put(SECURITY_KEY, createSecretKey(keyPair));
    }
    return authConfig;
  }

  private static String createPublicKey(KeyPair keyPair) {
    return new String(Base64.getEncoder().encode(keyPair.getPublic().getEncoded()), StandardCharsets.UTF_8);
  }

  private static String createSecretKey(KeyPair keyPair) {
    return new String(Base64.getEncoder().encode(keyPair.getPrivate().getEncoded()), StandardCharsets.UTF_8);
  }
}
