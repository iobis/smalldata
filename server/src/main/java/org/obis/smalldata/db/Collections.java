package org.obis.smalldata.db;

public enum Collections {

  USERS("users"),
  DATASETS("datasets"),
  DWCADOCS("dwcadocs");

  private String dbName;

  Collections(String dbName) {
    this.dbName = dbName;
  }

  public String dbName() {
    return dbName;
  }
}
