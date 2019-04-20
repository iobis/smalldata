package org.obis.util.file;

import com.google.common.base.Charsets;
import com.google.common.io.Resources;

import java.io.IOException;

public class IoFile {

  public static String loadFromResources(String strPath) {
    var url = Resources.getResource(strPath);
    try {
      return Resources.toString(url, Charsets.UTF_8);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  private IoFile() {
  }
}
