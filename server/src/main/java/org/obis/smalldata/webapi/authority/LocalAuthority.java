package org.obis.smalldata.webapi.authority;

import io.vertx.core.json.JsonObject;

import java.util.Collection;
import java.util.function.Predicate;

public class LocalAuthority implements Authority {
  @Override
  public String getEmail(JsonObject principal) {
    return null;
  }

  @Override
  public Predicate<JsonObject> authorizeRoles(Collection<String> roles) {
    return profile -> true;
  }
}
