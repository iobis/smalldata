package org.obis.smalldata.rss;

import static org.pmw.tinylog.Logger.info;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import java.net.MalformedURLException;
import java.net.URL;
import java.time.Instant;
import java.util.List;
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



    vertx.eventBus().consumer("internal.rss", message ->
        dbOperation.withAggregatedDatasets(
            res -> {
              info(res);
              var itemList = res.result().getJsonObject("cursor").getJsonArray("firstBatch").stream()
                  .map(JsonObject.class::cast)
                  .map(dataset -> new String[] {dataset.getString("dataset_ref"),
                      dataset.getString("addedAtInstant", Instant.EPOCH.toString())})
                  .collect(Collectors.toList());
              try {
                var rssFeed = generateRssFeed(itemList);
                var file = rssGenerator.writeRssAsFile(rssFeed);
                message.reply(file.getAbsolutePath());
              } catch(IllegalArgumentException ex) {

              }
            })
    );
  }

  private RssFeed generateRssFeed(List<String[]> datasetList) throws IllegalArgumentException {
    try {
      return new RssFeed(
          Channel.builder()
              .title("title")
              .link(new URL("http://localhost"))
              .lastBuildDate(Instant.parse("2019-02-22T17:18:56.127701Z"))
              .atomLink(
                  Channel.AtomLink.builder()
                      .href(new URL("http://ipt.iobis.org/training/rss.do"))
                      .build())
              .description("some description")
              .itemList(datasetList
                  .stream()
                  .map(
                      item -> {
                        try {
                          return RssItem.builder()
                              .dwca(new URL("http://localhost/" + item[0]))
                              .pubDate(Instant.parse(item[1]))
                              .guid(
                                  RssItem.Guid.builder()
                                      .isPermaLink(false)
                                      .url(new URL("http://localhost/" + item[0]))
                                      .build())
                              .build();
                        } catch (MalformedURLException e) {
                          throw new RuntimeException(e);
                        }
                      })
                  .collect(Collectors.toList()))
              .language("nl-BE")
              .build());
    } catch (MalformedURLException e) {
      throw new IllegalArgumentException();
    }
  }
}
