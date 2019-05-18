package org.obis.smalldata.dbcontroller;

import org.junit.jupiter.api.Test;
import org.obis.smalldata.util.SecureRandomString;

import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;

public class SecureRandomStringTest {

  @Test
  public void testRandomId() {
    Stream.generate(SecureRandomString::generateId)
      .limit(10)
      .forEach(id -> assertThat(id).hasSize(15));
  }
}
