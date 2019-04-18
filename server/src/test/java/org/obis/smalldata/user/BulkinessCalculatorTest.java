package org.obis.smalldata.user;

import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class BulkinessCalculatorTest {

  @Test
  void testDecay() {
    var calc = new BulkinessCalculator(0.5);
    assertEquals(5.0 / 16,
      calc.decay(5, Instant.now().minus(2, ChronoUnit.DAYS)), 1E-6);
    assertEquals(5.0 / 4,
      calc.decay(5, Instant.now().minus(1, ChronoUnit.DAYS)), 1E-6);
    assertEquals(5.0 / 2,
      calc.decay(5, Instant.now().minus(12, ChronoUnit.HOURS)), 1E-6);
  }

  @Test
  void testDecayInitialize() {
    var calc = new BulkinessCalculator(0.5);
    assertEquals(0.0, calc.decay(0, Instant.now()));
  }
}
