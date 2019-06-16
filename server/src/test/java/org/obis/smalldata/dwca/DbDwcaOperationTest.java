package org.obis.smalldata.dwca;

import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import io.vertx.junit5.VertxExtension;
import io.vertx.junit5.VertxTestContext;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.obis.smalldata.testutil.TestDb;
import org.obis.smalldata.util.Collections;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(VertxExtension.class)
class DbDwcaOperationTest {
  private static final String DWC_TABLE = "dwcTable";
  private static final String DWC_RECORD = "dwcRecord";
  private static final String DEFAULT_DATASET_REF = "NnqVLwIyPn-nRkc";
  private static final String DEFAULT_USER_REF = "ovZTtaOJZ98xDDY";
  private static final String KEY_DATASET_REF = "dataset_ref";
  private static final String KEY_IOBIS = "iobis";
  private static final String KEY_USER_REF = "user_ref";
  private static final JsonObject DATASET_QUERY = new JsonObject().put(KEY_DATASET_REF, DEFAULT_DATASET_REF);

  private static TestDb testDb;
  private static MongoClient mongoClient;
  private static DbDwcaOperation dbDwcaOperation;

  @BeforeAll
  public static void setUp() {
    testDb = new TestDb();
    mongoClient = testDb.init(Vertx.vertx());
    dbDwcaOperation = new DbDwcaOperation(mongoClient);
  }

  @AfterAll
  public static void tearDown() {
    mongoClient.close();
    testDb.shutDown();
  }

  @Test
  void findDwcaRecordsForKnownDatasetRef(VertxTestContext testContext) {
    var dwcaRecords = dbDwcaOperation.findDwcaRecords(DATASET_QUERY);
    dwcaRecords.setHandler(ar -> {
      var result = ar.result();
      assertThat(result).hasSize(642);
      testContext.completeNow();
    });
  }

  @Test
  void findDwcaRecordsReturnsAllKeysIfFieldsIsEmpty(VertxTestContext testContext) {
    var dwcaRecords = dbDwcaOperation.findDwcaRecords(
      DATASET_QUERY,
      new JsonObject());
    dwcaRecords.setHandler(ar -> {
      var result = ar.result();
      assertThat(result)
        .hasSize(642)
        .allSatisfy(dwca -> {
          assertThat(dwca.getMap()).containsOnlyKeys("_ref", "user_ref", "_id", "dataset_ref", DWC_TABLE, DWC_RECORD);
          assertThat(dwca.getJsonObject(DWC_RECORD).getMap()).containsOnlyKeys("id", "tdwg", "purl", "iobis");
        });
      testContext.completeNow();
    });
  }

  @Test
  void findDwcaRecordsAlwaysProvidesDefaultSetOfKeysNextToRequiredOnes(VertxTestContext testContext) {
    var dwcaRecords = dbDwcaOperation.findDwcaRecords(
      DATASET_QUERY,
      new JsonObject()
        .put("_ref", true)
        .put("user_ref", false));
    dwcaRecords.setHandler(ar -> {
      assertThat(ar.result())
        .hasSize(642)
        .allSatisfy(dwca -> {
          assertThat(dwca.getMap()).containsOnlyKeys("_ref", "user_ref", "_id", "dataset_ref", DWC_TABLE, DWC_RECORD);
          assertThat(dwca.getJsonObject(DWC_RECORD).getMap()).containsOnlyKeys("id");
        });
      testContext.completeNow();
    });
  }

  @Test
  void findDwcaRecordsProvidesNestedData(VertxTestContext testContext) {
    var dwcaRecords = dbDwcaOperation.findDwcaRecords(
      DATASET_QUERY,
      new JsonObject().put("dwcRecord.tdwg", true));
    dwcaRecords.setHandler(ar -> {
      assertThat(ar.result())
        .hasSize(642)
        .allSatisfy(dwca -> {
          assertThat(dwca.getMap()).containsOnlyKeys("user_ref", "_id", "dataset_ref", DWC_TABLE, DWC_RECORD);
          assertThat(dwca.getJsonObject(DWC_RECORD).getMap()).containsOnlyKeys("id", "tdwg");
        });
      testContext.completeNow();
    });
  }

