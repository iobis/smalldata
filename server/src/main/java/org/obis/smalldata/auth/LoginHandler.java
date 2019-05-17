package org.obis.smalldata.auth;

import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.auth.AuthProvider;
import io.vertx.ext.auth.User;
import io.vertx.ext.auth.jwt.JWTAuth;
import io.vertx.ext.jwt.JWTOptions;

import java.util.function.BiConsumer;
import java.util.function.Consumer;

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
    login(
      message.body(),
      token -> message.reply(new JsonObject().put("token", token)),
      message::fail);
  }

  void login(JsonObject message, Consumer<String> successConsumer, BiConsumer<Integer, String> failConsumer) {
    var username = "paulo";
    var password = "secret";
    if (username.equals(message.getString("username")) && password.equals(message.getString("password"))) {
      var token = authProvider.generateToken(
        new JsonObject()
          .put("aud", "occurrences-OBIS")
          .put("sub", "paulo"),
        new JWTOptions().setAlgorithm("ES256"));
      successConsumer.accept(token);
    } else {
      failConsumer.accept(401, "Cannot login, invalid credentials");
    }
  }

  void verifyToken(Message<JsonObject> message) {
    verifyToken(
      message.body(),
      user -> message.reply(user.principal()),
      message::fail);
  }

  void verifyToken(JsonObject message, Consumer<User> successConsumer, BiConsumer<Integer, String> failConsumer) {
    authProvider.authenticate(
      message,
      ar -> {
        info("authenticating {}", ar);
        if (ar.succeeded()) {
          successConsumer.accept(ar.result());
        } else {
          failConsumer.accept(401, "Cannot login, invalid token");
        }
      });
  }
}
