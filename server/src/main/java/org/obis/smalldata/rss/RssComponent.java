package org.obis.smalldata.rss;

import static java.util.Map.entry;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import org.obis.smalldata.rss.xmlmodel.Channel;
import org.obis.smalldata.rss.xmlmodel.RssFeed;
import org.obis.smalldata.rss.xmlmodel.RssItem;

public class RssComponent extends AbstractVerticle {

  @Override
  public void start() {

    var dbConfig = (JsonObject) vertx.sharedData().getLocalMap("settings").get("storage");
    var mongoClient = MongoClient.createShared(vertx, dbConfig);
    var dbOperation = new DbDwcaOperation(mongoClient);
    var rssGenerator = new RssGenerator();
    var filterPeriodicityMap =
        Map.<String, Supplier<Instant>>ofEntries(
            entry("hourly", () -> Instant.now().minus(1, ChronoUnit.HOURS)),
            entry("daily", () -> Instant.now().minus(1, ChronoUnit.DAYS)),
            entry(
                "weekly",
                () ->
                    LocalDateTime.ofInstant(Instant.now(), ZoneOffset.UTC)
                        .minus(1, ChronoUnit.WEEKS)
                        .toInstant(ZoneOffset.UTC)),
            entry(
                "monthly",
                () ->
                    LocalDateTime.ofInstant(Instant.now(), ZoneOffset.UTC)
                        .minus(1, ChronoUnit.MONTHS)
                        .toInstant(ZoneOffset.UTC)),
            entry(
                "yearly",
                () ->
                    LocalDateTime.ofInstant(Instant.now(), ZoneOffset.UTC)
                        .minus(1, ChronoUnit.YEARS)
                        .toInstant(ZoneOffset.UTC)),
            entry("all", () -> Instant.MIN));

    vertx
        .eventBus()
        .<JsonObject>consumer(
            "internal.rss",
            message ->
                dbOperation.withAggregatedDatasets(
                    res -> {
                      var filterFrom =
                          filterPeriodicityMap.get(message.body().getString("periodicity")).get();
                      var datasets =
                          res.result()
                              .getJsonObject("cursor")
                              .getJsonArray("firstBatch")
                              .stream()
                              .map(JsonObject.class::cast)
                              .map(
                                  dataset ->
                                      new String[] {
                                        dataset.getString("dataset_ref"),
                                        dataset.getString(
                                            "addedAtInstant", Instant.EPOCH.toString())
                                      })
                              .filter(dataset -> Instant.parse(dataset[1]).isAfter(filterFrom))
                              .collect(Collectors.toList());
                      var baseUrl = message.body().getString("baseUrl");
                      var atomLink = message.body().getString("atomLink");
                      try {
                        var rssFeed =
                            generateRssFeed(
                                datasets, baseUrl, atomLink, config().getJsonObject("channel"));
                        var file = rssGenerator.writeRssAsFile(rssFeed);
                        message.reply(file.getAbsolutePath());
                      } catch (IOException ex) {
                        message.fail(500, "Could nor read datasets" + ex.getMessage());
                      }
                    }));
  }

  private RssFeed generateRssFeed(
      List<String[]> datasetList, String baseUrl, String atomLink, JsonObject channelinfo)
      throws IOException {

    return new RssFeed(
        Channel.builder()
            .title(channelinfo.getString("title"))
            .link(new URL(baseUrl))
            .lastBuildDate(Instant.now())
            .atomLink(Channel.AtomLink.builder().href(new URL(atomLink)).build())
            .description(channelinfo.getString("description"))
            .itemList(
                datasetList
                    .stream()
                    .map(
                        item -> {
                          try {
                            return RssItem.builder()
                                .dwca(new URL(baseUrl + "/api/dwca/" + item[0]))
                                .pubDate(Instant.parse(item[1]))
                                .guid(
                                    RssItem.Guid.builder()
                                        .isPermaLink(false)
                                        .url(new URL(baseUrl + "/api/datasets/" + item[0]))
                                        .build())
                                .build();
                          } catch (MalformedURLException e) {
                            throw new RuntimeException(e);
                          }
                        })
                    .collect(Collectors.toList()))
            .language("nl-BE")
            .build());
  }
}
