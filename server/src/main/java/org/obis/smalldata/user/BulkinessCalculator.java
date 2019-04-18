package org.obis.smalldata.user;

import java.time.Duration;
import java.time.Instant;

class BulkinessCalculator {

  private static final int SECS_PER_DAY = 86400;
  private final double decayInSeconds;

  BulkinessCalculator(double halfTimeInDays) {
    this.decayInSeconds = Math.log(2.0) / (halfTimeInDays * SECS_PER_DAY);
  }

  double decay(double value, Instant instant) {
    var timediff = Duration.between(instant, Instant.now()).toSeconds();
    return value * Math.exp(- timediff * decayInSeconds);
  }
}
