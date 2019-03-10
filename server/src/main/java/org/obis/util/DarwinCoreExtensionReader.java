package org.obis.util;

import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.obis.util.model.DarwinCoreExtension;

import java.io.IOException;

public class DarwinCoreExtensionReader {

  private final XmlMapper xmlMapper = new XmlMapper();

  DarwinCoreExtension readExtensionFile(String path) throws UnirestException, IOException {
    String xmlString = Unirest.get(path)
      .asString()
      .getBody();
    return xmlMapper.readValue(xmlString, DarwinCoreExtension.class);
  }
}
