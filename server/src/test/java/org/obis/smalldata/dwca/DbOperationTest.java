package org.obis.smalldata.dwca;

import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import io.vertx.junit5.VertxExtension;
import io.vertx.junit5.VertxTestContext;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.obis.smalldata.testutil.TestDb;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(VertxExtension.class)
class DbOperationTest {
  private static TestDb testDb;
  private static MongoClient mongoClient;
  private static DbOperation dbOperation;

  @BeforeAll
  public static void setUp() {
    testDb = new TestDb();
    mongoClient = testDb.init(Vertx.vertx());
    dbOperation = new DbOperation(mongoClient);
  }

  @AfterAll
  public static void tearDown() {
    mongoClient.close();
    testDb.shutDown();
  }

  @Test
  void findDwcaRecordsForKnownDatasetRef(VertxTestContext testContext) {
    var dwcaRecords = dbOperation.findDwcaRecords(new JsonObject().put("dataset_ref", "NnqVLwIyPn-nRkc"));
    dwcaRecords.setHandler(ar -> {
      var result = ar.result();
      assertThat(result).hasSize(642);
      testContext.completeNow();
    });
  }

  @Test
  void findDwcaRecordsForUnknownDatasetRef(VertxTestContext testContext) {
    var dwcaRecords = dbOperation.findDwcaRecords(new JsonObject().put("dataset_ref", "unknown"));
    dwcaRecords.setHandler(ar -> {
      var result = ar.result();
      assertThat(result).isEmpty();
      testContext.completeNow();
    });
  }

  @Test
  void findDwcaRecordsForUserRef(VertxTestContext testContext) {
    var dwcaRecords = dbOperation.findDwcaRecords(new JsonObject().put("user_ref", "ovZTtaOJZ98xDDY"));
    dwcaRecords.setHandler(ar -> {
      var result = ar.result();
      assertThat(result).hasSize(2955);
      testContext.completeNow();
    });
  }

  @Test
  void findDwcaRecordsForUnknownUserRef(VertxTestContext testContext) {
    var dwcaRecords = dbOperation.findDwcaRecords(new JsonObject().put("user_ref", "unknown"));
    dwcaRecords.setHandler(ar -> {
      var result = ar.result();
      assertThat(result).isEmpty();
      testContext.completeNow();
    });
  }

  @Test
  void findDataset(VertxTestContext testContext) {
    var datasetRef = "NnqVLwIyPn-nRkc";
    var dataset = dbOperation.findDataset(datasetRef);
    dataset.setHandler(ar -> {
      var result = ar.result();
      assertThat(result).hasSize(12);
      testContext.completeNow();
    });
  }

  @Test
  void findDatasetForUnknownRefReturnsNull(VertxTestContext testContext) {
    var dataset = dbOperation.findDataset("unknown");
    dataset.setHandler(ar -> {
      var result = ar.result();
      assertThat(result).isNull();
      testContext.completeNow();
    });
  }

  @Test
  void findDatasetCoreTable(VertxTestContext testContext) {
    var dataset = dbOperation.findDatasetCoreTable("PoJnGNMaxsupE4w");
    dataset.setHandler(ar -> {
      var result = ar.result();
      assertThat(result).isEqualTo("occurrence");
      testContext.completeNow();
    });
  }
}
