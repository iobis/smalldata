package org.obis.smalldata.util;

import com.google.common.base.Charsets;
import com.google.common.io.Resources;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class IoFile {

  public static String loadFromResources(String strPath) {
    var url = Resources.getResource(strPath);
    try {
      return Resources.toString(url, Charsets.UTF_8);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  public static void addToZipFile(Path path, ZipOutputStream zos) throws IOException {
    var file = path.toFile();

    FileInputStream fis = new FileInputStream(file);
		ZipEntry zipEntry = new ZipEntry(file.getName());
		zos.putNextEntry(zipEntry);

		byte[] bytes = new byte[1024];
		int length;
		while ((length = fis.read(bytes)) >= 0) {
			zos.write(bytes, 0, length);
		}

		zos.closeEntry();
		fis.close();
	}

  private IoFile() {
  }
}
