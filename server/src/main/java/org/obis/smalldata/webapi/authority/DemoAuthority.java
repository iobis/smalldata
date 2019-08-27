package org.obis.smalldata.webapi.authority;

import io.vertx.core.json.JsonObject;
import org.pmw.tinylog.Logger;

import java.util.Collection;
import java.util.function.Predicate;

public class DemoAuthority implements Authority {
  @Override
  public String getEmail(JsonObject principal) {
    return "another.user@domain.org";
  }

  @Override
  public Predicate<JsonObject> authorizeRoles(Collection<String> roles) {
    Logger.info(roles);
    return profile -> true;
  }
}
