package com.nitesh;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.UnsupportedEncodingException;

import org.cmc.music.common.ID3ReadException;
import org.cmc.music.common.ID3WriteException;
import org.cmc.music.myid3.*;
import org.cmc.music.metadata.MusicMetadata;
import org.cmc.music.metadata.MusicMetadataSet;

public class ID3Info {
	
	public Utils util = new Utils();
	
	public static void main(String [] args) {
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
		try {
			File src = new File(args[0]);
			MusicMetadataSet src_set =  new MyID3().read(src);
			MusicMetadata metadata = (MusicMetadata) src_set.getSimplified();
			metadata.setSongTitle(args[1]);
			metadata.setArtist(args[2]);
			metadata.setAlbum(args[3]);
			metadata.setYear(Integer.parseInt(args[4]));
			metadata.setTrackNumberNumeric(Integer.parseInt(args[5]));
			metadata.setGenreID(me.util.getGenreCode(args[6]));
			metadata.setPictures(me.util.getArtwork(args[7]));

			//me.util.createArtwork(((ImageData)metadata.getPictures().get(0)).imageData);  

			new MyID3().update(src, src_set, metadata);
			System.out.println("Updated " + args[0] + " successfully.");
		}catch(FileNotFoundException e) {
			System.out.println("File not found.");
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
}