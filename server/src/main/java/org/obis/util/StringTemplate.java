package org.obis.util;

import java.util.Map;
import java.util.regex.Pattern;

public class StringTemplate {

  public static String interpolate(String template, Map<String, ? extends Object> values) {
    var result = template;
    var it = values.entrySet().iterator();
    while (it.hasNext()) {
      var entry = it.next();
      result = Pattern.compile(Pattern.quote("#{" + entry.getKey() + "}"))
        .matcher(result)
        .replaceAll(entry.getValue().toString());
    }
    return result;
  }

  private StringTemplate() {}
}
