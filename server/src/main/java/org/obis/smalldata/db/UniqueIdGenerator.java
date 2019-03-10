package org.obis.smalldata.db;

import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import lombok.Value;

import java.util.function.Consumer;

@Value
public class UniqueIdGenerator {

  private MongoClient client;
  private SecureRandomId randomId = SecureRandomId.INSTANCE;

  UniqueIdGenerator(MongoClient client) {
    this.client = client;
  }

  public void consumeNewId (String collection, String idField, Consumer<String> idConsumer) {
    var newId = randomId.generate();
    client.find(collection, new JsonObject().put(idField, newId),
      arId -> {
        var result = arId.result();
        if (result.isEmpty()) {
          idConsumer.accept(newId);
        } else {
          this.consumeNewId(collection, idField, idConsumer);
        }
      });
  }
}
