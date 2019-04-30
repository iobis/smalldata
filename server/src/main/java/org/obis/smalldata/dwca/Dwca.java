package org.obis.smalldata.dwca;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;

public class Dwca extends AbstractVerticle {

  @Override
  public void start(Future<Void> startFuture) {
    var dbConfig = (JsonObject) vertx.sharedData().getLocalMap("settings").get("storage");
    var mongoClient = MongoClient.createShared(vertx, dbConfig);
    // TODO: eventbus listeners and dispatch to handlers
    mongoClient.find("dwcarecords",
            new JsonObject().put("dataset_ref", "NnqVLwIyPn-nRkc"),
            res -> DwcCsvTable.extractHeaders(res.result()));
    startFuture.complete();
  }
}
