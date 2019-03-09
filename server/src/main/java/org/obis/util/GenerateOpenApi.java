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

import static java.util.Map.entry;

public class GenerateOpenApi {
  private DarwinCoreExtensionReader xmlReader = new DarwinCoreExtensionReader();
  private OpenApiModelConstructor apiConstructor = new OpenApiModelConstructor();
  private OpenApiWriter apiWriter = new OpenApiWriter();
  private List<Function<Map<String, Map<String, Object>>, Map<String, Map<String, Object>>>> customizers =
    List.of(new TypeMapper(),
      new CustomFieldMerger());

  private NamespaceMapper nsMapper = NamespaceMapper.INSTANCE;
  private final String targetPath;
  private final Map<String, String> filesToProcess = Map.ofEntries(
    entry("http://rs.gbif.org/core/dwc_occurrence_2015-07-02.xml", "Occurrence"),
    entry("http://rs.gbif.org/core/dwc_taxon_2015-04-24.xml", "Taxon"),
    entry("http://rs.gbif.org/core/dwc_event_2016_06_21.xml", "Event")
  );

  GenerateOpenApi(String targetPath) {
    this.targetPath = targetPath;
    nsMapper.put("purl", "http://purl.org/dc/terms/");
    nsMapper.put("dwcg", "http://rs.tdwg.org/dwc/terms/");
    nsMapper.put("obis", "http://rs.iobis.org/obis/terms/");
  }

  private void processXml(Map.Entry<String, String> processEntry) {
    DarwinCoreExtension xml = null;
    try {
      var path = processEntry.getKey();
      xml = xmlReader.readExtensionFile(path);
    } catch (UnirestException e) {
      e.printStackTrace();
    } catch (IOException e) {
      e.printStackTrace();
    }
    var apiMap = apiConstructor.constructApiModel(xml);
    customizers.stream().reduce(Function::andThen).orElse(Function.identity()).apply(apiMap);
    Logger.info(apiMap);
    var extensionName = processEntry.getValue();
    apiWriter.writeAsFile(apiMap, extensionName, targetPath);
  }

  private void start() {
    filesToProcess.entrySet().forEach(this::processXml);
  }

  public static void main(String... args) {
    new GenerateOpenApi("./server/src/main/resources/swaggerroot/spec").start();
  }
}
