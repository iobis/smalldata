package org.obis.smalldata.dwca;

import io.vertx.core.eventbus.Message;
import io.vertx.core.eventbus.ReplyFailure;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import lombok.Value;
import org.bson.types.ObjectId;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.pmw.tinylog.Logger.info;

class RecordHandler {

  private static final String COLLECTION_DWCARECORD = "dwcarecords";
  private static final String DWC_RECORD = "dwcRecord";
  private final DbOperation dbOperation;

  RecordHandler(DbOperation dbOperation) {
    this.dbOperation = dbOperation;
  }

  void handleDwcaRecordEvents(Message<JsonObject> message) {
    var body = message.body();
    info(body);
    List<JsonObject> dwcRecords = dwcaRecordToDwcList(body);
    var action = body.getString("action");
    switch (action) {
      case "insert":
        dbOperation.withNewId(COLLECTION_DWCARECORD, id -> {
          var records = dwcRecords.stream()
            .map(dwcRecord -> {
              var record = dwcRecord.getJsonObject(DWC_RECORD);
              record.put("id", id);
              dwcRecord.put(DWC_RECORD, record);
              dwcRecord.put("_id", ObjectId.get().toHexString());
              return dwcRecord;
            })
            .collect(Collectors.toList());
          var result = dbOperation.insertRecords(records);
          info("insertion result {}", result);
          result.setHandler(ar -> message.reply(new JsonObject()
            .put("dwcaId", id)
            .put("records", records.stream()
              .collect(Collectors.groupingBy(dwca -> dwca.getString("dwcTable")))
              .entrySet()
              .stream()
              .collect(Collectors.toMap(
                Map.Entry::getKey,
                dwcList -> dwcList.getValue().stream()
                  .map(dwca -> dwca.getJsonObject(DWC_RECORD))
                  .collect(Collectors.toList()))))));
        });
        break;
      case "update":
        info("update record {}", body.getString("record"));
        break;
      default:
        message.fail(
          ReplyFailure.RECIPIENT_FAILURE.toInt(),
          "Action " + action + " not found on address " + message.address());
    }
  }

  private List<JsonObject> dwcaRecordToDwcList(JsonObject dwcaRecord) {
    var userRef = dwcaRecord.getString("userRef");
    var datasetRef = dwcaRecord.getString("datasetRef");
    var dwcTableListMapper = new DwcTableListMapper(userRef, datasetRef);
    return dwcaRecord.getJsonObject("record").stream()
      .filter(table -> !table.getKey().equals("core"))
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
      return dwcRecords.stream()
        .map(JsonObject.class::cast)
        .map(dwcRecord -> new JsonObject()
          .put("dwcTable", tableName)
          .put("user_ref", userRef)
          .put("dataset_ref", datasetRef)
          .put(DWC_RECORD, dwcRecord));
    }
  }
}