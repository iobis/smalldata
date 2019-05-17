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
public class VerifyRSTokenTest {

  // copy from resources/auth/keys
  private static final String AUTH_ALG = "RS256";
  private static final String AUTH_PUBLIC_KEY = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsOuPRD4mbf8msGGmMC/w\n"
    + "FT9DMwdcq0Tf/tSnzo76ST5A3UKmwQJCfmgALrz30RvU7TYNxEficLvITl/36ipt\n"
    + "YIBDgsxVWYh91mRlyDThq7TzEUQ79e2/hrmczOHs994rvks7ciCNCqvVIbn0m2nC\n"
    + "dIlEa2kBRGuxp5K/jBwz6DTH2fC9hUZML+pqXbgdBv61kZBm9TEuA+4OQda3ciMD\n"
    + "o/9YE+lBnPnhsrieTPcZyQQLZrOoAEf99uQMO9Wr6ELSXr804o084k8f1UHz/U0k\n"
    + "eWCpKfix3FzJwvp2seelcUo5ayweYK4Oq6yAco01sjVzZjwoFwu246GBiGVdxV5z\n"
    + "pQIDAQAB\n";
  private static final String VALID_JWT = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9"
    + ".eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.ZzcTqoekur4Em_"
    + "hyV995z2le0szrmq9agup-Yy1__BmvpTBDc44B3lQ7oB2bCk3G0gyGFV1WQmRtYKzHrjm0SEHwSNVFB2B76JUR4D7IIQcPgK6bOhsdg9yg5"
    + "oPS40ceFkR_SosmEtt_4njpAATSl_9jxT1NJV0lLIm3F9rGiPx_Tze_JCROtK7SCuBqQ6JKktn_Pn1GFsv4z9Q0TQFeorfvhPo7NDGRhKno"
    + "fDTBVizf0h_JwC6XwCmlHISXJg7G6v3LPhR5iDjlDw0mBW6b0Fzb58metEMg4pmiYyxPigdQkJqzIJ2FoO6wUcmPT2cj3oFRkBpnWk3LQIt"
    + "16CGEDA";

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
        assertThat(claims.getString("name")).isEqualTo("John Doe");
        assertThat(claims.getLong("iat")).isEqualTo(1516239022);
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
      new JsonObject().put("jwt", VALID_JWT.replace("EDA", "eDA")),
      ar -> {
        assertThat(ar.failed()).isTrue();
        assertThat(ar.succeeded()).isFalse();
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
          .setPublicKey(AUTH_PUBLIC_KEY.replaceFirst("QAB", "QaB"))));
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
