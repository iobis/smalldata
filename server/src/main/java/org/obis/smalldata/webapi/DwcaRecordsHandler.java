package org.obis.smalldata.webapi;

import io.vertx.core.CompositeFuture;
import io.vertx.core.Future;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.http.HttpHeaders;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.RoutingContext;
import lombok.Value;

import java.util.ArrayList;
import java.util.List;

import static org.pmw.tinylog.Logger.info;

public class DwcaRecordsHandler {

  public static void put(RoutingContext context) {
    info("context: {}", context.request());
    info("host: {}", context.request().host());
    context
      .response()
      .putHeader(HttpHeaders.CONTENT_TYPE, "application/json")
      .end(new JsonObject().put("occurenceID", "some ID").encode());
  }

  public static void post(RoutingContext context) {
    var datasetRef = context.request().getParam("datasetRef");
    var userRef = context.request().getParam("userRef");
    var messages = new DwcaBodyValidator(context.vertx().eventBus(), datasetRef, userRef).validate(context.getBodyAsJson());
    messages.setHandler(arMessages -> {
      info(arMessages);
      if (arMessages.result().isEmpty()) {
        context.vertx().eventBus().<JsonObject>send(
          "dwca.record",
          new JsonObject()
            .put("action", "insert")
            .put("datasetRef", datasetRef)
            .put("userRef", userRef)
            .put("record", context.getBodyAsJson()),
          ar -> context
            .response()
            .putHeader(HttpHeaders.CONTENT_TYPE, "application/json")
            .end(ar.result().body().encode()));
      } else {
        var jsonMessages = new JsonArray();
        arMessages.result().forEach(jsonMessages::add);
        context.response()
          .setStatusCode(422)
          .setStatusMessage("Invalid request body")
          .end(new JsonObject().put("messages", jsonMessages).encode());
      }
    });
  }

  @Value
  static class DwcaBodyValidator {

    private final EventBus eventBus;
    private final String datasetRef;
    private final String userRef;

    Future<Boolean> userExists() {
      var exists = Future.<Boolean>future();
      eventBus.<Boolean>send("users.exists", userRef, ar -> exists.complete(ar.result().body()));
      return exists;
    }

    Future<Boolean> datasetExists() {
      var exists = Future.<Boolean>future();
      eventBus.<Boolean>send("datasets.exists", datasetRef, ar -> {
        info(ar);
        exists.complete(ar.result().body());
      });
      return exists;
    }

    Future<List<String>> validate(JsonObject dwcaRecord) {
      var result = Future.<List<String>>future();
      var coreTable = dwcaRecord.getString("core");

      CompositeFuture.all(datasetExists(), userExists()).setHandler(ar -> {
        var messages = new ArrayList<String>();
        var datasetExists = (Boolean) ar.result().list().get(0);
        var userExists = (Boolean) ar.result().list().get(1);
        var maxRecordsInCore = 1;
        if (dwcaRecord.getJsonArray(coreTable).size() != maxRecordsInCore) {
          messages.add("core table '" + coreTable + "' can have only 1 record.");
        }
        if (!datasetExists) {
          messages.add("dataset with ref '" + datasetRef + "' does not exist.");
        }
        if (!userExists) {
          messages.add("user with ref '" + userRef + "' does not exist.");
        }
        result.complete(messages);
      });
      return result;
    }
  }

  private DwcaRecordsHandler() {
  }
}
