package org.obis.smalldata.webapi.authority;

import static org.pmw.tinylog.Logger.info;

import io.vertx.core.json.JsonObject;
import java.util.Collection;
import java.util.function.Predicate;

public class DemoAuthority implements Authority {
  @Override
  public String getEmail(JsonObject principal) {
    return "carl.chun@domain.org";
  }

  @Override
  public Predicate<JsonObject> authorizeRoles(Collection<String> roles) {
    info(roles);
    return profile -> true;
  }
}
