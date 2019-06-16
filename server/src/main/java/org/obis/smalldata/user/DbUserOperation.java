package org.obis.smalldata.user;

import io.vertx.core.Future;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import org.obis.smalldata.util.Collections;
import org.obis.smalldata.util.DbUtils;
import org.obis.smalldata.util.UniqueIdGenerator;

import java.util.List;

class DbUserOperation {

  private static final String KEY_BULKINESS = "bulkiness";
  private static final String KEY_REF = "_ref";
  private static final String QUERY_REF = "ref";

  private final MongoClient mongoClient;
  private final UniqueIdGenerator idGenerator;

  DbUserOperation(MongoClient mongoClient) {
    this.mongoClient = mongoClient;
    idGenerator = new UniqueIdGenerator(mongoClient);
  }

  Future<List<JsonObject>> findUsers(JsonObject query) {
    var users = Future.<List<JsonObject>>future();
    mongoClient.find(
      Collections.USERS.dbName(),
      query,
      res -> users.complete(res.result()));
    return users;
  }

  Future<JsonObject> insertUser(JsonObject userProfile) {
    var user = Future.<JsonObject>future();
    DbUtils.INSTANCE.insertDocument(mongoClient,
      idGenerator,
      Collections.USERS,
      new JsonObject()
        .put("emailAddress", userProfile.getString("emailAddress")),
      userProfile.put(KEY_BULKINESS, userProfile.getDouble(KEY_BULKINESS, 0.0)),
      user);
    return user;
  }

  Future<JsonObject> updateUser(String userRef, JsonObject userProfile) {
    var user = Future.<JsonObject>future();
    mongoClient.replaceDocuments(
      Collections.USERS.dbName(),
      new JsonObject().put(KEY_REF, userRef),
      userProfile.put(KEY_REF, userRef)
        .put(KEY_BULKINESS, userProfile.getDouble(KEY_BULKINESS, 0.0)),
      ar -> user.complete(userProfile.put(QUERY_REF, userProfile.remove(KEY_REF))));
    return user;
  }
}
