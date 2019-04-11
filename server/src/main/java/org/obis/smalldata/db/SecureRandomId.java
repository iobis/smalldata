package org.obis.smalldata.db;

import java.security.SecureRandom;
import java.util.Base64;

import static org.pmw.tinylog.Logger.debug;

public class SecureRandomId {

  private static final SecureRandom RANDOM = new SecureRandom();
  private static final Base64.Encoder ENCODER = Base64.getUrlEncoder().withoutPadding();

  public static String generateId() {
    byte[] buffer = new byte[11];
    RANDOM.nextBytes(buffer);
    var secureId = ENCODER.encodeToString(buffer);
    debug("Generated new id: {}", secureId);
    return secureId;
  }

  private SecureRandomId() {}
}
