package org.obis.smalldata.auth;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.auth.AuthProvider;
import io.vertx.ext.auth.PubSecKeyOptions;
import io.vertx.ext.auth.jwt.JWTAuth;
import io.vertx.ext.auth.jwt.JWTAuthOptions;

import java.nio.charset.StandardCharsets;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.spec.ECGenParameterSpec;
import java.util.Base64;

import static org.pmw.tinylog.Logger.error;
import static org.pmw.tinylog.Logger.info;
import static org.pmw.tinylog.Logger.warn;

public class Auth extends AbstractVerticle {

  private static final String VERIFY_KEY = "verifyKey";
  private static final String SIGN_KEY = "signKey";
  private static final String ALG_KEY = "alg";
  private static final String AUTH_ES256 = "ES256";

  @Override
  public void start(Future<Void> startFuture) {
    info("starting module 'Auth'");
    try {
      var authProvider = generateAuthProvider();
      LoginHandler loginHandler = new LoginHandler(authProvider);
      vertx.eventBus().<JsonObject>localConsumer("auth.login", loginHandler::login);
      vertx.eventBus().<JsonObject>localConsumer("auth.verify", loginHandler::verifyToken);
      startFuture.complete();
    } catch (InvalidKeyException | InvalidAlgorithmParameterException | NoSuchAlgorithmException e) {
      error(e, "Cannot start Auth component: possibly wrong algorithm or keys for JWT signing/verification?");
      startFuture.fail(e);
    }
  }

  private AuthProvider generateAuthProvider() throws InvalidKeyException,
    InvalidAlgorithmParameterException, NoSuchAlgorithmException {
    AuthProvider provider;
    if ("local".equals(config().getString("provider", "local"))) {
      info("... using local keys");
      if (isNullOrBlank(config().getString(VERIFY_KEY)) || isNullOrBlank(config().getString(SIGN_KEY))) {
        warn("... generating a new keypair for local JWT generation");
        KeyPairGenerator generator = KeyPairGenerator.getInstance("EC");
        ECGenParameterSpec spec = new ECGenParameterSpec("secp256r1");
        generator.initialize(spec);
        KeyPair keyPair = generator.generateKeyPair();
        config().put(VERIFY_KEY, createPublicKey(keyPair));
        config().put(SIGN_KEY, createSecretKey(keyPair));
      }
      info("... {}", config().getString(VERIFY_KEY).substring(30).replaceAll("\n", " "));
      info("... {}", config().getString(SIGN_KEY).substring(50).replaceAll("\n", " "));
      var pubSecKey = new PubSecKeyOptions()
        .setAlgorithm(config().getString(ALG_KEY, AUTH_ES256))
        .setPublicKey(config().getString(VERIFY_KEY))
        .setSecretKey(config().getString(SIGN_KEY));
      provider = JWTAuth.create(vertx, new JWTAuthOptions().addPubSecKey(pubSecKey));
    } else {
      info("... using external verification key");
      if (isNullOrBlank(config().getString(VERIFY_KEY))) {
        throw new InvalidKeyException("Need to provide a public key for non-local JWT authorization");
      } else {
        var pubSecKey = new PubSecKeyOptions()
          .setAlgorithm(config().getString(ALG_KEY, AUTH_ES256))
          .setPublicKey(config().getString(VERIFY_KEY));
        provider = JWTAuth.create(vertx, new JWTAuthOptions().addPubSecKey(pubSecKey));
      }
    }
    return provider;
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
