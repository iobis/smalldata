package org.obis.util;

import com.mashape.unirest.http.exceptions.UnirestException;
import org.obis.util.apicustomizers.CustomFieldMerger;
import org.obis.util.apicustomizers.TypeMapper;
import org.obis.util.model.DarwinCoreExtension;
import org.pmw.tinylog.Logger;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

import static org.pmw.tinylog.Logger.error;

public class GenerateOpenApi {
  private static final NamespaceMapper NS_MAPPER = NamespaceMapper.INSTANCE;
  private static final Map<String, String> FILES_TO_PROCESS = Map.of(
    "http://rs.gbif.org/core/dwc_occurrence_2015-07-02.xml", "Occurrence",
    "http://rs.gbif.org/core/dwc_taxon_2015-04-24.xml", "Taxon",
    "http://rs.gbif.org/core/dwc_event_2016_06_21.xml", "Event",
    "http://rs.gbif.org/extension/obis/extended_measurement_or_fact.xml", "EMOF"
  );

  private final DarwinCoreExtensionReader xmlReader = new DarwinCoreExtensionReader();
  private final OpenApiWriter apiWriter = new OpenApiWriter();
  private final List<Function<Map<String, Map<String, Object>>, Map<String, Map<String, Object>>>> customizers =
    List.of(new TypeMapper(), new CustomFieldMerger());
  private final String targetPath;

  private GenerateOpenApi(String targetPath) {
    this.targetPath = targetPath;
    NS_MAPPER.put("purl", "http://purl.org/dc/terms/");
    NS_MAPPER.put("dwcg", "http://rs.tdwg.org/dwc/terms/");
    NS_MAPPER.put("obis", "http://rs.iobis.org/obis/terms/");
  }

  private void processXml(Map.Entry<String, String> processEntry) {
    DarwinCoreExtension xml = null;
    try {
      var path = processEntry.getKey();
      xml = xmlReader.readExtensionFile(path);
    } catch (UnirestException | IOException e) {
      error(e);
    }
    var apiMap = OpenApiModelConstructor.constructApiModel(xml);
    customizers.stream().reduce(Function::andThen).orElse(Function.identity()).apply(apiMap);
    Logger.info(apiMap);
    var extensionName = processEntry.getValue();
    apiWriter.writeAsFile(apiMap, extensionName, targetPath);
  }

  private void start() {
    FILES_TO_PROCESS.entrySet().forEach(this::processXml);
  }

  public static void main(String... args) {
    new GenerateOpenApi("./server/src/main/resources/swaggerroot/spec").start();
  }
}
