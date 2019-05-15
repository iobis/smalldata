package org.obis.smalldata.auth;

import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.auth.AuthProvider;
import io.vertx.ext.auth.jwt.JWTAuth;
import io.vertx.ext.jwt.JWTOptions;

import static org.pmw.tinylog.Logger.info;

class LoginHandler {

  private final JWTAuth authProvider;

  LoginHandler(AuthProvider authProvider) {
    info("authProvider {}", authProvider);
    if (authProvider instanceof JWTAuth) {
      this.authProvider = (JWTAuth) authProvider;
      info("Started 'Auth LoginHandler'");
    } else {
      throw new ExceptionInInitializerError("Invalid Auth Provider");
    }
  }

  void login(Message<JsonObject> message) {
    var body = message.body();
    var username = "paulo";
    var password = "secret";
    if (username.equals(body.getString("username")) && password.equals(body.getString("password"))) {
      var token = authProvider.generateToken(
        new JsonObject()
          .put("aud", "occurrences-OBIS")
          .put("sub", "paulo"),
        new JWTOptions().setAlgorithm("ES256"));
      message.reply(new JsonObject().put("token", token));
    } else {
      message.fail(401, "Cannot login, invalid credentials");
    }
  }

  void verifyToken(Message<JsonObject> message) {
    info("verifying token: {}", message.body());
    authProvider.authenticate(message.body(), ar -> {
      if (ar.succeeded()) {
        message.reply(ar.result());
      } else {
        message.fail(401, "Cannot login, invalid token");
      }
    });
  }
}
