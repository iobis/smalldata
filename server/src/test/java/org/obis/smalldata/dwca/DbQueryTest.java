package org.obis.smalldata.dwca;

import io.vertx.core.Vertx;
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
class DbQueryTest {
  private static TestDb testDb;
  private static MongoClient mongoClient;
  private static DbQuery dbQuery;

  @BeforeAll
  public static void setUp() {
    testDb = new TestDb();
    mongoClient = testDb.init(Vertx.vertx());
    dbQuery = new DbQuery(mongoClient);
  }

  @AfterAll
  public static void tearDown() {
    mongoClient.close();
    testDb.shutDown();
  }

  @Test
  void findDwcaRecords(VertxTestContext testContext) {
    var datasetRef = "NnqVLwIyPn-nRkc";
    var dwcaRecords = dbQuery.findDwcaRecords(datasetRef);
    dwcaRecords.setHandler(ar -> {
      var result = ar.result();
      assertThat(result).hasSize(642);
      testContext.completeNow();
    });
  }

  @Test
  void findDwcaRecordsForUnknownRefReturnsEmptyList(VertxTestContext testContext) {
    var dwcaRecords = dbQuery.findDwcaRecords("unknown");
    dwcaRecords.setHandler(ar -> {
      var result = ar.result();
      assertThat(result).hasSize(0);
      testContext.completeNow();
    });
  }

  @Test
  void findDataset(VertxTestContext testContext) {
    var datasetRef = "NnqVLwIyPn-nRkc";
    var dataset = dbQuery.findDataset(datasetRef);
    dataset.setHandler(ar -> {
      var result = ar.result();
      assertThat(result).hasSize(12);
      testContext.completeNow();
    });
  }

  @Test
  void findDatasetForUnknownRefReturnsNull(VertxTestContext testContext) {
    var dataset = dbQuery.findDataset("unknown");
    dataset.setHandler(ar -> {
      var result = ar.result();
      assertThat(result).isNull();
      testContext.completeNow();
    });
  }
}
