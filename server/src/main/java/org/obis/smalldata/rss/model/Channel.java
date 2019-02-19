package org.obis.smalldata.rss.model;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

import java.net.URL;
import java.time.Instant;
import java.util.List;

public class Channel {

  @JacksonXmlProperty
  private String title;
  @JacksonXmlProperty
  private URL link;
  @JacksonXmlProperty(localName = "atom:link")
  private AtomLink atomLink = new AtomLink();
  @JacksonXmlProperty
  private String description;
  @JacksonXmlProperty
  private String language = "en-US";
  @JacksonXmlProperty
  private Instant lastBuildDate = Instant.now();
  @JacksonXmlProperty
  private String generator = "SmallData r...";
  @JacksonXmlProperty
  private URL docs;
  @JacksonXmlProperty(localName = "item")
  private List<RssItem> itemList;

  private Channel(Builder builder) {
    title = builder.title;
    link = builder.link;
    atomLink = builder.atomLink;
    description = builder.description;
    itemList = builder.itemList;
    language = builder.language;
    lastBuildDate = builder.lastBuildDate;
    generator = builder.generator;
    docs = builder.docs;
  }

  public static ITitle builder() {
    return new Builder();
  }

  interface IBuild {
    IBuild withLanguage(String val);

    IBuild withLastBuildDate(Instant val);

    IBuild withGenerator(String val);

    IBuild withDocs(URL val);

    Channel build();
  }

  interface IItemList {
    IBuild withItemList(List<RssItem> val);
  }

  interface IDescription {
    IItemList withDescription(String val);
  }

  interface IAtomLink {
    IDescription withAtomLink(AtomLink val);
  }

  interface ILink {
    IAtomLink withLink(URL val);
  }

  interface ITitle {
    ILink withTitle(String val);
  }

  static class AtomLink {
    @JacksonXmlProperty(isAttribute = true)
    private String rel = "self";
    @JacksonXmlProperty(isAttribute = true)
    private String type = "application/rss+xml";
    @JacksonXmlProperty(isAttribute = true)
    private String href = "http://ipt.iobis.org/training/rss.do";
  }

  public static final class Builder implements IItemList, IDescription, IAtomLink, ILink, ITitle, IBuild {
    private String language;
    private Instant lastBuildDate;
    private String generator;
    private URL docs;
    private List<RssItem> itemList;
    private String description;
    private AtomLink atomLink;
    private URL link;
    private String title;

    private Builder() {
    }

    @Override
    public IBuild withItemList(List<RssItem> val) {
      itemList = val;
      return this;
    }

    @Override
    public IItemList withDescription(String val) {
      description = val;
      return this;
    }

    @Override
    public IDescription withAtomLink(AtomLink val) {
      atomLink = val;
      return this;
    }

    @Override
    public IAtomLink withLink(URL val) {
      link = val;
      return this;
    }

    @Override
    public ILink withTitle(String val) {
      title = val;
      return this;
    }

    @Override
    public IBuild withLanguage(String val) {
      language = val;
      return this;
    }

    @Override
    public IBuild withLastBuildDate(Instant val) {
      lastBuildDate = val;
      return this;
    }

    @Override
    public IBuild withGenerator(String val) {
      generator = val;
      return this;
    }

    @Override
    public IBuild withDocs(URL val) {
      docs = val;
      return this;
    }

    public Channel build() {
      return new Channel(this);
    }
  }
}
