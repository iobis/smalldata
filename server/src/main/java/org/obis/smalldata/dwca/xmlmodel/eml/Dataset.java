package org.obis.smalldata.dwca.xmlmodel.eml;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlText;
import lombok.RequiredArgsConstructor;
import lombok.Value;

import java.beans.ConstructorProperties;

@SuppressWarnings("PMD.AvoidDuplicateLiterals")
@Value
@RequiredArgsConstructor(
  onConstructor = @__({@ConstructorProperties({"id", "title", "creators", "metadataProviders", "pubDate",
    "language", "abstractParagraphs", "keywordSets", "intellectualRights", "contacts"})}))
@JsonIgnoreProperties(ignoreUnknown = true)
@JacksonXmlRootElement(localName = "dataset")
public class Dataset {
  @JsonProperty("_ref")
  @JacksonXmlProperty(isAttribute = true, localName = "id")
  private final String id;
  @JacksonXmlProperty(localName = "title")
  private final Title title;
  @JacksonXmlProperty(localName = "creator")
  private final PersonData[] creators;
  @JacksonXmlProperty(localName = "metadataProvider")
  private final PersonData[] metadataProviders;
  @JacksonXmlProperty(localName = "pubDate")
  private final String pubDate;
  @JacksonXmlProperty(localName = "language")
  private final String language;
  @JsonProperty("abstract")
  private final Abstract abstractParagraphs;
  @JacksonXmlProperty(localName = "keywordSet")
  private final KeywordSet[] keywordSets;
  @JsonProperty("license")
  @JacksonXmlProperty(localName = "intellectualRights")
  private final License intellectualRights;
  @JacksonXmlProperty(localName = "contact")
  private final PersonData[] contacts;

  @Value
  @RequiredArgsConstructor(
    onConstructor = @__({@ConstructorProperties({"language", "value"})}))
  static class Title {
    @JacksonXmlProperty(isAttribute = true, localName = "xml:lang")
    private String language;
    @JacksonXmlText
    private String value;
  }

  @Value
  @RequiredArgsConstructor(
    onConstructor = @__({@ConstructorProperties({"paragraphs"})}))
  static class Abstract {
    @JsonProperty
    @JacksonXmlProperty(localName = "para")
    private final String[] paragraphs;
  }

  @Value
  @RequiredArgsConstructor(
    onConstructor = @__({@ConstructorProperties({"url", "title"})}))
  @JsonIgnoreProperties(value = {"url", "title"}, allowSetters = true)
  static class License {
    @JsonProperty
    private final String url;
    @JsonProperty
    private final String title;

    @JsonRawValue
    @JacksonXmlProperty
    String getPara() {
      return "This work is licensed under a <ulink url=\""
        + url + "\"><citetitle>" + title + "</citetitle></ulink>.";
    }
  }

  @Value
  @RequiredArgsConstructor(
    onConstructor = @__({@ConstructorProperties({"individualName", "organizationName", "electronicMailAddress",
      "address"})}))
  static class PersonData {
    private final Name individualName;
    private final String organizationName;
    private final String electronicMailAddress;
    private final Address address;

    @Value
    @RequiredArgsConstructor(
      onConstructor = @__({@ConstructorProperties({"givenName", "surName"})}))
    static class Name {
      private final String givenName;
      private final String surName;
    }

    @Value
    @RequiredArgsConstructor(
      onConstructor = @__({@ConstructorProperties({"country"})}))
    static class Address {
      private final String country;
    }
  }

  @Value
  @RequiredArgsConstructor(
    onConstructor = @__({@ConstructorProperties({"keywords", "keywordThesaurus"})}))
  static class KeywordSet {
    @JacksonXmlProperty(localName = "keyword")
    private final String[] keywords;
    private final String keywordThesaurus;


  }
}
