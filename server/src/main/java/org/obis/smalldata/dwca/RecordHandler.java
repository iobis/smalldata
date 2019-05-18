package org.obis.smalldata.dwca;

import io.vertx.core.eventbus.Message;
import io.vertx.core.eventbus.ReplyFailure;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import lombok.Value;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.pmw.tinylog.Logger.info;

class RecordHandler {

  private final DbOperation dbOperation;

  RecordHandler(DbOperation dbOperation) {
    this.dbOperation = dbOperation;
  }

  void handleDwcaRecordEvents(Message<JsonObject> message) {
    List<JsonObject> dwcRecords = dwcaRecordToDwcList(message.body());
    var action = message.body().getString("action");
    switch (action) {
      case "insert":
        dbOperation.withNewId("dwcarecords", id -> {
          var records = dwcRecords.stream()
            .map(dwcRecord -> {
              var record = dwcRecord.getJsonObject("dwcRecord");
              record.put("id", id);
              dwcRecord.put("dwcRecord", record);
              return dwcRecord;
            })
            .collect(Collectors.toList());
          var result = dbOperation.insertRecords(records);
          result.setHandler(ar -> message.reply(new JsonObject()
            .put("id", id)
            .put("result", ar.result())));
        });
        break;
      case "update":
        info("update record {}", message.body().getString("record"));
        break;
      default:
        message.fail(ReplyFailure.RECIPIENT_FAILURE.toInt(), "Action " + action
          + " not found on address " + message.address());
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
  static class DwcTableListMapper {

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
          .put("dwcRecord", dwcRecord));
    }
  }
}
