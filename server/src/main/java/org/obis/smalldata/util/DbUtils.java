package org.obis.smalldata.util;

import io.vertx.core.Future;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;

public enum DbUtils {
  INSTANCE;

  private static final String KEY_REF = "_ref";
  public final JsonObject collation = new JsonObject().put("locale", "simple");

  public void findOne(
      MongoClient mongoClient, Collections collection, JsonObject query, Message<String> message) {
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

  public void insertDocument(
      MongoClient mongoClient,
      UniqueIdGenerator idGenerator,
      Collections collection,
      JsonObject query,
      JsonObject document,
      Future<JsonObject> resultDocument) {
    if (query.isEmpty()) {
      insertDocument(mongoClient, idGenerator, collection, document, resultDocument);
    } else {
      mongoClient.find(
          collection.dbName(),
          query,
          arFound -> {
            if (arFound.succeeded() && arFound.result().isEmpty()) {
              insertDocument(mongoClient, idGenerator, collection, document, resultDocument);
            } else {
              resultDocument.complete(arFound.result().get(0));
            }
          });
    }
  }

  public void insertDocument(
      MongoClient mongoClient,
      UniqueIdGenerator idGenerator,
      Collections collection,
      JsonObject document,
      Future<JsonObject> resultDocument) {
    idGenerator.consumeNewId(
        collection.dbName(),
        KEY_REF,
        ref ->
            mongoClient.insert(
                collection.dbName(),
                document.put(KEY_REF, ref),
                ar -> {
                  document.remove("_id");
                  resultDocument.complete(document);
                }));
  }
}
