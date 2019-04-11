package org.obis.smalldata.db;

import org.junit.jupiter.api.Test;

import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class SecureRandomIdTest {

  @Test
  public void testRandomId() {
    Stream.generate(SecureRandomId::generateId)
      .limit(10)
      .forEach(id -> assertEquals(id.length(), 15));
  }
}
