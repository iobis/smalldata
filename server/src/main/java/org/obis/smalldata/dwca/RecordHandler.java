package org.obis.smalldata.dwca;

import static org.pmw.tinylog.Logger.info;

import com.google.common.collect.ImmutableList;
import io.vertx.core.CompositeFuture;
import io.vertx.core.Future;
import io.vertx.core.eventbus.Message;
import io.vertx.core.eventbus.ReplyFailure;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.BiFunction;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import lombok.Value;
import org.bson.types.ObjectId;
import org.obis.smalldata.util.Collections;

class RecordHandler {

  private static final String DWC_RECORD = "dwcRecord";
  private static final String KEY_CORE = "core";
  private static final String KEY_ADDED_AT = "addedAtInstant";
  private final DbDwcaOperation dbOperation;

  RecordHandler(DbDwcaOperation dbOperation) {
    this.dbOperation = dbOperation;
  }

  void handleDwcaRecordEvents(Message<JsonObject> message) {
    var body = message.body();
    var action = body.getString("action");
    switch (action) {
      case "insert":
        insertRecords(message, body);
        break;
      case "find":
        findRecords(message, body);
        break;
      case "replace":
        putRecords(message, body);
        break;
      default:
        message.fail(
            ReplyFailure.RECIPIENT_FAILURE.toInt(),
            "Action " + action + " not found on address " + message.address());
        break;
    }
  }

  private void putRecords(Message<JsonObject> message, JsonObject body) {
    var coreTable = getCoreTable(body);
    var dwcRecords = dwcaRecordToDwcList(body);
    info(dwcRecords);
    var dwcaId = body.getString("dwcaId");
    updateRecords(message, coreTable, dwcRecords, dwcaId, dbOperation::putDwcaRecord);
  }

  private void insertRecords(Message<JsonObject> message, JsonObject body) {
    var coreTable = getCoreTable(body);
    var dwcRecords = dwcaRecordToDwcList(body);
    dbOperation.withNewId(
        Collections.DATASETRECORDS.dbName(),
        id -> updateRecords(message, coreTable, dwcRecords, id, dbOperation::insertRecords));
  }

  private List<JsonObject> generateDwcDbRecords(
      List<JsonObject> dwcRecords, String dwcaId, Instant addedAtInstant) {
    return dwcRecords
        .stream()
        .map(
            dwcRecord -> {
              var record = dwcRecord.getJsonObject(DWC_RECORD);
              record.put("id", dwcaId);
              dwcRecord.put(DWC_RECORD, record);
              dwcRecord.put(KEY_ADDED_AT, addedAtInstant);
              dwcRecord.put("_id", ObjectId.get().toHexString());
              return dwcRecord;
            })
        .collect(Collectors.toList());
  }

  private void updateRecords(
      Message<JsonObject> message,
      String coreTable,
      List<JsonObject> dwcRecords,
      String dwcaId,
      BiFunction<String, List<JsonObject>, Future<JsonObject>> dbOperation) {
    var addedAtInstant = Instant.now();
    List<JsonObject> records = generateDwcDbRecords(dwcRecords, dwcaId, addedAtInstant);
    var result = dbOperation.apply(dwcaId, records);
    result.setHandler(
        ar ->
            message.reply(
                new JsonObject()
                    .put("dwcaId", dwcaId)
                    .put(KEY_ADDED_AT, addedAtInstant)
                    .put("records", generateDwcaJsonResponse(records).put(KEY_CORE, coreTable))));
  }

  private void findRecords(Message<JsonObject> message, JsonObject body) {
    var dwcaRecordsFuture =
        dbOperation.findDwcaRecords(
            body.getJsonObject("query"), body.getJsonObject("projectionFields", new JsonObject()));
    var coreTableMapFuture = dbOperation.coreTableMap();
    CompositeFuture.all(dwcaRecordsFuture, coreTableMapFuture)
        .setHandler(
            ar -> {
              var dwcaRecords = (List<JsonObject>) ar.result().list().get(0);
              var coreTableMap = (Map<String, String>) ar.result().list().get(1);

              var records =
                  new JsonArray(
                      dwcaRecords
                          .stream()
                          .collect(
                              Collectors.groupingBy(
                                  record ->
                                      ImmutableList.of(
                                          record.getJsonObject("dwcRecord").getString("id"),
                                          record.getString("dataset_ref"))))
                          .entrySet()
                          .stream()
                          .map(
                              entry -> {
                                var datasetRef = entry.getKey().get(1);
                                var addedAtInstant =
                                    entry
                                        .getValue()
                                        .stream()
                                        .map(record -> record.getString(KEY_ADDED_AT))
                                        .filter(Objects::nonNull)
                                        .map(Instant::parse)
                                        .max(Instant::compareTo)
                                        .orElse(null);
                                return new JsonObject()
                                    .put("dwcaId", entry.getKey().get(0))
                                    .put("dataset", datasetRef)
                                    .put(KEY_ADDED_AT, addedAtInstant)
                                    .put(
                                        "dwcRecords",
                                        generateDwcaJsonResponse(entry.getValue())
                                            .put(KEY_CORE, coreTableMap.get(datasetRef)));
                              })
                          .sorted(
                              (record1, record2) ->
                                  instantFromRecord(record2).compareTo(instantFromRecord(record1)))
                          .collect(Collectors.toList()));
              message.reply(records);
            });
  }

  private Instant instantFromRecord(JsonObject record) {
    var addedAtInstant = record.getString(KEY_ADDED_AT);
    return null == addedAtInstant ? Instant.MIN : Instant.parse(addedAtInstant);
  }

  private String getCoreTable(JsonObject body) {
    return body.getJsonObject("record").getString(KEY_CORE);
  }

  private JsonObject generateDwcaJsonResponse(List<JsonObject> records) {
    return new JsonObject(
        records
            .stream()
            .collect(Collectors.groupingBy(dwca -> dwca.getString("dwcTable")))
            .entrySet()
            .stream()
            .collect(
                Collectors.toMap(
                    Map.Entry::getKey,
                    dwcList ->
                        dwcList
                            .getValue()
                            .stream()
                            .map(dwca -> dwca.getJsonObject(DWC_RECORD))
                            .collect(Collectors.toList()))));
  }

  private List<JsonObject> dwcaRecordToDwcList(JsonObject dwcaRecord) {
    var userRef = dwcaRecord.getString("userRef");
    var datasetRef = dwcaRecord.getString("datasetRef");
    var dwcTableListMapper = new DwcTableListMapper(userRef, datasetRef);
    return dwcaRecord
        .getJsonObject("record")
        .stream()
        .filter(table -> !table.getKey().equals(KEY_CORE))
        .flatMap(dwcTableListMapper::mapTable)
        .collect(Collectors.toList());
  }

  @Value
  private static class DwcTableListMapper {
    private final String userRef;
    private final String datasetRef;

    private Stream<JsonObject> mapTable(Map.Entry<String, Object> table) {
      var tableName = table.getKey();
      var dwcRecords = (JsonArray) table.getValue();
      return dwcRecords
          .stream()
          .map(JsonObject.class::cast)
          .map(
              dwcRecord ->
                  new JsonObject()
                      .put("dwcTable", tableName)
                      .put("user_ref", userRef)
                      .put("dataset_ref", datasetRef)
                      .put(DWC_RECORD, dwcRecord));
    }
  }
}
