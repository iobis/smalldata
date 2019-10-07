package org.obis.smalldata.rss;

import static org.assertj.core.api.Java6Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.pmw.tinylog.Logger.info;

import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.junit5.VertxExtension;
import io.vertx.junit5.VertxTestContext;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.obis.smalldata.dataset.DatasetComponent;
import org.obis.smalldata.testutil.TestDb;

@ExtendWith(VertxExtension.class)
public class DbOperationTest {

  private TestDb testDb;
  private DbDwcaOperation dbOperation;

  @BeforeEach
  public void setUp(Vertx vertx, VertxTestContext testContext) {
    testDb = new TestDb();
    var mongoClient = testDb.init(vertx);
    dbOperation = new DbDwcaOperation(mongoClient);
    vertx
        .sharedData()
        .getLocalMap("settings")
        .put(
            "storage",
            new JsonObject().put("host", "localhost").put("port", 12345).put("path", ""));
    vertx.deployVerticle(
        DatasetComponent.class.getName(), testContext.succeeding(id -> testContext.completeNow()));
  }

  @AfterEach
  public void tearDown() {
    info("shutdown mongo db");
    testDb.shutDown();
  }

  @Test
  void aggreationIsSuccesful(Vertx vertx, VertxTestContext context) {
    dbOperation.withAggregatedDatasets(res -> {
      assertTrue(res.succeeded());
      var cursor = res.result();
      info(cursor);
      assertThat(cursor.getJsonObject("cursor").getJsonArray("firstBatch").size()).isEqualTo(4);
      assertThat(cursor.getJsonObject("cursor").getJsonArray("firstBatch")).allMatch(
          record -> !((JsonObject) record).getString("addedAtInstant").isEmpty()
              && !((JsonObject) record).getString("addedAtInstant").isBlank()
      );
      context.completeNow();
    });
  }
}
