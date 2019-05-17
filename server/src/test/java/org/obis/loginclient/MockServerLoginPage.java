package org.obis.loginclient;

import io.vertx.core.Vertx;
import io.vertx.core.VertxOptions;
import io.vertx.core.file.FileSystemOptions;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.StaticHandler;
import org.obis.smalldata.dbcontroller.SecureRandomString;

import java.util.Map;

import static org.pmw.tinylog.Logger.info;

public class MockServerLoginPage {

  private static final Map<String, String> saltMap = Map.of(
    "kurtsys", SecureRandomString.generateSalt(),
    "dummy", SecureRandomString.generateSalt());

  private MockServerLoginPage(Vertx vertx) {
    var server = vertx.createHttpServer();
    var router = Router.router(vertx);

    router.route("/login/salt/:userid").handler(context -> {
      var userid = context.request().getParam("userid");
      info(userid);
      context.response().end(saltMap.get(userid));
    });
    router.route("/login/token/:userid/:passhash").handler(context -> {
      var userId = context.request().getParam("userid");
      var passHash = context.request().getParam("passhash");
      info(userId);
      info(passHash);
      context.response().end("return a jwt if valid userid and passhash");
    });
    router.route("/*").handler(StaticHandler.create("loginroot").setCachingEnabled(false));
    server.requestHandler(router).listen(3000);
  }

  public static void main(String... args) {
    new MockServerLoginPage(Vertx.vertx(new VertxOptions().setFileSystemOptions(
      new FileSystemOptions().setFileCachingEnabled(false))));
  }
}
