package org.obis.smalldata.user;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonObject;

import java.time.Instant;

import static org.pmw.tinylog.Logger.info;

public class User extends AbstractVerticle {

  @Override
  public void start(Future<Void> startFuture) {
    // TODO: calculate new bulkiness on new record:
    // bulkinessCalculator.decay(previousValue, previousInstant) + 1
    var bulkinessConfig = config().getJsonObject("bulkiness", new JsonObject().put("halfTimeInDays", 1.0));
    var bulkinessCalculator = new BulkinessCalculator(bulkinessConfig.getDouble("halfTimeInDays"));
    bulkinessCalculator.decay(1, Instant.now());

    vertx.eventBus().localConsumer("users.exists", this::handleExists);

    startFuture.complete();
  }

  private void handleExists(Message<String> message) {
    //TODO: check against db
    var userRef = message.body();
    info(userRef);
    message.reply(true);
  }

}
