package org.obis.smalldata.dwca;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.CompositeFuture;
import io.vertx.core.Future;
import io.vertx.core.eventbus.Message;
import io.vertx.core.eventbus.ReplyFailure;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;

import java.util.List;

public class DwcaComponent extends AbstractVerticle {

  private DbOperation dbQuery;

  @Override
  public void start(Future<Void> startFuture) {
    var dbConfig = (JsonObject) vertx.sharedData().getLocalMap("settings").get("storage");
    var mongoClient = MongoClient.createShared(vertx, dbConfig);
    dbQuery = new DbOperation(mongoClient);
    var recordHandler = new RecordHandler(dbQuery);
    vertx.eventBus().localConsumer("dwca", this::handleDwcaEvents);
    vertx.eventBus().localConsumer("dwca.record", recordHandler::handleDwcaRecordEvents);
    startFuture.complete();
  }

  private void handleDwcaEvents(Message<JsonObject> message) {
    var body = message.body();
    var action = body.getString("action");
    if ("generate".equals(action)) {
      generateZipFile(body.getString("findDataset"))
        .setHandler(zip -> message.reply(zip.result()));
    } else {
      message.fail(
        ReplyFailure.RECIPIENT_FAILURE.toInt(),
        "Action " + action + " not found on address " + message.address());
    }
  }

  private Future<JsonObject> generateZipFile(String datasetRef) {
    var baseUrl = (String) vertx.sharedData().getLocalMap("settings").get("baseUrl");
    var zipGenerator = new DwcaZipGenerator(baseUrl);
    var dwcaRecordsFuture = dbQuery.findDwcaRecords(new JsonObject().put("dataset_ref", datasetRef));
    var datasetFuture = dbQuery.findDataset(datasetRef);
    var result = Future.<JsonObject>future();
    CompositeFuture.all(datasetFuture, dwcaRecordsFuture).setHandler(ar -> {
      var dataset = (JsonObject) ar.result().list().get(0);
      var dwcaRecords = (List<JsonObject>) ar.result().list().get(1);
      var path = zipGenerator.generate(dwcaRecords, dataset);
      result.complete(new JsonObject().put("file", path.get().toAbsolutePath().toString()));
    });
    return result;
  }
}
