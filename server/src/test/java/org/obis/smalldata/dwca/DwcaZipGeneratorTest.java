package org.obis.smalldata.dwca;

import io.vertx.core.CompositeFuture;
import io.vertx.core.Future;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.zip.ZipFile;

import static org.assertj.core.api.Assertions.assertThat;
import static org.pmw.tinylog.Logger.error;
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
  public void writeZipFile() throws InterruptedException {
    var datasetRef = "NnqVLwIyPn-nRkc";
    var dbQuery = new DbQuery(mongoClient);
    var zipGenerator = new DwcaZipGenerator();
    var dwcaRecordsFuture = dbQuery.dwcaRecords(datasetRef);
    var datasetFuture = dbQuery.dataset(datasetRef);
    var result = Future.<JsonObject>future();
    var countDownLatch = new CountDownLatch(1);

    CompositeFuture.all(datasetFuture, dwcaRecordsFuture).setHandler(res -> {
      var dataset = (JsonObject) res.result().list().get(0);
      var dwcaRecords = (List<JsonObject>) res.result().list().get(1);
      var path = zipGenerator.generate(dwcaRecords, dataset);
      result.complete(new JsonObject().put("file", path.get().toAbsolutePath().toString()));
    });
    result.setHandler(zip -> {
      var fileName = zip.result().getString("file");
      try (InputStream is = Files.newInputStream(Path.of(fileName));
           ZipFile zipFile = new ZipFile(fileName)) {
        assertThat(zipFile.size()).isEqualTo(4);
        assertThat(is.readAllBytes().length).isBetween(15853, 15862);
      } catch (IOException e) {
        error(e.getMessage());
      }
      countDownLatch.countDown();
    });
    info(countDownLatch.await(2000, TimeUnit.MILLISECONDS));
  }
}
