package org.obis.smalldata;

import com.google.common.base.Throwables;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.DeploymentOptions;
import io.vertx.core.Future;
import io.vertx.core.json.JsonObject;
import org.obis.smalldata.auth.Auth;
import org.obis.smalldata.dbcontroller.EmbeddedDb;
import org.obis.smalldata.dwca.Dwca;
import org.obis.smalldata.rss.RssComponent;
import org.obis.smalldata.webapi.WebApi;

import java.nio.charset.StandardCharsets;
import java.security.InvalidAlgorithmParameterException;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.spec.ECGenParameterSpec;
import java.util.Arrays;
import java.util.Base64;
import java.util.stream.Collectors;

import static org.pmw.tinylog.Logger.debug;
import static org.pmw.tinylog.Logger.error;
import static org.pmw.tinylog.Logger.info;

public class Starter extends AbstractVerticle {

  private static final String PUBLIC_KEY = "publicKey";
  private static final String SECURITY_KEY = "securityKey";

  @Override
  public void start(Future<Void> startFuture) {
    debug("starting the application with config: {}", config().encodePrettily());
    vertx.sharedData().getLocalMap("settings")
      .put("mode", config().getValue("mode", "DEV"));
    vertx.sharedData().getLocalMap("settings")
      .put("storage", config().getJsonObject("storage",
        new JsonObject()
          .put("bindIp", "localhost")
          .put("port", 27017)
          .put("path", "")));
    vertx.deployVerticle(EmbeddedDb.class.getName(),
      new DeploymentOptions().setConfig(config().getJsonObject("storage")),
      deployHandler -> {
        info("Deployed Embedded DB verticle {}", deployHandler.result());
        vertx.deployVerticle(Dwca.class.getName());
        vertx.deployVerticle(RssComponent.class.getName());
        vertx.deployVerticle(
          WebApi.class.getName(),
          new DeploymentOptions().setConfig(config().getJsonObject("http")));
        try {
          vertx.deployVerticle(
            Auth.class.getName(),
            new DeploymentOptions().setConfig(updateAuthConfig(config().getJsonObject("auth"))));
        } catch (NoSuchAlgorithmException | InvalidAlgorithmParameterException e) {
          error(Throwables.getStackTraceAsString(e));
          vertx.undeploy(this.deploymentID());
        }
      });
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

  private static boolean isNullOrBlank(String val) {
    return val == null || val.isBlank();
  }

}
