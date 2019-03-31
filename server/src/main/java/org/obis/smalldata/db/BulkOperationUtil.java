package org.obis.smalldata.db;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.BulkOperation;
import org.obis.smalldata.util.IoFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.pmw.tinylog.Logger.warn;

public class BulkOperationUtil {

  private static final ObjectMapper MAPPER = new ObjectMapper();

  private BulkOperationUtil() {}

  public static List<BulkOperation> createOperationsFromFile(String path) {
    return createOperationsFromJson(IoFile.loadFromResources(path));
  }

  public static List<BulkOperation> createOperationsFromJson(String json) {
    try {
      List<Map<String, Object>> l = MAPPER.readValue(json, new TypeReference<List<Map<String, Object>>>() {});
      return l.stream()
        .map(jsonmap -> BulkOperation.createInsert(new JsonObject(jsonmap)))
        .collect(Collectors.toList());
    } catch (IOException e) {
      warn("could not map to operations: {}", json);
      return List.of();
    }
  }

}
