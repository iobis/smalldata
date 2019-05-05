package org.obis.smalldata.dwca;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.CompositeFuture;
import io.vertx.core.Future;
import io.vertx.core.eventbus.Message;
import io.vertx.core.eventbus.ReplyFailure;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;

import java.util.List;

public class Dwca extends AbstractVerticle {

  private DbQuery dbQuery;

  @Override
  public void start(Future<Void> startFuture) {
    var dbConfig = (JsonObject) vertx.sharedData().getLocalMap("settings").get("storage");
    var mongoClient = MongoClient.createShared(vertx, dbConfig);
    dbQuery = new DbQuery(mongoClient);
    vertx.eventBus().localConsumer("dwca", this::handleDwcaEvents);
    startFuture.complete();
  }

  private void handleDwcaEvents(Message<JsonObject> message) {
    var action = message.body().getString("action");
    if ("generate".equals(action)) {
      generateZipFile(message.body().getString("dataset"))
        .setHandler(zip -> message.reply(zip.result()));
    } else {
      message.fail(ReplyFailure.RECIPIENT_FAILURE.toInt(), "Action " + action
        + " not found on address " + message.address());
    }
  }

  private Future<JsonObject> generateZipFile(String datasetRef) {
    var zipGenerator = new DwcaZipGenerator();
    var dwcaRecordsFuture = dbQuery.dwcaRecords(datasetRef);
    var datasetFuture = dbQuery.dataset(datasetRef);
    var result = Future.<JsonObject>future();
    CompositeFuture.all(datasetFuture, dwcaRecordsFuture).setHandler(res -> {
      var dataset = (JsonObject) res.result().list().get(0);
      var dwcaRecords = (List<JsonObject>) res.result().list().get(1);
      var path = zipGenerator.generate(dwcaRecords, dataset);
      result.complete(new JsonObject().put("file", path.get().toAbsolutePath().toString()));
    });
    return result;
  }
}
