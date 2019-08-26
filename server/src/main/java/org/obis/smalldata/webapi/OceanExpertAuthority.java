package org.obis.smalldata.webapi;

import io.vertx.core.json.JsonObject;

import java.util.Collection;
import java.util.function.Predicate;

public class OceanExpertAuthority implements Authority {
  @Override
  public String getEmail(JsonObject principal) {
    return principal==null?null:principal.getString("email");
  }

  @Override
  public Predicate<JsonObject> authorizeRoles(Collection<String> roles) {
    return profile -> roles.contains(profile.getString("role"));
  }
}
