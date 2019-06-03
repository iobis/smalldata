package org.obis.smalldata.util;

import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;

public enum DbUtils {

  INSTANCE;

  public final JsonObject collation = new JsonObject().put("locale", "simple");

  public void findOne(MongoClient mongoClient, Collections collection, JsonObject query, Message<String> message) {
    mongoClient.findOne(
      collection.dbName(),
      query,
      new JsonObject().put("_ref", true),
      ar -> {
        if (ar.succeeded()) {
          message.reply(null != ar.result() && !ar.result().isEmpty());
        } else {
          message.fail(500, "couldn't execute query");
        }
      });
  }
}
