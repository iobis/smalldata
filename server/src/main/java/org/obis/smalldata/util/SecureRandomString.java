package org.obis.smalldata.util;

import static org.pmw.tinylog.Logger.debug;

import java.security.SecureRandom;
import java.util.Base64;

public class SecureRandomString {

  private static final SecureRandom RANDOM = new SecureRandom();
  private static final Base64.Encoder ENCODER = Base64.getUrlEncoder().withoutPadding();

  private SecureRandomString() {}

  private static String generate(int length) {
    byte[] buffer = new byte[length];
    RANDOM.nextBytes(buffer);
    var secure = ENCODER.encodeToString(buffer);
    debug("Generated new random string: {}", secure);
    return secure;
  }

  public static String generateId() {
    return generate(11);
  }

  public static String generateSalt() {
    return generate(22);
  }
}
