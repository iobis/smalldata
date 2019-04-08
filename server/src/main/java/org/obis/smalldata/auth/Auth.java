package org.obis.smalldata.auth;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.ext.auth.AuthProvider;
import io.vertx.ext.auth.PubSecKeyOptions;
import io.vertx.ext.auth.jwt.JWTAuth;
import io.vertx.ext.auth.jwt.JWTAuthOptions;

import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

import static org.pmw.tinylog.Logger.info;

public class Auth extends AbstractVerticle {

  private LoginHandler loginHandler;

  private AuthProvider generateAuthProvider()
    throws InvalidKeyException {
    AuthProvider provider;
    if ("local".equals(config().getString("provider", "local"))) {
      if (config().getString("pubKey").isBlank() || config().getString("secKey").isBlank()) {
        throw new InvalidKeyException("Need to provide a public key for non-local JWT authorization");
        /**
         KeyPairGenerator g = KeyPairGenerator.getInstance("EC");
         ECGenParameterSpec spec = new ECGenParameterSpec("secp256r1");
         g.initialize(spec);
         KeyPair keyPair = g.generateKeyPair();
         config().put("pubKey", new String(Base64.getEncoder().encode(keyPair.getPublic().getEncoded())));
         config().put("secKey", new String(Base64.getEncoder().encode(keyPair.getPrivate().getEncoded())));
         **/
      }
      provider = JWTAuth.create(vertx, new JWTAuthOptions()
        .addPubSecKey(new PubSecKeyOptions()
          .setAlgorithm(config().getString("alg", "ES256"))
          .setPublicKey(config().getString("pubKey"))
          .setSecretKey(config().getString("secKey"))
        ));
    } else {
      if (config().getString("pubKey").isBlank()) {
        throw new InvalidKeyException("Need to provide a public key for non-local JWT authorization");
      } else {
        provider = JWTAuth.create(vertx, new JWTAuthOptions()
          .addPubSecKey(new PubSecKeyOptions()
            .setAlgorithm(config().getString("alg", "ES256"))
            .setPublicKey(config().getString("pubKey"))
          ));
      }
    }
    return provider;
  }
  @Override
  public void start(Future<Void> startFuture)
    throws InvalidKeyException,
    ExceptionInInitializerError {
    info("starting module 'Auth'");
    AuthProvider provider = generateAuthProvider();
    try {
      loginHandler = new LoginHandler(provider);
    } catch (Exception e) {
      throw new ExceptionInInitializerError("cannot deploy Auth module, invalid provider");
    }
    vertx.eventBus().localConsumer("auth.login", loginHandler::login);
    startFuture.complete();
  }
}
