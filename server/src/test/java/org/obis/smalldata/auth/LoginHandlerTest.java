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
import org.assertj.core.data.Offset;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import java.time.Instant;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(VertxExtension.class)
public class LoginHandlerTest {

  private static final String AUTH_ALG = "ES256";
  private static final String AUTH_VERIFY_KEY = "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEraVJ8CpkrwTPRCPluUDdwC6b8+m4\n"
    + "dEjwl8s+Sn0GULko+H95fsTREQ1A2soCFHS4wV3/23Nebq9omY3KuK9DKw==";
  private static final String AUTH_SIGN_KEY = "MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgeRyEfU1NSHPTCuC9\n"
    + "rwLZMukaWCH2Fk6q5w+XBYrKtLihRANCAAStpUnwKmSvBM9EI+W5QN3ALpvz6bh0\n"
    + "SPCXyz5KfQZQuSj4f3l+xNERDUDaygIUdLjBXf/bc15ur2iZjcq4r0Mr";
  private static final JsonObject AUTH_CONFIG = new JsonObject()
    .put("alg", AUTH_ALG)
    .put("verifyKey", AUTH_VERIFY_KEY)
    .put("signKey", AUTH_SIGN_KEY);
  private static final JsonObject DEFAULT_CREDENTIALS = new JsonObject().put("username", "paulo").put("password", "secret");
  private static final String KEY_JWT = "jwt";

  @BeforeEach
  void deployVerticle(Vertx vertx, VertxTestContext testContext) {
    vertx.deployVerticle(
      Auth.class.getName(),
      new DeploymentOptions().setConfig(AUTH_CONFIG),
      testContext.succeeding(id -> testContext.completeNow()));
  }

  @Test
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  void codeAndDecodeTheTokenWithLoginHandler(Vertx vertx, VertxTestContext testContext) {
    var provider = JWTAuth.create(vertx, new JWTAuthOptions()
      .addPubSecKey(new PubSecKeyOptions()
        .setAlgorithm(AUTH_ALG)
        .setPublicKey(AUTH_VERIFY_KEY)
        .setSecretKey(AUTH_SIGN_KEY)));
    var loginHandler = new LoginHandler(provider);
    loginHandler.login(
      DEFAULT_CREDENTIALS,
      token -> loginHandler.verifyToken(
        new JsonObject().put(KEY_JWT, token),
        user -> {
          var claims = user.principal();
          var now = Instant.now().getEpochSecond();
          assertClaims(testContext, claims, now);
        },
        (errorCode, errorMessage) -> testContext.failNow(new Throwable("failed to verify"))),
      (errorCode, errorMessage) -> testContext.failNow(new Throwable("failed to login")));
  }

  @Test
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  void codeAndDecodeTheTokenOverTheEventBus(Vertx vertx, VertxTestContext testContext) {
    vertx.eventBus().<JsonObject>send(
      "auth.login",
      DEFAULT_CREDENTIALS,
      result -> {
        if (result.succeeded()) {
          JsonObject body = result.result().body();
          vertx.eventBus().<JsonObject>send(
            "auth.verify",
            new JsonObject().put(KEY_JWT, body.getString("token")),
            authResult -> {
              if (authResult.succeeded()) {
                var claims = authResult.result().body();
                var now = Instant.now().getEpochSecond();
                assertClaims(testContext, claims, now);
              } else {
                testContext.failNow(authResult.cause());
              }
            });
        } else {
          testContext.failNow(result.cause());
        }
      });
  }

  @Test
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  void checkJwtClaimsWithNewProvider(Vertx vertx, VertxTestContext testContext) {
    vertx.eventBus().<JsonObject>send(
      "auth.login",
      DEFAULT_CREDENTIALS,
      ar -> {
        if (ar.succeeded()) {
          JsonObject body = ar.result().body();
          var authProvider = JWTAuth.create(vertx, new JWTAuthOptions()
            .addPubSecKey(new PubSecKeyOptions()
              .setAlgorithm(AUTH_ALG)
              .setPublicKey(AUTH_VERIFY_KEY)
              .setSecretKey(AUTH_SIGN_KEY)));
          authProvider.authenticate(new JsonObject()
              .put(KEY_JWT, body.getString("token")),
            authResult -> {
              JsonObject claims = authResult.result().principal();
              long now = Instant.now().getEpochSecond();
              assertClaims(testContext, claims, now);
              testContext.completeNow();
            });
        } else {
          testContext.failNow(ar.cause());
        }
      });
  }

  @Test
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  void checkJwtWithNewToken(Vertx vertx, VertxTestContext testContext) {
    vertx.eventBus().<JsonObject>send(
      "auth.verify",
      new JsonObject()
        .put(KEY_JWT, "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9."
          + "eyJhdWQiOiJvY2N1cnJlbmNlcy1PQklTIiwic3ViIjoicGF1bG8iLCJpYXQiOjE1NTc5NDk4NDN9."
          + "O0RBl686U2YafsZqdRNTz-dFQR3znlnD3YHFgGcE7GhAa4ykR1gnHQkskLvu7YJ_iO2z7rvVdrrCGGVA6KBbXw"),
      ar -> {
        if (ar.succeeded()) {
          var claims = ar.result().body();
          assertClaims(testContext, claims, 1557949843L);
          testContext.completeNow();
        } else {
          testContext.failNow(ar.cause());
        }
      });
  }

  private void assertClaims(VertxTestContext testContext, JsonObject claims, long iat) {
    assertThat("paulo").isEqualTo(claims.getString("sub"));
    assertThat("occurrences-OBIS").isEqualTo(claims.getString("aud"));
    assertThat(iat).isCloseTo(claims.getLong("iat"), Offset.offset(1L));
    testContext.completeNow();
  }
}
