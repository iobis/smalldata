package org.obis.smalldata.dwca;

import io.vertx.core.CompositeFuture;
import io.vertx.core.Vertx;
import io.vertx.ext.mongo.MongoClient;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.obis.smalldata.testutil.TestDb;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;

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
  void testDatasetFuture() throws InterruptedException {
    var datasetRef = "NnqVLwIyPn-nRkc";
    var dwcaRecords = dbQuery.dwcaRecords(datasetRef);
    var dataset = dbQuery.dataset(datasetRef);
    var countDownLatch = new CountDownLatch(1);
    CompositeFuture.all(dataset, dwcaRecords).setHandler(ar -> {
      var result = ar.result();
      assertThat(result.list()).hasSize(2);
      countDownLatch.countDown();
    });
    if (!countDownLatch.await(1000, TimeUnit.MILLISECONDS)) {
      throw new InterruptedException("Couldn't write data to database");
    }
  }
}
