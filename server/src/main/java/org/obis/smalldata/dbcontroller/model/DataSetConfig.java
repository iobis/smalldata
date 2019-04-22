package org.obis.smalldata.dbcontroller.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Value;

import java.util.Map;

@Value
@AllArgsConstructor
public class DataSetConfig {
  @JsonProperty("_ref")
  private final String ref;
  @JsonProperty("dataset_ref")
  private final String datasetRef;
  private final String core;
  private final Map<String, Map<String, Object>> tables;
}