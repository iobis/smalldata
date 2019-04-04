package org.obis.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import com.google.common.io.Resources;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.function.Function;
import java.util.stream.Collectors;

import static org.pmw.tinylog.Logger.info;

public class DwcToJsonConverter {

  private static ObjectMapper mapper = new ObjectMapper();
  private static CsvMapper csvMapper = new CsvMapper();

  private DwcToJsonConverter() {}

  public static void main(String[] args) {

    var resourceName = "mockdata/dwc/benthos_azov_sea_1935-v1.1/occurrence.txt";
    var resourceOutput = "./server/src/main/resources/mockdata/dwc/benthos_azov_sea_1935-v1.1/occurrence.json";
    var occurrences = Resources.getResource(resourceName);


    var csvSchema = CsvSchema.builder()
      .setUseHeader(true)
      .setColumnSeparator('\t')
      .build();

    List<Object> readAll = null;
    try {
      readAll = csvMapper.readerFor(Map.class).with(csvSchema).readValues(occurrences).readAll();
      mapCsv(resourceOutput, readAll);
    } catch (IOException e) {
      info(e.getStackTrace());
    }
  }

  private static void mapCsv(String resourceOutput, List<Object> readAll) {
    var output = new File(resourceOutput);
    var expectedMaxCount = 50.0;
    var elementCount = readAll.size();
    var elementChance = Math.min(expectedMaxCount / elementCount, 1.0);
    var rand = new Random();

    var colHeaderNamespaces = Map.of(
      "purl", List.of("type", "modified", "bibliographicCitation", "references")
    );

    List<Object> result = readAll.stream()
      .filter(o -> rand.nextDouble() < elementChance)
      .map(Map.class::cast)
      .map(record -> {
        var specificNamespaceCols = colHeaderNamespaces.values().stream()
          .flatMap(List::stream)
          .collect(Collectors.toList());
        specificNamespaceCols.add("id");
        return Map.of(
          "id", record.get("id"),
          "purl", colHeaderNamespaces.get("purl").stream()
            .filter(record::containsKey)
            .collect(Collectors.<String, String, Object>toMap(Function.identity(), record::get)),
          "tdwg", record.keySet().stream()
            .filter(key -> !specificNamespaceCols.contains(key))
            .collect(Collectors.<String, String, Object>toMap(Function.identity(), record::get)));
      })
      .collect(Collectors.toList());

    try {
      mapper.writerWithDefaultPrettyPrinter().writeValue(output, result);
      info(mapper.writerWithDefaultPrettyPrinter().writeValueAsString(result));
    } catch (IOException e) {
      info(e.getStackTrace());
    }
  }
}
