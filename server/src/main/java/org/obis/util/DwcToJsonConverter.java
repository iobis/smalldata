package org.obis.util;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.google.common.io.Resources;
import io.swagger.models.Xml;
import io.vertx.core.json.JsonObject;

import javax.xml.bind.annotation.XmlSchema;
import java.io.File;
import java.security.SecureRandom;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.pmw.tinylog.Logger.info;

public class DwcToJsonConverter {

  private static ObjectMapper mapper = new ObjectMapper();
  private static CsvMapper csvMapper = new CsvMapper();
  private static XmlMapper xmlMapper = new XmlMapper();

  public static void main(String[] args) throws Exception {

    var resourceName = "mockdata/dwc/benthos_azov_sea_1935-v1.1/occurrence.txt";
    var resourceOutput = "./server/src/main/resources/mockdata/dwc/benthos_azov_sea_1935-v1.1/occurrence.json";
    var occurrences = Resources.getResource(resourceName);

    File output = new File(resourceOutput);

    CsvSchema csvSchema = CsvSchema.builder()
      .setUseHeader(true)
      .setColumnSeparator('\t')
      .build();

    // Read data from CSV file
    List<Object> readAll = csvMapper.readerFor(Map.class).with(csvSchema).readValues(occurrences).readAll();
    var expectedMaxCount = 50.0;
    var elementCount = readAll.size();
    var elementChance = Math.min(expectedMaxCount/elementCount, 1.0);
    var rand = new Random();

    var colHeaderNamespaces = Map.of(
      "purl", List.of("type", "modified", "bibliographicCitation", "references")
    );

    List<Object> result = readAll.stream()
      .filter(o -> rand.nextDouble() < elementChance)
      .map(LinkedHashMap.class::cast)
      .map(record -> {
        var specificNamespaceCols = colHeaderNamespaces.values().stream()
          .flatMap(List::stream)
          .collect(Collectors.toList());
        specificNamespaceCols.add("id");
        return Map.of(
          "id", record.get("id"),
          "purl", record.entrySet().stream()
            .map(Map.Entry.class::cast)
            .filter(entry -> colHeaderNamespaces.get("purl").contains(((Map.Entry) entry).getKey()))
            .collect(Collectors.toList()),
          "tdwg", record.entrySet().stream()
            .map(Map.Entry.class::cast)
            .filter(entry -> !specificNamespaceCols.contains(((Map.Entry) entry).getKey()))
            .collect(Collectors.toList()));
      })
      .collect(Collectors.toList());

    mapper.writerWithDefaultPrettyPrinter().writeValue(output, result);
    System.out.println(mapper.writerWithDefaultPrettyPrinter().writeValueAsString(result));
  }
}
