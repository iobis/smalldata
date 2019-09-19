package org.obis.smalldata.user;

import io.vertx.core.Future;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.FindOptions;
import io.vertx.ext.mongo.MongoClient;
import io.vertx.ext.mongo.UpdateOptions;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
import org.obis.smalldata.util.Collections;
import org.obis.smalldata.util.DbUtils;
import org.obis.smalldata.util.UniqueIdGenerator;

class DbUserOperation {

  private static final String KEY_BULKINESS = "bulkiness";
  private static final String KEY_INSTANT = "instant";
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

  Future<JsonObject> findOneUser(JsonObject query) {
    var user = Future.<JsonObject>future();
    mongoClient.findOne(
        Collections.USERS.dbName(),
        query,
        new JsonObject(),
        res -> user.complete(addCalculatedBulkiness(res.result())));
    return user;
  }

  Future<List<JsonObject>> findUsers(JsonObject query) {
    var users = Future.<List<JsonObject>>future();
    mongoClient.find(
        Collections.USERS.dbName(),
        query,
        res ->
            users.complete(
                res.result()
                    .stream()
                    .map(this::addCalculatedBulkiness)
                    .collect(Collectors.toList())));
    return users;
  }

  private JsonObject addCalculatedBulkiness(JsonObject user) {
    var bulkiness =
        calculator.decay(
            user.getJsonObject(KEY_BULKINESS).getDouble(KEY_VALUE),
            user.getJsonObject(KEY_BULKINESS).getInstant(KEY_INSTANT));
    return user.put(KEY_BULKINESS, bulkiness);
  }

  Future<JsonObject> insertUser(JsonObject userProfile) {
    var user = Future.<JsonObject>future();
    var now = Instant.now();
    var bulkiness = userProfile.getJsonObject(KEY_BULKINESS);
    DbUtils.INSTANCE.insertDocument(
        mongoClient,
        idGenerator,
        Collections.USERS,
        new JsonObject().put("emailAddress", userProfile.getString("emailAddress")),
        userProfile.put(
            KEY_BULKINESS,
            new JsonObject()
                .put(KEY_INSTANT, now)
                .put(
                    KEY_VALUE,
                    calculator.decay(
                        null == bulkiness ? 0.0 : bulkiness.getDouble(KEY_VALUE), now))),
        user);
    return user;
  }

  Future<JsonObject> updateUser(String userRef, JsonObject userProfile) {
    var user = Future.<JsonObject>future();
    var now = Instant.now();
    var bulkiness = userProfile.getJsonObject(KEY_BULKINESS);
    mongoClient.replaceDocuments(
        Collections.USERS.dbName(),
        new JsonObject().put(KEY_REF, userRef),
        userProfile
            .put(KEY_REF, userRef)
            .put(
                KEY_BULKINESS,
                new JsonObject()
                    .put(KEY_INSTANT, now)
                    .put(
                        KEY_VALUE,
                        calculator.decay(
                            null == bulkiness ? 0.0 : bulkiness.getDouble(KEY_VALUE), now))),
        ar -> user.complete(userProfile.put(QUERY_REF, userProfile.remove(KEY_REF))));
    return user;
  }

  Future<JsonObject> increaseBulkiness(String userRef) {
    var bulkinessResult = Future.<JsonObject>future();
    mongoClient.findOne(
        Collections.USERS.dbName(),
        new JsonObject().put(KEY_REF, userRef),
        new JsonObject().put(KEY_BULKINESS, true),
        ar -> {
          var oldBulkiness = ar.result().getJsonObject(KEY_BULKINESS);
          var newBulkiness =
              calculator.decay(
                      oldBulkiness.getDouble(KEY_VALUE), oldBulkiness.getInstant(KEY_INSTANT))
                  + 1;

          mongoClient.findOneAndUpdateWithOptions(
              Collections.USERS.dbName(),
              new JsonObject().put(KEY_REF, userRef),
              new JsonObject()
                  .put(
                      "$set",
                      new JsonObject()
                          .put(
                              KEY_BULKINESS,
                              new JsonObject()
                                  .put(KEY_INSTANT, Instant.now())
                                  .put(KEY_VALUE, newBulkiness))),
              new FindOptions(),
              new UpdateOptions().setMulti(false).setUpsert(false).setReturningNewDocument(true),
              arUpdate -> bulkinessResult.complete(arUpdate.result()));
        });
    return bulkinessResult;
  }
}
