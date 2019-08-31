package org.obis.smalldata.webapi.authority;

import io.vertx.core.json.JsonObject;

import java.util.Collection;
import java.util.function.Predicate;

import static org.pmw.tinylog.Logger.info;

public class DemoAuthority implements Authority {
  @Override
  public String getEmail(JsonObject principal) {
    return "another.user@domain.org";
  }

  @Override
  public Predicate<JsonObject> authorizeRoles(Collection<String> roles) {
    info(roles);
    return profile -> true;
  }
}
