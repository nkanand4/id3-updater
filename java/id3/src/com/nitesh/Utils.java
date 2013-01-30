package com.nitesh;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Vector;

import org.cmc.music.metadata.ImageData;

public class Utils {
	private ArrayList<String> genreList = new ArrayList<String>(Arrays.asList(
			"Blues","Classic Rock","Country","Dance","Disco","Funk","Grunge","Hip-Hop",
			"Jazz","Metal","New Age","Oldies","Other","Pop","R&B","Rap","Reggae","Rock",
			"Techno","Industrial","Alternative","Ska","Death Metal","Pranks","Soundtrack",
			"Euro-Techno","Ambient","Trip-Hop","Vocal","Jazz+Funk","Fusion","Trance",
			"Classical","Instrumental","Acid","House","Game","Sound Clip","Gospel","Noise",
			"Alt. Rock","Bass","Soul","Punk","Space","Meditative","Instrumental Pop",
			"Instrumental Rock","Ethnic","Gothic","Darkwave","Techno-Industrial",
			"Electronic","Pop-Folk","Eurodance","Dream","Southern Rock","Comedy","Cult",
			"Gangsta Rap","Top 40","Christian Rap","Pop/Funk","Jungle","Native American",
			"Cabaret","New Wave","Psychedelic","Rave","Showtunes","Trailer","Lo-Fi","Tribal",
			"Acid Punk","Acid Jazz","Polka","Retro","Musical","Rock & Roll","Hard Rock",
			"Folk","Folk/Rock","National Folk","Swing","Fast-Fusion","Bebob","Latin","Revival",
			"Celtic","Bluegrass","Avantgarde","Gothic Rock","Progressive Rock","Psychedelic Rock",
			"Symphonic Rock","Slow Rock","Big Band","Chorus","Easy Listening","Acoustic","Humour",
			"Speech","Chanson","Opera","Chamber Music","Sonata","Symphony","Booty Bass","Primus",
			"Porn Groove","Satire","Slow Jam","Club","Tango","Samba","Folklore",
			"Ballad","Power Ballad","Rhythmic Soul","Freestyle","Duet","Punk Rock","Drum Solo",
			"A Cappella","Euro-House","Dance Hall","Goa","Drum & Bass","Club-House",
			"Hardcore","Terror","Indie","BritPop","Negerpunk","Polsk Punk","Beat",
			"Christian Gangsta Rap","Heavy Metal","Black Metal","Crossover","Contemporary Christian",
			"Christian Rock","Merengue","Salsa","Thrash Metal","Anime","JPop","Synthpop"));
	
	public int getGenreCode(String genre) {
		return this.genreList.indexOf(genre);
	}
	
	public Vector<Object> getArtwork(String filePath) {
		Vector<Object> artwork = new Vector<Object>();
		try {
			File file = new File(filePath);
			FileInputStream fin = new FileInputStream(file);
			byte fileContent[] = new byte[(int)file.length()];
			fin.read(fileContent);
			ImageData aw = new ImageData(fileContent, "image/jpg", "Artwork", 0);
			artwork.add(aw);
		} catch(FileNotFoundException e) {
			System.out.println("File not found.");
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			System.out.println("Unsupported encoding found.");
		}catch (IOException e) {
			// TODO Auto-generated catch block
			System.out.println("ID3 update unsuccessful because of IO.");
		}
		return artwork;
	}
	
	public void createArtwork(byte[] artwork) {
		try{
			  // Create file 
			FileOutputStream fos = new FileOutputStream("/Users/nanand1/Developer/my-dev-arena/id3-updater/abc.jpg");
			fos.write(artwork);

		  //Close the output stream
			fos.close();
		  }catch (Exception e){//Catch exception if any
			  System.err.println("Error: " + e.getMessage());
		  }
	}

}
