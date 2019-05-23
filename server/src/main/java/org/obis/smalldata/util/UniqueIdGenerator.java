package org.obis.smalldata.util;

import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import lombok.Value;

import java.util.function.Consumer;

import static org.obis.smalldata.util.SecureRandomString.generateId;

@Value
public class UniqueIdGenerator {

  private MongoClient client;

  public UniqueIdGenerator(MongoClient client) {
    this.client = client;
  }

  public void consumeNewId(String collection, String idField, Consumer<String> idConsumer) {
    var newId = generateId();
    client.find(
      collection,
      new JsonObject().put(idField, newId),
      arId -> {
        var id = arId.result();
        if (id.isEmpty()) {
          idConsumer.accept(newId);
        } else {
          consumeNewId(collection, idField, idConsumer);
        }
      });
  }
}