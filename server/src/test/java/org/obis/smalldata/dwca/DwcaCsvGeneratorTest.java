package org.obis.smalldata.dwca;

import com.google.common.base.Charsets;
import com.google.common.base.Throwables;
import com.google.common.collect.ImmutableList;
import com.google.common.io.Resources;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.obis.smalldata.testutil.TestDb;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.pmw.tinylog.Logger.error;
import static org.pmw.tinylog.Logger.info;
import static org.pmw.tinylog.Logger.warn;

public class DwcaCsvGeneratorTest {

  private TestDb testDb;
  private MongoClient mongoClient;

  @BeforeEach
  public void start() {
    testDb = new TestDb();
    mongoClient = testDb.init(Vertx.vertx());
  }

  @AfterEach
  public void stop() {
    info("shutdown mongo db");
    mongoClient.close();
    testDb.shutDown();
  }

  @Test
  public void writeTableToFile() {
    var dataset = findDatasetByDatasetRef("NnqVLwIyPn-nRkc");
    var dwcaMap = DwcaData.datasetToDwcaMap(dataset);
    var dwcCsvWriter = new DwcCsvTable();
    dwcaMap.forEach((key, value) -> {
      try {
        var cvsResourceName = "demodata/dwc/benthic_data_sevastopol-v1.1/" + key + ".txt";
        var cvsResource = Resources.getResource(cvsResourceName);
        var cvsContent = Resources.toString(cvsResource, Charsets.UTF_8);

        File generatedFile = File.createTempFile(key, ".txt");
        dwcCsvWriter.writeTableToFile(value, generatedFile);

        var nrOfLinesInOriginalCvs = cvsContent.lines().count();
        var nrOfLinesInGeneratedCvs = Files.lines(generatedFile.toPath()).count();
        assertEquals(nrOfLinesInOriginalCvs, nrOfLinesInGeneratedCvs);

        Set<String> originalHeaders = DwcCsvTable.headersFromFile(new File(cvsResource.getPath()));
        Set<String> generatedHeaders = DwcCsvTable.headersFromFile(generatedFile);
        assertTrue(originalHeaders.containsAll(generatedHeaders));

        if (generatedFile.delete()) {
          info("deleted {} successfully", generatedFile.getName());
        } else {
          warn("could not delete {}", generatedFile.getName());
        }
      } catch (IOException e) {
        error(Throwables.getStackTraceAsString(e));
      }
    });
  }

  private List<JsonObject> findDatasetByDatasetRef(String datasetRef) {
    try {
      var future = new CompletableFuture<List<JsonObject>>();
      mongoClient.find(
        "dwcarecords",
        new JsonObject().put("dataset_ref", datasetRef),
        ar -> future.complete(ar.result()));
      return future.get(200, TimeUnit.MILLISECONDS);
    } catch (InterruptedException | ExecutionException | TimeoutException e) {
      error(Throwables.getStackTraceAsString(e));
      return ImmutableList.of();
    }
  }
}
