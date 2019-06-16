package org.obis.smalldata.user;

import io.vertx.core.Future;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import org.obis.smalldata.util.Collections;
import org.obis.smalldata.util.DbUtils;
import org.obis.smalldata.util.UniqueIdGenerator;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

class DbUserOperation {

  private static final String KEY_BULKINESS = "bulkiness";
  private static final String KEY_REF = "_ref";
  private static final String KEY_VALUE = "value";
  private static final String QUERY_REF = "ref";

  private final MongoClient mongoClient;
  private final BulkinessCalculator calculator;
  private final UniqueIdGenerator idGenerator;

  DbUserOperation(BulkinessCalculator bulkinessCalculator, MongoClient mongoClient) {
    this.mongoClient = mongoClient;
    this.calculator = bulkinessCalculator;
    idGenerator = new UniqueIdGenerator(mongoClient);
  }

  Future<List<JsonObject>> findUsers(JsonObject query) {
    var users = Future.<List<JsonObject>>future();
    mongoClient.find(
      Collections.USERS.dbName(),
      query,
      res -> users.complete(res.result().stream()
        .map(user -> {
          var bulkiness = calculator.decay(user.getJsonObject("bulkiness").getDouble("value"),
            user.getJsonObject("bulkiness").getInstant("instant"));
          return user.put("bulkiness", bulkiness);
        })
        .collect(Collectors.toList())));
    return users;
  }

  Future<JsonObject> insertUser(JsonObject userProfile) {
    var user = Future.<JsonObject>future();
    var now = Instant.now();
    var bulkiness = userProfile.getJsonObject("bulkiness");
    DbUtils.INSTANCE.insertDocument(mongoClient,
      idGenerator,
      Collections.USERS,
      new JsonObject()
        .put("emailAddress", userProfile.getString("emailAddress")),
      userProfile.put(KEY_BULKINESS,
        new JsonObject()
          .put("instant", now)
          .put(KEY_VALUE, calculator.decay(null == bulkiness ? 0.0 : bulkiness.getDouble(KEY_VALUE), now))),
      user);
    return user;
  }

  Future<JsonObject> updateUser(String userRef, JsonObject userProfile) {
    var user = Future.<JsonObject>future();
    var now = Instant.now();
    var bulkiness = userProfile.getJsonObject("bulkiness");
    mongoClient.replaceDocuments(
      Collections.USERS.dbName(),
      new JsonObject().put(KEY_REF, userRef),
      userProfile.put(KEY_REF, userRef)
        .put(KEY_BULKINESS,
          new JsonObject()
            .put("instant", now)
            .put(KEY_VALUE, calculator.decay(null == bulkiness ? 0.0 : bulkiness.getDouble(KEY_VALUE), now))),
      ar -> user.complete(userProfile.put(QUERY_REF, userProfile.remove(KEY_REF))));
    return user;
  }
}
