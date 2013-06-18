package com.nitesh;

import java.io.File;
import java.io.IOException;
import java.util.Map;

import javax.sound.sampled.AudioFileFormat;
import javax.sound.sampled.UnsupportedAudioFileException;

import javazoom.spi.mpeg.sampled.file.MpegAudioFileReader;


public class EvaluateMP3SPI {

	void read(String path) {
		File file = new File(path);
		MpegAudioFileReader reader = new MpegAudioFileReader();
		AudioFileFormat baseFileFormat;
		try {
			baseFileFormat = reader.getAudioFileFormat(file);
			Map<String, Object> properties = baseFileFormat.properties();
			Long duration = (Long) properties.get("duration");
			System.out.println(duration/(1000));
		} catch (UnsupportedAudioFileException e) {
			System.out.println(0);
		} catch (IOException e) {
			System.out.println(0);
		}
	}
	
	public static void main(String[] args) {
		if(args.length > 0) {
			new EvaluateMP3SPI().read(args[0]);
		}else {
			System.out.println(0);
		}
	}
}
