package org.obis.smalldata.dwca;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.fasterxml.jackson.dataformat.xml.ser.ToXmlGenerator;
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
    NS_MAPPER.put("obis", "http://rs.iobis.org/obis/terms/");
  }

  private final XmlMapper xmlMapper = new XmlMapper();

  MetaGenerator() {
    xmlMapper.configure(ToXmlGenerator.Feature.WRITE_XML_DECLARATION, false);
    xmlMapper.findAndRegisterModules().configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
    xmlMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
    xmlMapper.setDefaultUseWrapper(false);
  }

  Optional<File> generateXml(URI core, List<URI> extensions) {
    try {
      var metaXml = File.createTempFile("obis-iode", "meta.xml");
      var coreTable = coreXml(core).get();
      var extTables = extensions.stream()
        .map(this::extensionXml)
        .map(Optional::get)
        .collect(Collectors.toList());

      var archive = Archive.builder()
        .core(coreTable)
        .extensionList(extTables)
        .build();

      var out = xmlMapper.writerWithDefaultPrettyPrinter().writeValueAsString(archive);
      Logger.info(out);

      return Optional.of(metaXml);
    } catch (IOException e) {
      Logger.error("Cannot create xml file");
      return Optional.empty();
    }
  }

  private String mapHeader(String header) {
    var headerParts = header.split("/");
    switch (headerParts.length) {
      case 2: return NS_MAPPER.getNs(headerParts[0]) + headerParts[1];
      case 1: return header;
      case 0:
      default:
        return "";
    }
  }

  private Optional<Core> coreXml(URI uri) throws IOException {
    return dwcTableXml(uri,
      (fields, idField) -> Core.builder().itemList(fields).id(new Core.Id(idField)).build());
  }

  private Optional<Extension> extensionXml(URI uri) {
    return dwcTableXml(uri,
      (fields, idField) -> Extension.builder().itemList(fields).coreId(new Extension.CoreId(idField)).build());
  }

  private <T> Optional<T> dwcTableXml(URI uri, BiFunction<List, Integer, T> builder) {
    try {
      var headers = Files.lines(Path.of(uri)).findFirst().get().split("\t");
      List<Field> fields = xmlFields(headers);
      int idField = idField(headers);

      return Optional.of(builder.apply(fields, idField));
    } catch (IOException e) {
      Logger.error("error reading csv file: {}", e.getMessage());
      return Optional.empty();
    }
  }

  private int idField(String... headers) {
    return IntStream.range(0, headers.length)
      .filter(idx -> "id".equals(headers[idx]))
      .findFirst()
      .getAsInt();
  }

  private List<Field> xmlFields(String... headers) {
    return IntStream.range(0, headers.length)
      .filter(idx -> headers[idx].split("/").length == 2)
      .mapToObj(idx -> Field.builder()
        .index(idx)
        .term(mapHeader(headers[idx]))
        .build())
      .collect(Collectors.toList());
  }
}
