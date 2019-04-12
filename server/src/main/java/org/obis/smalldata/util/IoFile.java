package org.obis.smalldata.util;

import com.google.common.base.Charsets;
import com.google.common.io.Resources;

import java.io.IOException;
import java.net.URL;

public class IoFile {

  public static String loadFromResources(String strPath) {
    URL url = Resources.getResource(strPath);
    try {
      return Resources.toString(url, Charsets.UTF_8);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  private IoFile() {
  }
}
