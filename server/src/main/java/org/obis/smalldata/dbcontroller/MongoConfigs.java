package org.obis.smalldata.dbcontroller;

import io.vertx.core.json.JsonObject;
import java.io.File;

public class MongoConfigs {
  private MongoConfigs() {}

  public static JsonObject ofServer(String bindIp, int port, File dbPath) {
    return ofServer(bindIp, port).put("path", dbPath.getAbsolutePath());
  }

  public static JsonObject ofServer(String bindIp, int port) {
    return new JsonObject().put("bindIp", bindIp).put("port", port);
  }

  public static JsonObject ofClient(String host, int port) {
    return new JsonObject().put("host", host).put("port", port);
  }
}
