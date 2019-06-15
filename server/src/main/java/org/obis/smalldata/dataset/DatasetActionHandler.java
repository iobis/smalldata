package org.obis.smalldata.dataset;

import com.google.common.collect.ImmutableMap;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import org.obis.smalldata.util.VertxActionHandler;

import java.util.function.BiConsumer;
import java.util.stream.Collectors;

class DatasetActionHandler {

  private static final String KEY_REF = "_ref";
  private static final String QUERY_REF = "ref";

  private final DbDatasetOperation dbOperation;
  private final VertxActionHandler actionHandler;

  DatasetActionHandler(MongoClient mongoClient) {
    this.dbOperation = new DbDatasetOperation(mongoClient);
    var actionMap = ImmutableMap.<String, BiConsumer<Message<JsonObject>, JsonObject>>of(
      "find", this::findDatasets);
    this.actionHandler = new VertxActionHandler(actionMap);
  }

  void handleAction(Message<JsonObject> message) {
    actionHandler.handleAction(message);
  }

  void findDatasets(Message<JsonObject> message, JsonObject body) {
    var query = body.getJsonObject("query", new JsonObject());
    if (query.containsKey(QUERY_REF)) {
      dbOperation.findOneDataset(mapQueryKeys(query)).setHandler(ar -> {
        var result = ar.result();
        if (result == null) {
          message.reply(new JsonArray());
        } else {
          message.reply(new JsonArray().add(mapDatasetKeys(result)));
        }
      });
    } else {
      dbOperation.findDatasets(query)
        .setHandler(ar -> {
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
