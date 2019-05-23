package org.obis.smalldata.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.BulkOperation;
import org.obis.util.file.IoFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.pmw.tinylog.Logger.warn;

public class BulkOperationUtil {

  private static final ObjectMapper MAPPER = new ObjectMapper();

  private BulkOperationUtil() {
  }

  public static List<BulkOperation> createInsertsFromFile(String path) {
    warn("reading file for import {}", path);
    return createInsertsFromJson(IoFile.loadFromResources(path));
  }

  public static List<BulkOperation> createInsertsFromJson(String json) {
    try {
      List<Map<String, Object>> list = MAPPER.readValue(json, new TypeReference<List<Map<String, Object>>>() {
      });
      return list.stream()
        .map(jsonMap -> BulkOperation.createInsert(new JsonObject(jsonMap)))
        .collect(Collectors.toList());
    } catch (IOException e) {
      warn("could not map to inserts: {}", json);
      return List.of();
    }
  }
}