package org.obis.smalldata.auth;

import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.auth.PubSecKeyOptions;
import io.vertx.ext.auth.jwt.JWTAuth;
import io.vertx.ext.auth.jwt.JWTAuthOptions;
import io.vertx.junit5.Timeout;
import io.vertx.junit5.VertxExtension;
import io.vertx.junit5.VertxTestContext;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(VertxExtension.class)
public class VerifyECTokenTest {

  // copy from resources/auth/keys
  private static final String AUTH_ALG = "ES256";
  private static final String AUTH_PUBLIC_KEY = "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEraVJ8CpkrwTPRCPluUDdwC6b8+m4\n"
    + "dEjwl8s+Sn0GULko+H95fsTREQ1A2soCFHS4wV3/23Nebq9omY3KuK9DKw==";
  private static final String VALID_JWT = "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9."
    + "eyJpc3MiOiJodHRwczovL2p3dC1pZHAuZXhhbXBsZS5jb20iLCJzdWIiOiJtYWlsdG86bWlrZUBleGFtcGxlLmNvbSIsImlhdCI6MTU"
    + "1Nzk0OTIwNSwidHlwIjoiaHR0cHM6Ly9leGFtcGxlLmNvbS9yZWdpc3RlciJ9.A9lLxipwEllzXkw6nFp0BSTHWz7JBAh1yQVya5V50"
    + "Vab9zwiOASdbFhGUJpIYBWt6Gak_XyodudXP_uFas2ryQ";

  private JWTAuth authProvider;

  @Test
  @DisplayName("check public key base 64 encoding verifies a token")
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  void testJwtVerifier(Vertx vertx, VertxTestContext testContext) throws InterruptedException {
    authProvider = JWTAuth.create(
      vertx,
      new JWTAuthOptions()
        .addPubSecKey(new PubSecKeyOptions()
          .setAlgorithm(AUTH_ALG)
          .setPublicKey(AUTH_PUBLIC_KEY)));
    authProvider.authenticate(
      new JsonObject().put("jwt", VALID_JWT),
      ar -> {
        assertThat(ar.succeeded()).isTrue();
        var claims = ar.result().principal();
        assertThat(claims).isNotNull();
        assertThat(claims.getString("iss")).isEqualTo("https://jwt-idp.example.com");
        assertThat(claims.getLong("iat")).isEqualTo(1557949205);
        testContext.completeNow();
      });
    testContext.awaitCompletion(2, TimeUnit.SECONDS);
  }

  @Test
  @DisplayName("check exception on wrong jwt")
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  void testWrongJwt(Vertx vertx, VertxTestContext testContext) throws InterruptedException {
    authProvider = JWTAuth.create(
      vertx,
      new JWTAuthOptions()
        .addPubSecKey(new PubSecKeyOptions()
          .setAlgorithm(AUTH_ALG)
          .setPublicKey(AUTH_PUBLIC_KEY)));
    authProvider.authenticate(
      new JsonObject().put("jwt", VALID_JWT.replace("ryQ", "ryq")),
      ar -> {
        assertThat(ar.failed()).isTrue();
        assertThat(ar.cause()).hasMessage("Signature verification failed");
        testContext.completeNow();
      });
    testContext.awaitCompletion(2, TimeUnit.SECONDS);
  }

  @Test
  @DisplayName("check exception on wrong public key")
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  void testWrongKey(Vertx vertx, VertxTestContext testContext) throws InterruptedException {
    authProvider = JWTAuth.create(
      vertx,
      new JWTAuthOptions()
        .addPubSecKey(new PubSecKeyOptions()
          .setAlgorithm(AUTH_ALG)
          .setPublicKey(AUTH_PUBLIC_KEY.replaceFirst("DKw", "DKW"))));
    authProvider.authenticate(
      new JsonObject().put("jwt", VALID_JWT),
      ar -> {
        assertThat(ar.failed()).isTrue();
        assertThat(ar.cause()).hasMessage("Signature verification failed");
        testContext.completeNow();
      });
    testContext.awaitCompletion(2, TimeUnit.SECONDS);
  }
}
