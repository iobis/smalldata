package org.obis.smalldata.dwca;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvParser;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
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
import org.pmw.tinylog.Logger;

import java.io.IOException;
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
    var csvSchema = CsvSchema.builder()
      .setUseHeader(true)
      .setColumnSeparator('\t')
      .disableQuoteChar();
    var csvMapper = new CsvMapper()
      .enable(CsvParser.Feature.IGNORE_TRAILING_UNMAPPABLE)
      .enable(CsvParser.Feature.INSERT_NULLS_FOR_MISSING_COLUMNS)
      .configure(JsonGenerator.Feature.IGNORE_UNKNOWN, true)
      .writer();
    csvGenerator.doWithDwcaRecords("wEaBfmFyQhYCdsk", res -> {
      future.complete(res.result());
    });
    try {
      var records = future.get(500, TimeUnit.MILLISECONDS);
      var merged = csvGenerator.extractDwcRecords(records);
      var headers = csvGenerator.extractHeaders(merged);
      headers.stream().forEach(csvSchema::addColumn);
      info(csvMapper.with(csvSchema.build())
        .writeValueAsString(merged.stream()
          .map(JsonObject::getMap)
          .collect(Collectors.toList())));
    } catch (ExecutionException | InterruptedException | TimeoutException | JsonProcessingException e) {
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
