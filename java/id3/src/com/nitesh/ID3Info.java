package com.nitesh;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;

import org.cmc.music.common.ID3ReadException;
import org.cmc.music.common.ID3WriteException;
import org.cmc.music.myid3.*;
import org.cmc.music.metadata.MusicMetadata;
import org.cmc.music.metadata.MusicMetadataSet;

public class ID3Info {
	
	public Utils util = new Utils();
	
	public void update(HashMap<String, String> info) {
		try {
			
			String filepath = info.get("filepath");
			int genre = util.getGenreCode(info.get("genre"));
			int year = info.get("year") == "" || info.get("year") == null ? 1900: Integer.parseInt(info.get("year"));
			String title = info.get("title");
			String artist = info.get("artist");
			String album = info.get("album");
			int track = info.get("track") == "" || info.get("track") == null ? 1 : Integer.parseInt(info.get("track"));
			String artwork = info.get("artwork");
			File src = new File(filepath);
			MusicMetadataSet src_set =  new MyID3().read(src);				
			MusicMetadata metadata = (MusicMetadata) src_set.getSimplified();
			if(title != null)
				metadata.setSongTitle(title);
			if(artist != null)
				metadata.setArtist(artist);
			if(album != null)
				metadata.setAlbum(album);
			metadata.setYear(year);
			metadata.setTrackNumberNumeric(track);
			if(genre > -1){
				metadata.setGenreID(genre);
			}
			//me.util.createArtwork(((ImageData)metadata.getPictures().get(0)).imageData);
			if(artwork != null)
				metadata.setPictures(util.getArtwork(artwork));
			new MyID3().update(src, src_set, metadata);
			System.out.println("Updated " + info.get("filepath") + " successfully.");
		}catch(FileNotFoundException e) {
			System.out.println("File not found at specified path: "+info.get("filepath"));
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			System.out.println("Unsupported encoding found.");
		} catch (ID3WriteException e) {
			// TODO Auto-generated catch block
			System.out.println("ID3 update unsuccessful.");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			System.out.println("ID3 update unsuccessful because of IO.");
		} catch (ID3ReadException e) {
			// TODO Auto-generated catch block
			System.out.println("ID3 reading failed.");
		}
	} 
	
	public static void main(String [] args) {
		if(args.length > 0) {
			if(args[0].equals("update")) {
				/*
				 * convention to follow
				 * array[0] = file path
				 * array[1] = title
				 * array[2] = artist
				 * array[3] = album
				 * array[4] = year
				 * array[5] = track
				 * array[6] = genre
				 * array[7] = picture
				 */
				ID3Info me = new ID3Info();
				String[] keys = {"filepath", "title", "artist",
						"album", "year", "track", "genre", "artwork"};
				HashMap<String, String> info = new HashMap<String, String>();
				for(int i = 0; i < keys.length; i++) {
					if(i < args.length-1) {
						info.put(keys[i], args[i+1]);
					}else {
						info.put(keys[i], "");
					}
				}
				me.update(info);
			}else if(args[0].equals("duration")) {
				new EvaluateMP3SPI().read(args[1]);
			}
		}else {
			System.out.println("Need at least one argument.");
		}
	}
}