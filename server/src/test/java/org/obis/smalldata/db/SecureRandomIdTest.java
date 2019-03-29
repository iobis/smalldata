package org.obis.smalldata.db;

import org.junit.jupiter.api.Test;

import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.pmw.tinylog.Logger.info;

public class SecureRandomIdTest {

  @Test
  public void testRandomId() {
    Stream.generate(SecureRandomId::generate).limit(10).forEach(srid -> {
      info(srid);
      assertEquals(srid.length(), 15);
    });
  }
}
