package org.obis.smalldata.webapi;

import io.vertx.core.json.JsonObject;
import io.vertx.ext.auth.PubSecKeyOptions;
import io.vertx.ext.auth.jwt.JWTAuth;
import io.vertx.ext.auth.jwt.JWTAuthOptions;
import io.vertx.ext.jwt.JWTOptions;
import io.vertx.ext.web.RoutingContext;

import static org.pmw.tinylog.Logger.info;

public class LoginHandler {

  public static void login(RoutingContext context) {
    JsonObject body = context.getBodyAsJson();
    JWTAuth provider = JWTAuth.create(context.vertx(), new JWTAuthOptions()
      .addPubSecKey(new PubSecKeyOptions()
        .setAlgorithm("ES256")
        .setPublicKey(
          "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEraVJ8CpkrwTPRCPluUDdwC6b8+m4\n" +
            "dEjwl8s+Sn0GULko+H95fsTREQ1A2soCFHS4wV3/23Nebq9omY3KuK9DKw==\n")
        .setSecretKey(
          "MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgeRyEfU1NSHPTCuC9\n" +
            "rwLZMukaWCH2Fk6q5w+XBYrKtLihRANCAAStpUnwKmSvBM9EI+W5QN3ALpvz6bh0\n" +
            "SPCXyz5KfQZQuSj4f3l+xNERDUDaygIUdLjBXf/bc15ur2iZjcq4r0Mr")
      ));
    if ("paulo".equals(body.getString("username"))
      && "secret".equals(body.getString("password"))) {
      var token = provider.generateToken(new JsonObject()
          .put("aud", "occurrences-OBIS")
          .put("sub", "paulo"),
        new JWTOptions().setAlgorithm("ES256"));
      context.response().end(new JsonObject()
        .put("token", token).encode());
    } else {
      context.fail(401);
    }
  }


/**
    if ("local".equals(config().getString("provider"))) {
      try {
        KeyPairGenerator g = KeyPairGenerator.getInstance("EC");
        ECGenParameterSpec spec = new ECGenParameterSpec("secp256r1");
        g.initialize(spec);
        KeyPair keyPair = g.generateKeyPair();
        info(new String(Base64.getEncoder().encode(keyPair.getPublic().getEncoded())));
        info(new String(Base64.getEncoder().encode(keyPair.getPrivate().getEncoded())));

        JWTAuth provider = JWTAuth.create(vertx, new JWTAuthOptions()
          .addPubSecKey(new PubSecKeyOptions()
            .setAlgorithm("ES256")
            .setPublicKey(
              "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEraVJ8CpkrwTPRCPluUDdwC6b8+m4\n" +
                "dEjwl8s+Sn0GULko+H95fsTREQ1A2soCFHS4wV3/23Nebq9omY3KuK9DKw==\n")
            .setSecretKey(
              "MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgeRyEfU1NSHPTCuC9\n" +
                "rwLZMukaWCH2Fk6q5w+XBYrKtLihRANCAAStpUnwKmSvBM9EI+W5QN3ALpvz6bh0\n" +
                "SPCXyz5KfQZQuSj4f3l+xNERDUDaygIUdLjBXf/bc15ur2iZjcq4r0Mr")
          ));

      } catch (NoSuchAlgorithmException e) {
        e.printStackTrace();
      } catch (InvalidAlgorithmParameterException e) {
        e.printStackTrace();
      }

      try {
        info(FileUtils.readFileToString(new File("./keys/public.pem")));
        info(FileUtils.readFileToString(new File("./keys/private_key.pem")).substring(1,50));
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
**/

  private LoginHandler() {}
}
