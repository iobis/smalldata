package org.obis.smalldata.dwca;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;

import java.util.ArrayList;

public class Dwca extends AbstractVerticle {

  @Override
  public void start(Future<Void> startFuture) {
    var dbConfig = (JsonObject) vertx.sharedData().getLocalMap("settings").get("storage");
    var mongoClient = MongoClient.createShared(vertx, dbConfig);
    var dwcCsvGenerator = new DwcCsvGenerator(mongoClient);
    dwcCsvGenerator.extractHeaders(new ArrayList<>());

    startFuture.complete();
  }
}
