package org.obis.smalldata.db;

import org.pmw.tinylog.Logger;

import java.security.SecureRandom;
import java.util.Base64;

import static org.pmw.tinylog.Logger.info;

enum SecureRandomId {

  INSTANCE;

  private static final SecureRandom RANDOM = new SecureRandom();
  private static final Base64.Encoder ENCODER = Base64.getUrlEncoder().withoutPadding();

  public static String generate() {
    byte[] buffer = new byte[11];
    RANDOM.nextBytes(buffer);
    var secureId = ENCODER.encodeToString(buffer);
    info("Generated new id: {}", secureId);
    return secureId;
  }
}
