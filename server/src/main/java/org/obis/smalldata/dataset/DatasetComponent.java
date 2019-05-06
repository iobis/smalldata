package org.obis.smalldata.dataset;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;

import java.util.stream.Collectors;

public class DatasetComponent extends AbstractVerticle {

  private static final String QUERY_REF = "ref";
  private static final String KEY_REF = "_ref";

  private MongoClient mongoClient;

  @Override
  public void start(Future<Void> startFuture) {
    var dbConfig = (JsonObject) vertx.sharedData().getLocalMap("settings").get("storage");
    mongoClient = MongoClient.createShared(vertx, dbConfig);
    vertx.eventBus().localConsumer("datasets.query", this::handleDatasetEvents);
    startFuture.complete();
  }

  private void handleDatasetEvents(Message<JsonObject> message) {
    if (message.body().containsKey(QUERY_REF)) {
      mongoClient.findOne(
        "datasets",
        mapQueryKeys(message.body()),
        new JsonObject(),
        ar -> {
          var result = ar.result();
          if (result != null) {
            message.reply(new JsonArray().add(mapDatasetKeys(result)));
          } else {
            message.reply(new JsonArray());
          }
        });
    } else {
      mongoClient.find(
        "datasets",
        message.body(),
        ar -> {
          var datasets = ar.result().stream()
            .map(this::mapDatasetKeys)
            .collect(Collectors.toList());
          var datasetJson = new JsonArray(datasets);
          message.reply(datasetJson);
        });
    }
  }

  private JsonObject mapQueryKeys(JsonObject jsonObject) {
    var jsonMap = jsonObject.getMap();
    if (jsonMap.containsKey(QUERY_REF)) {
      jsonMap.put(KEY_REF, jsonMap.remove(QUERY_REF));
    }
    return new JsonObject(jsonMap);
  }

  private JsonObject mapDatasetKeys(JsonObject dataset) {
    var datasetMap = dataset.getMap();
    datasetMap.put(QUERY_REF, datasetMap.remove(KEY_REF));
    datasetMap.remove("_id");
    return new JsonObject(datasetMap);
  }
}
