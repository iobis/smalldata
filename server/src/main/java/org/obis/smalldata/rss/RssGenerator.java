package org.obis.smalldata.rss;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.fasterxml.jackson.dataformat.xml.ser.ToXmlGenerator;
import org.obis.smalldata.rss.model.RssFeed;
import org.pmw.tinylog.Logger;

import java.io.File;
import java.io.IOException;

public class RssGenerator {

  private final XmlMapper xmlMapper;

  public RssGenerator() {
    xmlMapper = new XmlMapper();
    xmlMapper.configure(ToXmlGenerator.Feature.WRITE_XML_DECLARATION, true);
    xmlMapper.findAndRegisterModules().configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
    xmlMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
    xmlMapper.setDefaultUseWrapper(false);
  }

  public String writeRssAsString(RssFeed rssFeed) {
    var xml = (String) null;
    try {
      xml = xmlMapper.writerWithDefaultPrettyPrinter().writeValueAsString(rssFeed);
    } catch (JsonProcessingException e) {
      Logger.error(e);
    }
    return xml;
  }

  public File writeRssAsFile(RssFeed rssFeed) {
    var xmlFile = (File) null;
    try {
      xmlFile = File.createTempFile("smalldata", "xml");
      xmlMapper.writerWithDefaultPrettyPrinter().writeValue(xmlFile, rssFeed);
    } catch (IOException e) {
      Logger.error(e);
    }
    return xmlFile;
  }
}
