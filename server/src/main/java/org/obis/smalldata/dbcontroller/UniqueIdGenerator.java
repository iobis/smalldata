package org.obis.smalldata.dbcontroller;

import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import lombok.Value;

import java.util.function.Consumer;

import static org.obis.smalldata.dbcontroller.SecureRandomId.generateId;

@Value
public class UniqueIdGenerator {

  private MongoClient client;

  UniqueIdGenerator(MongoClient client) {
    this.client = client;
  }

  public void consumeNewId(String collection, String idField, Consumer<String> idConsumer) {
    var newId = generateId();
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
