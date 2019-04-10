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

  private static final String ALG_KEY = "alg";
  private static final String AUTH_ES256 = "ES256";
  public static final String PUBLIC_KEY = "publicKey";
  public static final String SECURITY_KEY = "securityKey";

  private AuthProvider generateAuthProvider() throws InvalidKeyException {
    AuthProvider provider;
    if ("local".equals(config().getString("provider", "local"))) {
      if (config().getString(PUBLIC_KEY).isBlank() || config().getString(SECURITY_KEY).isBlank()) {
        throw new InvalidKeyException("Need to provide a public key for non-local JWT authorization");
      } else {
        provider = JWTAuth.create(vertx, new JWTAuthOptions()
          .addPubSecKey(new PubSecKeyOptions()
            .setAlgorithm(config().getString(ALG_KEY, AUTH_ES256))
            .setPublicKey(config().getString(PUBLIC_KEY))
            .setSecretKey(config().getString(SECURITY_KEY))
          ));
      }
    } else {
      if (config().getString(PUBLIC_KEY).isBlank()) {
        throw new InvalidKeyException("Need to provide a public key for non-local JWT authorization");
      } else {
        provider = JWTAuth.create(vertx, new JWTAuthOptions()
          .addPubSecKey(new PubSecKeyOptions()
            .setAlgorithm(config().getString(ALG_KEY, AUTH_ES256))
            .setPublicKey(config().getString(PUBLIC_KEY))
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
