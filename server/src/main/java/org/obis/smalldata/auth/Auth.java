package org.obis.smalldata.auth;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.ext.auth.AuthProvider;
import io.vertx.ext.auth.PubSecKeyOptions;
import io.vertx.ext.auth.jwt.JWTAuth;
import io.vertx.ext.auth.jwt.JWTAuthOptions;

import java.security.InvalidKeyException;

import static org.pmw.tinylog.Logger.info;

public class Auth extends AbstractVerticle {

  public static final String AUTH_PUB_KEY = "publicKey";
  public static final String AUTH_SEC_KEY = "securityKey";
  public static final String AUTH_ALG = "alg";
  public static final String AUTH_ES256 = "ES256";

  private AuthProvider generateAuthProvider()
    throws InvalidKeyException {
    AuthProvider provider;
    if ("local".equals(config().getString("provider", "local"))) {
      if (config().getString(AUTH_PUB_KEY).isBlank() || config().getString(AUTH_SEC_KEY).isBlank()) {
        throw new InvalidKeyException("Need to provide a public key for non-local JWT authorization");
      } else {
        provider = JWTAuth.create(vertx, new JWTAuthOptions()
          .addPubSecKey(new PubSecKeyOptions()
            .setAlgorithm(config().getString(AUTH_ALG, AUTH_ES256))
            .setPublicKey(config().getString(AUTH_PUB_KEY))
            .setSecretKey(config().getString(AUTH_SEC_KEY))
          ));
      }
    } else {
      if (config().getString(AUTH_PUB_KEY).isBlank()) {
        throw new InvalidKeyException("Need to provide a public key for non-local JWT authorization");
      } else {
        provider = JWTAuth.create(vertx, new JWTAuthOptions()
          .addPubSecKey(new PubSecKeyOptions()
            .setAlgorithm(config().getString(AUTH_ALG, AUTH_ES256))
            .setPublicKey(config().getString(AUTH_PUB_KEY))
          ));
      }
    }
    return provider;
  }

  @Override
  public void start(Future<Void> startFuture) throws ExceptionInInitializerError {
    info("starting module 'Auth'");
    try {
      var loginHandler = new LoginHandler(generateAuthProvider());
      vertx.eventBus().localConsumer("auth.login", loginHandler::login);
      startFuture.complete();
    } catch (Exception e) {
      startFuture.fail(new ExceptionInInitializerError("cannot deploy Auth module, invalid provider"));
    }
  }
}
