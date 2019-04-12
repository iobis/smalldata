package org.obis.smalldata.dwca;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvParser;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import com.google.common.base.Splitter;
import com.google.common.collect.Iterables;
import com.google.common.collect.Sets;
import com.google.common.io.Resources;
import de.flapdoodle.embed.mongo.MongodExecutable;
import de.flapdoodle.embed.mongo.MongodProcess;
import de.flapdoodle.embed.mongo.MongodStarter;
import de.flapdoodle.embed.mongo.config.MongodConfigBuilder;
import de.flapdoodle.embed.mongo.config.Net;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.process.runtime.Network;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.obis.smalldata.db.BulkOperationUtil;
import org.obis.smalldata.util.IoFile;
import org.pmw.tinylog.Logger;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.SortedSet;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.function.Function;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.pmw.tinylog.Logger.info;

public class DwcaCsvGeneratorTest {

  private final Vertx vertx = Vertx.vertx();
  private final String BIND_IP = "localhost";
  private final int PORT = 12345;
  private final JsonObject dbConfig = new JsonObject()
    .put("bindIp", BIND_IP)
    .put("port", PORT);
  private final JsonObject dbClientConfig = new JsonObject()
    .put("host", BIND_IP)
    .put("port", PORT);
  private MongoClient mongoClient;
  private MongodExecutable executable;
  private MongodProcess process;

  @BeforeEach
  public void setup() {
    try {
      MongodConfigBuilder mongodConfig = new MongodConfigBuilder()
        .net(new Net(BIND_IP, PORT, Network.localhostIsIPv6()))
        .version(Version.Main.PRODUCTION);
      this.executable = MongodStarter.getDefaultInstance().prepare(mongodConfig.build());
      this.process = executable.start();

      var future = new CompletableFuture<Long>();
      this.mongoClient= MongoClient.createNonShared(vertx, dbClientConfig);
      try {
        mongoClient.bulkWrite("dwcarecords",
          BulkOperationUtil.createOperationsFromFile("mockdata/dwca/dwcarecords.json"),
          client -> {
            future.complete(client.result().getInsertedCount());
          });
        info("added {} records", future.get());
      } catch (InterruptedException | ExecutionException e) {
        e.printStackTrace();
      }
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  @Test
  public void testCsvData() {
    var csvGenerator = new DwcCsvGenerator(this.mongoClient);
    var future = new CompletableFuture<List<JsonObject>>();
    var csvMapper = new CsvMapper()
      .enable(CsvParser.Feature.IGNORE_TRAILING_UNMAPPABLE)
      .enable(CsvParser.Feature.INSERT_NULLS_FOR_MISSING_COLUMNS)
      .configure(JsonGenerator.Feature.IGNORE_UNKNOWN, true)
      .writer();
    csvGenerator.doWithDwcaRecords("NnqVLwIyPn-nRkc", res -> future.complete(res.result()));
    //wEaBfmFyQhYCdsk
    try {
      var records = future.get(500, TimeUnit.MILLISECONDS);
      var merged = csvGenerator.extractDwcRecords(records);
      merged.entrySet().stream()
        .forEach(dwcTable -> {
            var csvSchema = CsvSchema.builder()
              .setUseHeader(true)
              .setColumnSeparator('\t')
              .disableQuoteChar();
            var headers = csvGenerator.extractHeaders(dwcTable.getValue());
            var tableName = dwcTable.getKey();
            headers.stream().forEach(csvSchema::addColumn);
            try {
              var file = File.createTempFile("obis-iode", tableName + ".txt");
              csvMapper.with(csvSchema.build())
                .writeValue(file, dwcTable.getValue().stream()
                  .map(JsonObject::getMap)
                  .collect(Collectors.toList()));
              String resourcePath = "demodata/dwc/benthic_data_sevastopol-v1.1/" + tableName + ".txt";
              URL resource = Resources.getResource(resourcePath);


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
              Set<String> expectedHeaders =Sets.newHashSet(
                expectedLines.findFirst().get().split("\t"));
              assertTrue(expectedHeaders.containsAll(actualHeaders));
            } catch (IOException e) {
              e.printStackTrace();
            }
          }
        );
    } catch (ExecutionException | InterruptedException | TimeoutException e) {
      e.printStackTrace();
    }
  }

  @AfterEach
  public void stop() {
    info("shutdown mongo db");
    if (this.process != null) {
      this.process.stop();
      this.executable.stop();
    }
  }

}
