package org.obis.smalldata.util;

import io.vertx.core.json.JsonObject;

public enum DbConst {

  INSTANCE;

  public final JsonObject collation = new JsonObject().put("locale", "simple");
}
