package org.obis.smalldata.dataset;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.json.JsonObject;

import java.time.Instant;

public class Dataset extends AbstractVerticle {

  @Override
  public void start(Future<Void> startFuture) {
    // TODO: calculate new bulkiness on new record:
    // bulkinessCalculator.decay(previousValue, previousInstant) + 1
    var bulkinessConfig = config().getJsonObject("bulkiness", new JsonObject().put("halfTimeInDays", 1.0));
    var bulkinessCalculator = new BulkinessCalculator(bulkinessConfig.getDouble("halfTimeInDays"));
    bulkinessCalculator.decay(1, Instant.now());

    startFuture.complete();
  }

}
