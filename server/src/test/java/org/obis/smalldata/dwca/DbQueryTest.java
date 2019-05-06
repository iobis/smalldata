package org.obis.smalldata.dwca;

import io.vertx.core.Vertx;
import io.vertx.ext.mongo.MongoClient;
import io.vertx.junit5.VertxExtension;
import io.vertx.junit5.VertxTestContext;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.obis.smalldata.testutil.TestDb;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(VertxExtension.class)
class DbQueryTest {
  private TestDb testDb;
  private MongoClient mongoClient;
  private DbQuery dbQuery;

  @BeforeEach
  public void setUp() {
    testDb = new TestDb();
    mongoClient = testDb.init(Vertx.vertx());
    dbQuery = new DbQuery(mongoClient);
  }

  @AfterEach
  public void tearDown() {
    mongoClient.close();
    testDb.shutDown();
  }

  @Test
  void dwcaRecords(VertxTestContext testContext) {
    var datasetRef = "NnqVLwIyPn-nRkc";
    var dwcaRecords = dbQuery.dwcaRecords(datasetRef);
    dwcaRecords.setHandler(ar -> {
      var result = ar.result();
      assertThat(result).hasSize(642);
      testContext.completeNow();
    });
  }

  @Test
  void dataset(VertxTestContext testContext) {
    var datasetRef = "NnqVLwIyPn-nRkc";
    var dataset = dbQuery.dataset(datasetRef);
    dataset.setHandler(ar -> {
      var result = ar.result();
      assertThat(result).hasSize(12);
      testContext.completeNow();
    });
  }
}
