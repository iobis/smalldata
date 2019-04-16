package org.obis.smalldata.dwca;

import com.google.common.base.Throwables;
import com.google.common.io.Resources;
import io.vertx.core.AsyncResult;
import io.vertx.core.Handler;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.pmw.tinylog.Logger;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.pmw.tinylog.Logger.info;

public class DwcaCsvGeneratorTest {

  private final TestDb testDb = new TestDb();
  private MongoClient mongoClient;

  @BeforeEach
  public void start() {
    mongoClient = testDb.init(Vertx.vertx());
  }

  void doWithDwcaDataset(String datasetRef, Handler<AsyncResult<List<JsonObject>>> handler) {
    mongoClient.find("dwcarecords",
      new JsonObject().put("dataset_ref", datasetRef),
      handler);
  }

  @Test
  public void testCsvData() {
    var future = new CompletableFuture<List<JsonObject>>();
    this.doWithDwcaDataset("NnqVLwIyPn-nRkc", res -> future.complete(res.result()));
    try {
      var dataset = future.get(200, TimeUnit.MILLISECONDS);
      var dwcaMap = DwcaData.datasetToDwcaMap(dataset);
      var dwcCsvWriter = new DwcCsvTable();
      dwcaMap.entrySet().stream()
        .forEach(dwcTable -> {
          String resourcePath = "demodata/dwc/benthic_data_sevastopol-v1.1/" + dwcTable.getKey() + ".txt";
          var resource = Resources.getResource(resourcePath);
          try {
            File generatedFile = File.createTempFile("obis-iode", dwcTable.getKey() + ".txt");
            dwcCsvWriter.writeTableToFile(dwcTable.getValue(), generatedFile);

            var actualCount = Files.lines(generatedFile.toPath()).count();
            var expectedCount = Files.lines(Paths.get(resource.getPath())).count();
            assertEquals(expectedCount, actualCount);

            Set<String> actualHeaders = DwcCsvTable.headersFromFile(generatedFile);
            Set<String> expectedHeaders = DwcCsvTable.headersFromFile(new File(resource.getPath()));
            assertTrue(expectedHeaders.containsAll(actualHeaders));

            if (generatedFile.delete()) {
              Logger.info("deleted {} successfully", generatedFile.getName());
            } else {
              Logger.warn("could not delete {}", generatedFile.getName());
            }
          } catch (IOException e) {
            Logger.error(Throwables.getStackTraceAsString(e));
          }
        });
    } catch (InterruptedException | ExecutionException | TimeoutException e) {
      Logger.error(Throwables.getStackTraceAsString(e));
    }
  }

  @AfterEach
  public void stop() {
    info("shutdown mongo db");
    testDb.shutDown();
  }
}
