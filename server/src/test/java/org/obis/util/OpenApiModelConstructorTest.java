package org.obis.util;

import org.junit.jupiter.api.Test;
import org.obis.util.model.DarwinCoreExtension;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class OpenApiModelConstructorTest {

  @Test
  void constructApiModelIfEmpty() {
    var darwinCoreExtension = new DarwinCoreExtension();
    darwinCoreExtension.setProperties(List.of());

    var actual = OpenApiModelConstructor.constructApiModel(darwinCoreExtension);

    assertThat(actual).isEmpty();
  }

  @Test
  void constructApiModelIfNotEmpty() {
    var darwinCoreExtension = new DarwinCoreExtension();
    darwinCoreExtension.setProperties(List.of(Map.of("namespace", "namespace-value")));

    var actual = OpenApiModelConstructor.constructApiModel(darwinCoreExtension);

    assertThat(actual.entrySet())
      .isNotEmpty()
      .hasSize(1);
  }
}
