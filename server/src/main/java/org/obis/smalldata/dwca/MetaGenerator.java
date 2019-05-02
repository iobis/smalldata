package org.obis.smalldata.dwca;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.fasterxml.jackson.dataformat.xml.ser.ToXmlGenerator;
import lombok.AllArgsConstructor;
import lombok.Value;
import org.obis.smalldata.dwca.xmlmodel.meta.Archive;
import org.obis.smalldata.dwca.xmlmodel.meta.Core;
import org.obis.smalldata.dwca.xmlmodel.meta.Extension;
import org.obis.smalldata.dwca.xmlmodel.meta.Field;
import org.obis.util.NamespaceMapper;
import org.pmw.tinylog.Logger;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;
import java.util.function.BiFunction;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

class MetaGenerator {

  private static final NamespaceMapper NS_MAPPER = NamespaceMapper.INSTANCE;

  static {
    NS_MAPPER.put("purl", "http://purl.org/dc/terms/");
    NS_MAPPER.put("tdwg", "http://rs.tdwg.org/dwc/terms/");
    NS_MAPPER.put("iobis", "http://rs.iobis.org/obis/terms/");
  }

  private final XmlMapper xmlMapper = new XmlMapper();

  MetaGenerator() {
    xmlMapper.configure(ToXmlGenerator.Feature.WRITE_XML_DECLARATION, false);
    xmlMapper.findAndRegisterModules().configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
    xmlMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
    xmlMapper.setDefaultUseWrapper(false);
  }

  Optional<File> generateXml(MetaFileConfig core, List<MetaFileConfig> extensions, Path directory) {
    try {
      var metaXml = new File(directory.toFile() + "/meta.xml");
      var extTables = extensions.stream()
        .map(this::extensionXml)
        .map(Optional::get)
        .collect(Collectors.toList());
      var archive = coreXml(core)
        .map(coreTable -> Archive.builder()
          .metadata("eml.xml")
          .core(coreTable)
          .extensionList(extTables)
          .build())
        .get();
      xmlMapper.writerWithDefaultPrettyPrinter().writeValue(metaXml, archive);
      return Optional.of(metaXml);
    } catch (IOException e) {
      Logger.error("Cannot create xml file");
      return Optional.empty();
    }
  }

  private Optional<Core> coreXml(MetaFileConfig metaConfig) {
    return dwcTableXml(
      metaConfig.getUri(),
      (fields, index) -> Core.builder()
        .rowType(metaConfig.getRowType())
        .location(metaConfig.getFiles())
        .fieldList(fields)
        .id(new Core.Id(index)).build());
  }

  private Optional<Extension> extensionXml(MetaFileConfig metaConfig) {
    return dwcTableXml(
      metaConfig.getUri(),
      (fields, index) -> Extension.builder()
        .rowType(metaConfig.getRowType())
        .location(metaConfig.getFiles())
        .fieldList(fields)
        .coreId(new Extension.CoreId(index))
        .build());
  }

  private <T> Optional<T> dwcTableXml(URI uri, BiFunction<List<Field>, Integer, T> builder) {
    try {
      var headers = Files.lines(Path.of(uri)).findFirst().get().split("\t");
      var fields = xmlFields(headers);
      var idField = findId(headers);

      return Optional.of(builder.apply(fields, idField));
    } catch (IOException e) {
      Logger.error("error reading csv file: {}", e.getMessage());
      return Optional.empty();
    }
  }

  private static int findId(String... headers) {
    return IntStream.range(0, headers.length)
      .filter(idx -> "id".equals(headers[idx]))
      .findFirst()
      .getAsInt();
  }

  private static List<Field> xmlFields(String... headers) {
    return IntStream.range(0, headers.length)
      .filter(idx -> headers[idx].split("\\.").length == 2)
      .mapToObj(idx -> Field.builder()
        .index(idx)
        .term(mapHeader(headers[idx]))
        .build())
      .collect(Collectors.toList());
  }

  private static String mapHeader(String header) {
    var headerParts = header.split("\\.");
    switch (headerParts.length) {
      case 2:
        return NS_MAPPER.getNs(headerParts[0]) + headerParts[1];
      case 1:
        return header;
      case 0:
      default:
        return "";
    }
  }

  @Value
  @AllArgsConstructor
  static class DwcTableConfig {
    private final String rowType;
    private final Integer index;
    private final List<Field> fieldList;
  }
}
