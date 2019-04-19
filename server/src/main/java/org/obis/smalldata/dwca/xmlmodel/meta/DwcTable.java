package org.obis.smalldata.dwca.xmlmodel.meta;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

@SuppressWarnings({"PMD.UnusedPrivateField", "PMD.FinalFieldCouldBeStatic"})
public class DwcTable {

  @JacksonXmlProperty(isAttribute = true)
  private final String encoding = "UTF-8";

  @JacksonXmlProperty(isAttribute = true)
  private final String fieldsTerminatedBy = "\\t";

  @JacksonXmlProperty(isAttribute = true)
  private final String linesTerminatedBy = "\\n";

  @JacksonXmlProperty(isAttribute = true)
  private final String fieldsEnclosedBy = "";

  @JacksonXmlProperty(isAttribute = true)
  private final Integer ignoreHeaderLines = 1;
}
