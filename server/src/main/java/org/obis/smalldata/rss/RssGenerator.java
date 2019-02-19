package org.obis.smalldata.rss;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.fasterxml.jackson.dataformat.xml.ser.ToXmlGenerator;
import org.obis.smalldata.rss.model.RssFeed;

import java.net.MalformedURLException;

public class RssGenerator {

  private XmlMapper xmlMapper;
  private boolean prettyPrint;
  private boolean includeNull;

  public RssGenerator() {
    this(false);
  }

  public RssGenerator(boolean prettyPrint) {
    this.prettyPrint = prettyPrint;
    xmlMapper = new XmlMapper();
    xmlMapper.configure(ToXmlGenerator.Feature.WRITE_XML_DECLARATION, true);
    xmlMapper.findAndRegisterModules().configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
    //    xmlMapper.setSerializationInclusion(Include.NON_NULL);
    xmlMapper.setDefaultUseWrapper(false);
  }

  public String writeRssAsString() {
    try {
      String xml = xmlMapper.writerWithDefaultPrettyPrinter().writeValueAsString(new RssFeed());
      return xml;
    } catch (JsonProcessingException e) {
      e.printStackTrace();
      return "";
    } catch (MalformedURLException e) {
      e.printStackTrace();
      return "";
    }
  }
}
