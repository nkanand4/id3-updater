package com.nitesh;

import static org.junit.Assert.*;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;

import org.cmc.music.common.ID3ReadException;
import org.cmc.music.metadata.MusicMetadata;
import org.cmc.music.metadata.MusicMetadataSet;
import org.cmc.music.myid3.MyID3;
import org.junit.Test;

public class ID3InfoTest {

	@Test
	public void test() {
		String file = "/tmp/Humma.mp3";
		String title = "Ek ho gaye hum aur tum";
		ID3Info me = new ID3Info();
		try {
			HashMap<String, String> info = new HashMap<String, String>();
			info.put("filepath", file);
			info.put("title", title);
			me.update(info);
			File src = new File(file);
			MusicMetadataSet src_set =  new MyID3().read(src);
			MusicMetadata metadata = (MusicMetadata) src_set.getSimplified();
			String nowTitle = metadata.getSongTitle();
			assertEquals("Update Success", title.toLowerCase(), nowTitle.toLowerCase());			
		} catch (ID3ReadException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
