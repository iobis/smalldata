package org.obis.smalldata.dwca.xmlmodel.eml;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
@JacksonXmlRootElement(localName = "eml:eml")
@SuppressWarnings("PMD.FinalFieldCouldBeStatic")
public class Eml {

  @JacksonXmlProperty(localName = "xmlns:eml", isAttribute = true)
  @Builder.Default
  private final String xmlnsEml = "eml://ecoinformatics.org/eml-2.1.1";

  @JacksonXmlProperty(localName = "xmlns:dc", isAttribute = true)
  @Builder.Default
  private final String xmlnsDc = "http://purl.org/dc/terms/";

  @JacksonXmlProperty(localName = "xmlns:xsi", isAttribute = true)
  @Builder.Default
  private final String xmlnsXsi = "http://www.w3.org/2001/XMLSchema-instance";

  @JacksonXmlProperty(localName = "xsi:schemaLocation", isAttribute = true)
  @Builder.Default
  private final String xsiSchemaLocation = "eml://ecoinformatics.org/eml-2.1.1 http://rs.gbif.org/schema/eml-gbif-profile/1.1/eml.xsd";

  @JacksonXmlProperty(localName = "packageId", isAttribute = true)
  @Builder.Default
  private final String packageId = "http://ipt.vliz.be/eurobis/resource?id=benthic_data_sevastopol/v1.1";

  @JacksonXmlProperty(localName = "system", isAttribute = true)
  @Builder.Default
  private final String system = "http://gbif.org";

  @JacksonXmlProperty(localName = "scope", isAttribute = true)
  @Builder.Default
  private final String scope = "system";

  @JacksonXmlProperty(localName = "xml:lang", isAttribute = true)
  @Builder.Default
  private final String lang = "en";

  private final Dataset dataset;
}
