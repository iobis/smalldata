package org.obis.smalldata.webapi.Authority;

import io.vertx.core.json.JsonObject;

import java.util.Collection;
import java.util.function.Predicate;

public interface Authority {
  String getEmail(JsonObject principal);
  Predicate<JsonObject> authorizeRoles(Collection<String> roles);
}
