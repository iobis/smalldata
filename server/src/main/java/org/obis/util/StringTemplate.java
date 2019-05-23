package org.obis.util;

import java.util.Map;
import java.util.regex.Pattern;

public class StringTemplate {

  public static String interpolate(String template, Map<String, ?> values) {
    var result = template;
    for (Map.Entry<String, ?> entry : values.entrySet()) {
      result = Pattern.compile(Pattern.quote("#{" + entry.getKey() + "}"))
        .matcher(result)
        .replaceAll(entry.getValue().toString());
    }
    return result;
  }

  private StringTemplate() {}
}
