package org.obis.smalldata.db;

import java.security.SecureRandom;
import java.util.Base64;

enum SecureRandomId {

  INSTANCE;

  private static final SecureRandom RANDOM = new SecureRandom();
  private static final Base64.Encoder ENCODER = Base64.getUrlEncoder().withoutPadding();

  public static String generate() {
    byte[] buffer = new byte[11];
    RANDOM.nextBytes(buffer);
    return ENCODER.encodeToString(buffer);
  }
}
