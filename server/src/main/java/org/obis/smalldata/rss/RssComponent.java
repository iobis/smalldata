package org.obis.smalldata.rss;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.buffer.Buffer;
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
import org.pmw.tinylog.Logger;

public class RssComponent extends AbstractVerticle {

  @Override
  public void start() {

    var dbConfig = (JsonObject) vertx.sharedData().getLocalMap("settings").get("storage");
    var mongoClient = MongoClient.createShared(vertx, dbConfig);
    var dbOperation = new DbDwcaOperation(mongoClient);

    try {
      new RssFeed(
              Channel.builder()
                  .title("title")
                  .link(new URL("http://localhost"))
                  .lastBuildDate(Instant.parse("2019-02-22T17:18:56.127701Z"))
                  .atomLink(
                      Channel.AtomLink.builder()
                          .href(new URL("http://ipt.iobis.org/training/rss.do"))
                          .build())
                  .description("some description")
                  .itemList(
                      List.of(
                              new String[] {
                                "http://ipt.iobis.org/training/resource/daily",
                                "2019-02-22T17:18:56.127535Z"
                              },
                              new String[] {
                                "http://ipt.iobis.org/training/resource?id=test-kurt2/v1.0",
                                "2019-02-22T17:18:56.127666Z"
                              })
                          .stream()
                          .map(
                              item -> {
                                try {
                                  return RssItem.builder()
                                      .dwca(new URL(item[0]))
                                      .pubDate(Instant.parse(item[1]))
                                      .guid(
                                          RssItem.Guid.builder()
                                              .isPermaLink(false)
                                              .url(new URL(item[0]))
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
      e.printStackTrace();
    }

    vertx.eventBus().consumer("internal.rss", message ->
        dbOperation.withAggregatedDatasets(
            res -> {
              Logger.info(res);
              vertx.fileSystem().createTempFile("rss_", "", file ->
                  vertx.fileSystem().writeFile(file.result(),
                      Buffer.buffer("some text"),
                      written -> message.reply(file.result())
                  )
              );
            })
    );
  }
}
