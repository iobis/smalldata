package org.obis.smalldata.dbcontroller;

import io.vertx.core.json.JsonObject;

public enum Const {

  INSTANCE;

  public final JsonObject collation = new JsonObject().put("locale", "simple");
}
