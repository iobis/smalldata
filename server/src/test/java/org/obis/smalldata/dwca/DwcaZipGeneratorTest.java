package org.obis.smalldata.dwca;

import io.vertx.core.Vertx;
import io.vertx.ext.mongo.MongoClient;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static org.pmw.tinylog.Logger.info;

public class DwcaZipGeneratorTest {

  private static TestDb testDb;
  private static MongoClient mongoClient;

  @BeforeAll
  public static void start() {
    testDb = new TestDb();
    mongoClient = testDb.init(Vertx.vertx());
  }

  @AfterAll
  public static void stop() {
    info("shutdown mongo db");
    mongoClient.close();
    testDb.shutDown();
  }

  @Test
  public void writeZipFile() {

  }
}
