package org.obis.smalldata.dwca;

import com.google.common.io.Resources;
import io.vertx.core.CompositeFuture;
import io.vertx.core.Future;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import org.assertj.core.data.Offset;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
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
  public void writeZipFile() throws InterruptedException {
    var datasetRef = "NnqVLwIyPn-nRkc";
    info(mongoClient);
    var dbQuery = new DbQuery(mongoClient);
    var zipGenerator = new DwcaZipGenerator("http://localhost:3000/");
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
      var expectedZip = Resources.getResource("testdata/dwca/generated-dwca.zip");
      try (InputStream is = Files.newInputStream(Path.of(fileName));
           InputStream expected = expectedZip.openStream();
           ZipFile zipFile = new ZipFile(fileName)) {
        var expectedSize = expected.readAllBytes().length;
        assertThat(zipFile.size()).isEqualTo(4);
        assertThat(is.readAllBytes().length).isCloseTo(expectedSize, Offset.offset(20));
      } catch (IOException e) {
        error(e.getMessage());
      }
      countDownLatch.countDown();
    });
    info(countDownLatch.await(2000, TimeUnit.MILLISECONDS));
  }
}
