package org.obis.smalldata.dwca;

import io.vertx.core.CompositeFuture;
import io.vertx.core.Future;
import io.vertx.core.Vertx;
import io.vertx.ext.mongo.MongoClient;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import static org.pmw.tinylog.Logger.info;

class DbQueryTest {
  private TestDb testDb;
  private MongoClient mongoClient;
  private DbQuery dbQuery;
  private Future<Boolean> waitForResult;

  @BeforeEach
  public void start() {
    waitForResult = Future.future();
    waitForResult.setHandler(done -> {
      info("shutdown mongo db");
      mongoClient.close();
      testDb.shutDown();
    });
    testDb = new TestDb();
    mongoClient = testDb.init(Vertx.vertx());
    info(mongoClient);
    dbQuery = new DbQuery(mongoClient);
  }

  @AfterEach
  public void stop() {
    info("-- Test done.");
  }

  @Test
  void testDatasetFuture() throws InterruptedException {
    var datasetRef = "NnqVLwIyPn-nRkc";
    var dwcaRecords = dbQuery.dwcaRecords(datasetRef);
    var dataset = dbQuery.dataset(datasetRef);
    var countDownLatch = new CountDownLatch(1);
    CompositeFuture.all(dataset, dwcaRecords).setHandler(res -> {
      info(res.result().list().get(0));
      info(res.result().list().get(1));
      waitForResult.complete();
      countDownLatch.countDown();
    });
    if (!countDownLatch.await(1000, TimeUnit.MILLISECONDS)) {
      throw new InterruptedException("Couldn't write data to database");
    }
  }

}
