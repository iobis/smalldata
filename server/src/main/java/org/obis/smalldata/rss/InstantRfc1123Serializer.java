package org.obis.smalldata.rss;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import java.io.IOException;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

class InstantRfc1123Serializer extends StdSerializer<Instant> {
  private static final long serialVersionUID = 1L;

  public InstantRfc1123Serializer() {
    this(null);
  }

  public InstantRfc1123Serializer(Class<Instant> t) {
    super(t);
  }

  @Override
  public void serialize(Instant value, JsonGenerator jgen, SerializerProvider provider)
      throws IOException {
    jgen.writeString(
        DateTimeFormatter.RFC_1123_DATE_TIME.format(
            ZonedDateTime.ofInstant(value, ZoneOffset.UTC)));
  }

  public static Module asJacksonMapperModule(Class c) {
    return new SimpleModule().addSerializer(c, new InstantRfc1123Serializer());
  }
}
