package org.obis.smalldata.dwca.csvmodel.eml;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import lombok.RequiredArgsConstructor;
import lombok.Value;

import java.beans.ConstructorProperties;

@Value
@RequiredArgsConstructor(
  onConstructor = @__({@ConstructorProperties({"id", "title", "language", "abstractParagraphs",
    "intellectualRights", "contacts", "creators", "metadataProviders", "keywordSets"})}))
@JsonIgnoreProperties(ignoreUnknown = true)
@JacksonXmlRootElement(localName = "dataset")
public class Dataset {
  @JsonProperty("_ref")
  @JacksonXmlProperty(isAttribute = true, localName = "id")
  private final String id;
  private final String title;
  private final String language;
  @JsonProperty("abstract")
  private final Abstract abstractParagraphs;
  @JsonProperty("license")
  @JacksonXmlProperty(localName = "intellectualRights")
  private final License intellectualRights;
  @JacksonXmlProperty(localName = "contact")
  private final PersonData[] contacts;
  @JacksonXmlProperty(localName = "creator")
  private final PersonData[] creators;
  @JacksonXmlProperty(localName = "metadataProvider")
  private final PersonData[] metadataProviders;
  @JacksonXmlProperty(localName = "keywordSet")
  private final KeywordSet[] keywordSets;

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
    private final String url;
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
    private final Name indidivualName;
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
