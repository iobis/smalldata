package org.obis.smalldata.dwca;

import com.google.common.base.Splitter;
import com.google.common.base.Throwables;
import com.google.common.collect.Iterables;
import com.google.common.collect.Sets;
import com.google.common.io.Resources;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.pmw.tinylog.Logger.error;
import static org.pmw.tinylog.Logger.info;

public class DwcaCsvGeneratorTest {

  private final TestDb testDb = new TestDb();
  private MongoClient mongoClient;

  @BeforeEach
  public void start() {
    mongoClient = testDb.init(Vertx.vertx());
  }

  @Test
  public void testCsvData() {
    var csvGenerator = new DwcCsvGenerator(this.mongoClient);
    var future = new CompletableFuture<List<JsonObject>>();
    csvGenerator.doWithDwcaRecords("NnqVLwIyPn-nRkc", res -> future.complete(res.result()));
    //wEaBfmFyQhYCdsk
    try {
      var records = future.get(500, TimeUnit.MILLISECONDS);
      var merged = csvGenerator.extractDwcRecords(records);
      var dwcTableWriter = new DwcTableWriter(csvGenerator);
      merged.entrySet().stream()
        .forEach(dwcTable -> {
          var file = dwcTableWriter.writeTableToFile(dwcTable);
          String resourcePath = "demodata/dwc/benthic_data_sevastopol-v1.1/" + dwcTable.getKey() + ".txt";
          var resource = Resources.getResource(resourcePath);
          try {
            var actualCount = Files.lines(file.toPath()).count();
            var expectedCount = Files.lines(Paths.get(resource.getPath())).count();
            assertEquals(expectedCount, actualCount);

            var actualLines = Files.lines(file.toPath());
            var expectedLines = Files.lines(Paths.get(resource.getPath()));
            var splitter = Splitter.on('/').trimResults();
            Set<String> actualHeaders = Sets.newHashSet(
              actualLines.findFirst().get().split("\t")).stream()
              .map(h -> Iterables.getLast(splitter.split(h)))
              .collect(Collectors.toSet());
            Set<String> expectedHeaders = Sets.newHashSet(
              expectedLines.findFirst().get().split("\t"));
            assertTrue(expectedHeaders.containsAll(actualHeaders));
          } catch (IOException e) {
            error(Throwables.getStackTraceAsString(e));
          }
        });
    } catch (InterruptedException | ExecutionException | TimeoutException e) {
      error(Throwables.getStackTraceAsString(e));
    }
  }

  @AfterEach
  public void stop() {
    info("shutdown mongo db");
    testDb.shutDown();

  }
}
