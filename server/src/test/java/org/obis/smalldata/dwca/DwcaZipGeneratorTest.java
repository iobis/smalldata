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
import org.obis.smalldata.testutil.TestDb;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import static org.assertj.core.api.Assertions.assertThat;
import static org.pmw.tinylog.Logger.debug;

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
    debug("shutdown mongo db");
    mongoClient.close();
    testDb.shutDown();
  }

  @Test
  public void writeZipFile() throws InterruptedException, IOException {
    var datasetRef = "NnqVLwIyPn-nRkc";
    var dbQuery = new DbQuery(mongoClient);
    var zipGenerator = new DwcaZipGenerator("http://localhost:3000/");
    var dwcaRecordsFuture = dbQuery.findDwcaRecords(datasetRef);
    var datasetFuture = dbQuery.findDataset(datasetRef);
    var result = Future.<Optional<Path>>future();
    var countDownLatch = new CountDownLatch(1);

    CompositeFuture.all(datasetFuture, dwcaRecordsFuture).setHandler(ar -> {
      var dataset = (JsonObject) ar.result().list().get(0);
      var dwcaRecords = (List<JsonObject>) ar.result().list().get(1);
      result.complete(zipGenerator.generate(dwcaRecords, dataset));
      countDownLatch.countDown();
    });

    assertThat(countDownLatch.await(2000, TimeUnit.MILLISECONDS)).isTrue();
    assertThat(result.isComplete()).isTrue();
    assertThat(result.result()).isPresent();
    var path = result.result().orElseThrow();
    assertThat(path)
      .exists()
      .isRegularFile();
    ZipFile zipFile = new ZipFile(path.toFile());
    assertThat(zipFile.size()).isEqualTo(4);
    var fileNamesInZip = zipFile.stream()
      .map(ZipEntry::getName)
      .sorted()
      .collect(Collectors.toList());
    assertThat(fileNamesInZip.get(0)).isEqualTo("eml.xml");
    assertThat(fileNamesInZip.get(1)).matches("emof[0-9]+.txt");
    assertThat(fileNamesInZip.get(2)).isEqualTo("meta.xml");
    assertThat(fileNamesInZip.get(3)).matches("occurrence[0-9]+.txt");
    zipFile.close();
    Files.delete(path);
  }
}