  @Test
  void findDwcaRecordsForUnknownDatasetRef(VertxTestContext testContext) {
    var dwcaRecords = dbDwcaOperation.findDwcaRecords(new JsonObject().put(KEY_DATASET_REF, "unknown"));
    dwcaRecords.setHandler(ar -> {
      var result = ar.result();
      assertThat(result).isEmpty();
      testContext.completeNow();
    });
  }

  @Test
  void findDwcaRecordsForUserRef(VertxTestContext testContext) {
    var dwcaRecords = dbDwcaOperation.findDwcaRecords(new JsonObject().put(KEY_USER_REF, DEFAULT_USER_REF));
    dwcaRecords.setHandler(ar -> {
      var result = ar.result();
      assertThat(result).hasSize(2955);
      testContext.completeNow();
    });
  }

  @Test
  void findDwcaRecordsForUnknownUserRef(VertxTestContext testContext) {
    var dwcaRecords = dbDwcaOperation.findDwcaRecords(new JsonObject().put(KEY_USER_REF, "unknown"));
    dwcaRecords.setHandler(ar -> {
      var result = ar.result();
      assertThat(result).isEmpty();
      testContext.completeNow();
    });
  }

  @Test
  void findDataset(VertxTestContext testContext) {
    var dataset = dbDwcaOperation.findDataset(DEFAULT_DATASET_REF);
    dataset.setHandler(ar -> {
      var result = ar.result();
      assertThat(result).hasSize(12);
      testContext.completeNow();
    });
  }

  @Test
  void findDatasetForUnknownRefReturnsNull(VertxTestContext testContext) {
    var dataset = dbDwcaOperation.findDataset("unknown");
    dataset.setHandler(ar -> {
      var result = ar.result();
      assertThat(result).isNull();
      testContext.completeNow();
    });
  }

  @Test
  void findDatasetCoreTable(VertxTestContext testContext) {
    var dataset = dbDwcaOperation.findDatasetCoreTable("PoJnGNMaxsupE4w");
    dataset.setHandler(ar -> {
      var result = ar.result();
      assertThat(result).isEqualTo("occurrence");
      testContext.completeNow();
    });
  }

  @Test
  void putDwcaRecord(VertxTestContext testContext) {
    var dwcaId = "IBSS_R/V N. Danilevskiy 1935 Azov Sea benthos data_1032";
    var records = List.of(
      new JsonObject()
        .put(DWC_TABLE, "occurrence")
        .put(KEY_USER_REF, DEFAULT_USER_REF)
        .put(KEY_DATASET_REF, DEFAULT_DATASET_REF)
        .put(DWC_RECORD, new JsonObject()
          .put("id", dwcaId)
          .put(KEY_IOBIS, new JsonObject())),
      new JsonObject()
        .put(DWC_TABLE, "emof")
        .put(KEY_USER_REF, DEFAULT_USER_REF)
        .put(KEY_DATASET_REF, DEFAULT_DATASET_REF)
        .put(DWC_RECORD, new JsonObject()
          .put("id", dwcaId)
          .put("purl", new JsonObject())
          .put(KEY_IOBIS, new JsonObject())),
      new JsonObject()
        .put(DWC_TABLE, "emof")
        .put(KEY_USER_REF, DEFAULT_USER_REF)
        .put(KEY_DATASET_REF, DEFAULT_DATASET_REF)
        .put(DWC_RECORD, new JsonObject()
          .put("id", dwcaId)
          .put(KEY_IOBIS, new JsonObject())));
    var result = dbDwcaOperation.putDwcaRecord(dwcaId, records);
    result.setHandler(arOperation -> {
      var operationResult = arOperation.result();
      assertThat(operationResult.getInteger("insertedCount")).isEqualTo(3);
      assertThat(operationResult.getInteger("deletedCount")).isEqualTo(3);
      assertThat(operationResult.getJsonArray("upserts")).isEmpty();
      mongoClient.find(
        Collections.DATASETRECORDS.dbName(),
        new JsonObject().put("dwcRecord.id", dwcaId),
        arFind -> {
          var foundRecords = arFind.result();
          assertThat(foundRecords).hasSize(3);
          foundRecords.forEach(found -> {
            assertThat(found.getJsonObject(DWC_RECORD).getJsonObject(KEY_IOBIS)).isEqualTo(new JsonObject());
          });
          testContext.completeNow();
        });
    });
  }
}
