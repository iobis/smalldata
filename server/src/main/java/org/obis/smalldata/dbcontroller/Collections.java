package org.obis.smalldata.dbcontroller;

public enum Collections {

  USERS("users"),
  DATASETS("datasets"),
  DATASETRECORDS("dwcarecords");

  private String dbName;

  Collections(String dbName) {
    this.dbName = dbName;
  }

  public String dbName() {
    return dbName;
  }
}
