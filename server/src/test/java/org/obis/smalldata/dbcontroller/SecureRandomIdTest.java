package org.obis.smalldata.dbcontroller;

import org.junit.jupiter.api.Test;

import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;

public class SecureRandomIdTest {

  @Test
  public void testRandomId() {
    Stream.generate(SecureRandomId::generateId)
      .limit(10)
      .forEach(id -> assertThat(id).hasSize(15));
  }
}
