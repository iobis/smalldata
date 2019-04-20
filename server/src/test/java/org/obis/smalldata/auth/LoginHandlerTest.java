package org.obis.smalldata.auth;

import io.vertx.core.DeploymentOptions;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.auth.PubSecKeyOptions;
import io.vertx.ext.auth.jwt.JWTAuth;
import io.vertx.ext.auth.jwt.JWTAuthOptions;
import io.vertx.junit5.Timeout;
import io.vertx.junit5.VertxExtension;
import io.vertx.junit5.VertxTestContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import java.time.Instant;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(VertxExtension.class)
public class LoginHandlerTest {

  private static final String AUTH_ALG = "ES256";
  private static final String AUTH_PUBLIC_KEY = "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEraVJ8CpkrwTPRCPluUDdwC6b8+m4\n"
    + "dEjwl8s+Sn0GULko+H95fsTREQ1A2soCFHS4wV3/23Nebq9omY3KuK9DKw==\n";
  private static final String AUTH_SECURITY_KEY = "MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgeRyEfU1NSHPTCuC9\n"
    + "rwLZMukaWCH2Fk6q5w+XBYrKtLihRANCAAStpUnwKmSvBM9EI+W5QN3ALpvz6bh0\n"
    + "SPCXyz5KfQZQuSj4f3l+xNERDUDaygIUdLjBXf/bc15ur2iZjcq4r0Mr";
  private static final JsonObject AUTH_CONFIG = new JsonObject()
    .put("alg", AUTH_ALG)
    .put("publicKey", AUTH_PUBLIC_KEY)
    .put("securityKey", AUTH_SECURITY_KEY);
  private JWTAuth authProvider;

  @BeforeEach
  void deployVerticle(Vertx vertx, VertxTestContext testContext) {
    authProvider = JWTAuth.create(
      vertx,
      new JWTAuthOptions()
        .addPubSecKey(new PubSecKeyOptions()
          .setAlgorithm(AUTH_ALG)
          .setPublicKey(AUTH_PUBLIC_KEY)
          .setSecretKey(AUTH_SECURITY_KEY)));
    vertx.deployVerticle(
      Auth.class.getName(),
      new DeploymentOptions().setConfig(AUTH_CONFIG),
      testContext.succeeding(id -> testContext.completeNow()));
  }

  @Test
  @DisplayName("check if a proper jwt is returned")
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  void testJwtTokenClaims(Vertx vertx, VertxTestContext testContext) {
    vertx.eventBus().<JsonObject>send(
      "auth.login",
      new JsonObject()
        .put("username", "paulo")
        .put("password", "secret"),
      result -> {
        if (result.succeeded()) {
          JsonObject body = result.result().body();
          authProvider.authenticate(new JsonObject()
              .put("jwt", body.getString("token")),
            authResult -> {
              JsonObject claims = authResult.result().principal();
              long now = Instant.now().getEpochSecond();
              assertEquals(claims.getString("sub"), "paulo");
              assertEquals(claims.getString("aud"), "occurrences-OBIS");
              assertEquals(claims.getLong("iat") / 1.0, now / 1.0, 1.0);
              testContext.completeNow();
            });
        } else {
          testContext.failNow(result.cause());
        }
      });
  }
}
