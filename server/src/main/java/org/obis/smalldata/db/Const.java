package org.obis.smalldata.db;

import io.vertx.core.json.JsonObject;

public enum Const {

  INSTANCE;

  public final JsonObject collation = new JsonObject().put("locale", "simple");
}
