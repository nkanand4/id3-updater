id3-updater
===========

nodejs application that updates the id3 information of mp3 files with the help of java myID3 library.
Download the app and execute the following command from the base directory of the application.
```js
npm install
```
The above command will resolve depenedencies. This will be required only to run once.
```js
node update-mp3-files.js /path/to/the/music/folder
```
The application searches for the mp3 files in the provided music folder.
Prerequisite:
Node 0.10.1 or higher
Java 6 or higher
