package org.obis.smalldata.dwca;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.CompositeFuture;
import io.vertx.core.Future;
import io.vertx.core.eventbus.Message;
import io.vertx.core.eventbus.ReplyFailure;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;

import java.util.List;
import java.util.stream.Collectors;

import static org.pmw.tinylog.Logger.info;

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
    switch (action) {
      case "recordForUser":
        recordForUser(message.body().getString("userRef"),
          message.body().getString("dwcaId"))
          .setHandler(record -> message.reply(record.result()));
        break;
      case "recordsForUser":
        allRecordsForUser(message.body().getString("userRef"))
          .setHandler(records -> message.reply(records.result()));
        break;
      case "generate":
        generateZipFile(message.body().getString("findDataset"))
          .setHandler(zip -> message.reply(zip.result()));
        break;
      default:
        message.fail(ReplyFailure.RECIPIENT_FAILURE.toInt(), "Action " + action
          + " not found on address " + message.address());
        break;
    }
  }

  private Future<JsonObject> recordForUser(String userRef, String dwcaId) {
    info("getting dwca-record {} for user {}", dwcaId, userRef);
    var result = Future.<JsonObject>future();
    dbQuery.findDwcaRecordForUser(userRef, dwcaId).setHandler(
      record -> {
        record.result().remove("_id");
        result.complete(record.result());
      });
    return result;
  }

  private Future<JsonArray> allRecordsForUser(String userRef) {
    info("getting dwca-records for user {}", userRef);
    var result = Future.<JsonArray>future();
    dbQuery
      .findDwcaRecordsForUser(userRef)
      .setHandler(
        ar -> result.complete(
          new JsonArray(ar.result().stream()
            .peek(record -> record.remove("_id"))
            .collect(Collectors.toList())))
      );
    return result;
  }

  private Future<JsonObject> generateZipFile(String datasetRef) {
    var baseUrl = (String) vertx.sharedData().getLocalMap("settings").get("baseUrl");
    var zipGenerator = new DwcaZipGenerator(baseUrl);
    var dwcaRecordsFuture = dbQuery.findDwcaRecords(datasetRef);
    var datasetFuture = dbQuery.findDataset(datasetRef);
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
