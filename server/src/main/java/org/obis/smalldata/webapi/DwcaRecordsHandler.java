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
import java.util.function.BiConsumer;
import java.util.function.BiFunction;

import static org.pmw.tinylog.Logger.info;

public class DwcaRecordsHandler {

  private static final String MIME_APPLICATION_JSON = "application/json";
  private static final String DOES_NOT_EXIST = "' does not exist.";
  private static final String ADDRESS_DWCA_RECORD = "dwca.record";
  private static final String KEY_ACTION = "action";
  private static final String KEY_USER_REF = "userRef";
  private static final String KEY_DATASET_REF = "datasetRef";
  private static final String KEY_DWCA_ID = "dwcaId";

  public static void put(RoutingContext context) {
    actionOnDwcaRecord(context,
      (datasetRef, userRef) ->
        new DwcaBodyValidator(context.vertx().eventBus(), datasetRef, userRef).validate(context.getBodyAsJson()),
      (datasetRef, userRef) ->
        context.vertx().eventBus().<JsonObject>send(
          ADDRESS_DWCA_RECORD,
          new JsonObject()
            .put(KEY_ACTION, "replace")
            .put(KEY_DATASET_REF, datasetRef)
            .put(KEY_USER_REF, userRef)
            .put(KEY_DWCA_ID, context.request().getParam(KEY_DWCA_ID))
            .put("record", context.getBodyAsJson()),
          ar -> context
            .response()
            .putHeader(HttpHeaders.CONTENT_TYPE, MIME_APPLICATION_JSON)
            .end(ar.result().body().encode())));
  }

  public static void post(RoutingContext context) {
    actionOnDwcaRecord(context,
      (datasetRef, userRef) ->
        new DwcaBodyValidator(context.vertx().eventBus(), datasetRef, userRef).validate(context.getBodyAsJson()),
      (datasetRef, userRef) ->
      context.vertx().eventBus().<JsonObject>send(
        ADDRESS_DWCA_RECORD,
        new JsonObject()
          .put(KEY_ACTION, "insert")
          .put(KEY_DATASET_REF, datasetRef)
          .put(KEY_USER_REF, userRef)
          .put("record", context.getBodyAsJson()),
        ar -> context
          .response()
          .putHeader(HttpHeaders.CONTENT_TYPE, MIME_APPLICATION_JSON)
          .end(ar.result().body().encode())));
  }

  public static void get(RoutingContext context) {
    actionOnDwcaRecord(context,
      (datasetRef, userRef) ->
        new DwcaBodyValidator(context.vertx().eventBus(), datasetRef, userRef).validate(),
      (datasetRef, userRef) ->
        context.vertx().eventBus().<JsonArray>send(
          ADDRESS_DWCA_RECORD,
          new JsonObject()
            .put(KEY_ACTION, "find")
            .put("query", new JsonObject().put("dwcRecord.id", context.request().getParam(KEY_DWCA_ID))),
          ar -> {
            var result = ar.result().body();
            info(result.encodePrettily());
            info(result.size());
            switch (result.size()) {
              case 0:
                context
                  .response()
                  .putHeader(HttpHeaders.CONTENT_TYPE, MIME_APPLICATION_JSON)
                  .setStatusCode(404)
                  .end(new JsonObject().put("error", "record "
                    + context.request().getParam(KEY_DWCA_ID)
                    + DOES_NOT_EXIST).encode());
                break;
              case 1:
                context
                  .response()
                  .putHeader(HttpHeaders.CONTENT_TYPE, MIME_APPLICATION_JSON)
                  .end(ar.result().body().getJsonObject(0).encode());
                break;
              default:
                context
                  .response()
                  .putHeader(HttpHeaders.CONTENT_TYPE, MIME_APPLICATION_JSON)
                  .setStatusCode(400)
                  .end(new JsonObject().put("error", "illegal db state: more than 1 record with this id").encode());
                break;
            }
          }));
  }

  private static void actionOnDwcaRecord(RoutingContext context,
                                         BiFunction<String, String, Future<List<String>>> messages,
                                         BiConsumer<String, String> succesHandler) {
    var datasetRef = context.request().getParam(KEY_DATASET_REF);
    var userRef = context.request().getParam(KEY_USER_REF);
    messages.apply(datasetRef, userRef).setHandler(arMessages -> {
      if (arMessages.result().isEmpty()) {
        succesHandler.accept(datasetRef, userRef);
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

  public static void getForUser(RoutingContext context) {
    var userRef = context.request().getParam(KEY_USER_REF);
    var eventBus = context.vertx().eventBus();
    eventBus.<Boolean>send(
      "users.exists",
      userRef,
      arUserExists -> {
        if (arUserExists.succeeded() && arUserExists.result().body()) {
          eventBus.<JsonArray>send(
            ADDRESS_DWCA_RECORD,
            new JsonObject()
              .put(KEY_ACTION, "find")
              .put("query", new JsonObject().put("user_ref", userRef)),
            ar -> context.response().end(ar.result().body().encode()));
        } else {
          context.response().setStatusCode(400).end("User doesn't exist");
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
        exists.complete(ar.result().body());
      });
      return exists;
    }

    Future<List<String>> validate() {
      var result = Future.<List<String>>future();

      CompositeFuture.all(datasetExists(), userExists()).setHandler(ar -> {
        var messages = new ArrayList<String>();
        var datasetExists = (Boolean) ar.result().list().get(0);
        var userExists = (Boolean) ar.result().list().get(1);
        if (!datasetExists) {
          messages.add("dataset with ref '" + datasetRef + DOES_NOT_EXIST);
        }
        if (!userExists) {
          messages.add("user with ref '" + userRef + DOES_NOT_EXIST);
        }
        result.complete(messages);
      });
      return result;
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
          messages.add("dataset with ref '" + datasetRef + DOES_NOT_EXIST);
        }
        if (!userExists) {
          messages.add("user with ref '" + userRef + DOES_NOT_EXIST);
        }
        result.complete(messages);
      });
      return result;
    }
  }

  private DwcaRecordsHandler() {
  }
}
