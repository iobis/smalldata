package org.obis.util;

import java.net.URL;
import java.util.Set;

import static com.google.common.base.Preconditions.checkArgument;

public class Urls {
  private static final Set<String> SUPPORTED_PROTOCOLS = Set.of("http", "https");

  public static boolean isValid(String urlString) {
    try {
      URL url = new URL(urlString);
      checkArgument(SUPPORTED_PROTOCOLS.contains(url.getProtocol()), "protocol of the base url should be 'http' or 'https'");
      url.toURI();
      return true;
    } catch (Exception e) {
      return false;
    }
  }

  public static boolean isLocalhost(String url) {
    return url.contains("//localhost") || url.contains("//127.0.0.");
  }

  public static String normalize(String url) {
    return url.endsWith("/") ? url : url + "/";
  }

  private Urls() {
  }
}
