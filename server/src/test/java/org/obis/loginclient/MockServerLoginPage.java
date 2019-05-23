package org.obis.loginclient;

import com.google.common.io.BaseEncoding;
import io.vertx.core.Vertx;
import io.vertx.core.VertxOptions;
import io.vertx.core.file.FileSystemOptions;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.StaticHandler;
import org.obis.smalldata.util.SecureRandomString;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Map;

import static org.pmw.tinylog.Logger.error;

public class MockServerLoginPage {

  private static MessageDigest messageDigest;

  static {
    try {
      messageDigest = MessageDigest.getInstance("SHA-256");
    } catch (NoSuchAlgorithmException e) {
      error(e.getMessage());
    }
  }

  private static final String KURTSYS = "kurtsys";
  private static final String DUMMY = "dummy";

  private static final Map<String, String> SALT_MAP = Map.of(
    KURTSYS, SecureRandomString.generateSalt(),
    DUMMY, SecureRandomString.generateSalt());

  private static final Map<String, String> HASH_PASSWORD_MAP = Map.of(
    KURTSYS, BaseEncoding.base16().lowerCase().encode(
      messageDigest.digest((SALT_MAP.get("KURTSYS") + "mypass").getBytes(StandardCharsets.UTF_8))),
    DUMMY, BaseEncoding.base16().lowerCase().encode(
      messageDigest.digest((SALT_MAP.get(DUMMY) + "secret").getBytes(StandardCharsets.UTF_8)))
  );

  private MockServerLoginPage(Vertx vertx) {
    var server = vertx.createHttpServer();
    var router = Router.router(vertx);

    router.route("/login/salt/:userid").handler(context -> {
      var userid = context.request().getParam("userid");
      context.response().end(SALT_MAP.get(userid));
    });
    router.route("/login/token/:userid/:passhash").handler(context -> {
      var userId = context.request().getParam("userid");
      var passHash = context.request().getParam("passhash");
      if (HASH_PASSWORD_MAP.containsKey(userId) && HASH_PASSWORD_MAP.get(userId).equals(passHash)) {
        context.response().end("return a jwt if valid userid and passhash");
      } else {
        context.response().setStatusCode(401).end("user doesn't exist or password is wrong!");
      }
    });
    router.route("/*").handler(StaticHandler.create("loginroot").setCachingEnabled(false));
    server.requestHandler(router).listen(3000);
  }

  public static void main(String... args) {
    new MockServerLoginPage(Vertx.vertx(new VertxOptions().setFileSystemOptions(
      new FileSystemOptions().setFileCachingEnabled(false))));
  }
}
