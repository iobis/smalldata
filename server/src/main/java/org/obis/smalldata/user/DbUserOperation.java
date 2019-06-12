package org.obis.smalldata.user;

import io.vertx.core.Future;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import org.obis.smalldata.util.Collections;

import java.util.List;

class DbUserOperation {

  private final MongoClient mongoClient;

  DbUserOperation(MongoClient mongoClient) {
    this.mongoClient = mongoClient;
  }

  Future<List<JsonObject>> findUsers(JsonObject query) {
    var users = Future.<List<JsonObject>>future();
    mongoClient.find(
      Collections.USERS.dbName(),
      query,
      res -> users.complete(res.result()));
    return users;
  }
}
