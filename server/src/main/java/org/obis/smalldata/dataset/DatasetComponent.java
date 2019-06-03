package org.obis.smalldata.dataset;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import org.obis.smalldata.util.Collections;
import org.obis.smalldata.util.DbUtils;

import java.util.stream.Collectors;

public class DatasetComponent extends AbstractVerticle {

  private static final String KEY_REF = "_ref";
  private static final String QUERY_REF = "ref";

  private MongoClient mongoClient;

  @Override
  public void start(Future<Void> startFuture) {
    var dbConfig = (JsonObject) vertx.sharedData().getLocalMap("settings").get("storage");
    mongoClient = MongoClient.createShared(vertx, dbConfig);
    vertx.eventBus().localConsumer("datasets.query", this::handleDatasetEvents);
    vertx.eventBus().localConsumer("datasets.exists", this::handleExists);
    startFuture.complete();
  }

  private void handleExists(Message<String> message) {
    var datasetRef = message.body();
    DbUtils.INSTANCE.findOne(mongoClient, Collections.DATASETS, new JsonObject().put("_ref", datasetRef), message);

  }

  private void handleDatasetEvents(Message<JsonObject> message) {
    if (message.body().containsKey(QUERY_REF)) {
      mongoClient.findOne(
        "datasets",
        mapQueryKeys(message.body()),
        new JsonObject(),
        ar -> {
          var result = ar.result();
          if (result == null) {
            message.reply(new JsonArray());
          } else {
            message.reply(new JsonArray().add(mapDatasetKeys(result)));
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
