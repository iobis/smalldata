package org.obis.smalldata.user;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.junit.jupiter.api.Test;

public class BulkinessCalculatorTest {

  @Test
  void decay() {
    var calculator = new BulkinessCalculator(0.5);
    assertEquals(5.0 / 16, calculator.decay(5, Instant.now().minus(2, ChronoUnit.DAYS)), 1E-6);
    assertEquals(5.0 / 4, calculator.decay(5, Instant.now().minus(1, ChronoUnit.DAYS)), 1E-6);
    assertEquals(5.0 / 2, calculator.decay(5, Instant.now().minus(12, ChronoUnit.HOURS)), 1E-6);
    assertEquals(0.0, calculator.decay(0, Instant.now()));
  }
}
