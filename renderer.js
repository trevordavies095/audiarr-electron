let currentAlbum = null;
let currentTrackList = [];
let currentTrackIndex = 0;

function switchTab(tabId) {
    document.querySelectorAll('.tab').forEach(tab => {
      tab.classList.remove('active');
    });
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
      selectedTab.classList.add('active');
      // Optionally load data for specific tabs if necessary
      if (tabId === 'artists') {
        loadArtists();
      } else if (tabId === 'albums') {
        loadAlbums();
      } else if (tabId === 'tracks') {
        loadTracks();
      }
    }
  }  

function backToAlbums() {
    switchTab('albums');
  }

// Example functions for fetching data from audiarr-server REST APIs
// Replace the API endpoint URLs with those specified in your Swagger documentation

function loadArtists() {
    fetch('http://192.168.4.205:5279/api/library/artists')
      .then(response => response.json())
      .then(data => {
        const container = document.getElementById('artists-content');
        container.innerHTML = '';
  
        data.forEach(artist => {
          // Create the artist card container
          const artistCard = document.createElement('div');
          artistCard.classList.add('artist-card');
  
          // Create the artist image element or a placeholder if missing
          if (artist.coverArtUrl && artist.coverArtUrl.trim() !== '') {
            const artistImage = document.createElement('img');
            // If the URL is relative, prepend your API base URL (adjust as needed)
            artistImage.src = artist.coverArtUrl.startsWith('http')
              ? artist.coverArtUrl
              : `http://192.168.4.205:5279${artist.coverArtUrl}`;
            artistImage.alt = `${artist.name} image`;
            artistImage.classList.add('artist-image');
            artistCard.appendChild(artistImage);
          } else {
            const placeholder = document.createElement('div');
            placeholder.classList.add('artist-image-placeholder');
            placeholder.textContent = "No Image";
            artistCard.appendChild(placeholder);
          }
  
          // Create a container for artist info
          const infoDiv = document.createElement('div');
          infoDiv.classList.add('artist-info');
  
          // Artist name
          const artistNameEl = document.createElement('h2');
          artistNameEl.textContent = artist.name;
          infoDiv.appendChild(artistNameEl);
  
          // Optionally, display additional details (like album count)
          if (artist.albumCount !== undefined) {
            const albumCountEl = document.createElement('p');
            albumCountEl.textContent = `Albums: ${artist.albumCount}`;
            infoDiv.appendChild(albumCountEl);
          }
  
          artistCard.appendChild(infoDiv);
          container.appendChild(artistCard);
        });
      })
      .catch(err => console.error('Error fetching artists:', err));
  }
  

  function loadAlbums() {
    fetch('http://192.168.4.205:5279/api/library/albums')
      .then(response => response.json())
      .then(data => {
        const container = document.getElementById('albums-content');
        container.innerHTML = '';
  
        data.forEach(album => {
            // Create the album card container
            const albumCard = document.createElement('div');
            albumCard.classList.add('album-card');
            // Assign a unique id to the album card
            albumCard.id = `album-card-${album.albumId}`;
          
            // When an album card is clicked, load album details
            albumCard.addEventListener('click', () => {
              loadAlbumDetail(album.albumId);
              // Save the album id globally so we know which one was selected
              window.lastSelectedAlbumId = album.albumId;
            });
  
          // Album cover image or placeholder
          if (album.coverArtUrl && album.coverArtUrl.trim() !== '') {
            const albumImage = document.createElement('img');
            albumImage.src = album.coverArtUrl.startsWith('http')
              ? album.coverArtUrl
              : `http://192.168.4.205:5279${album.coverArtUrl}`;
            albumImage.alt = `${album.albumName} cover art`;
            albumImage.classList.add('album-cover');
            albumCard.appendChild(albumImage);
          } else {
            const placeholder = document.createElement('div');
            placeholder.classList.add('album-cover-placeholder');
            placeholder.textContent = "No Cover";
            albumCard.appendChild(placeholder);
          }
  
          // Album info container
          const infoDiv = document.createElement('div');
          infoDiv.classList.add('album-info');
  
          // Album name
          const albumNameEl = document.createElement('h2');
          albumNameEl.textContent = album.albumName;
          infoDiv.appendChild(albumNameEl);
  
          // Artist name
          const albumArtistEl = document.createElement('p');
          albumArtistEl.textContent = `Artist: ${album.albumArtist}`;
          infoDiv.appendChild(albumArtistEl);
  
          // Release year
          const releaseYearEl = document.createElement('p');
          releaseYearEl.textContent = `Released: ${album.releaseYear}`;
          infoDiv.appendChild(releaseYearEl);
  
          // Genre and track count
          const genreEl = document.createElement('p');
          genreEl.textContent = `Genre: ${album.genre} | Tracks: ${album.trackCount}`;
          infoDiv.appendChild(genreEl);
  
          albumCard.appendChild(infoDiv);
          container.appendChild(albumCard);
        });
      })
      .catch(err => console.error('Error fetching albums:', err));
  }

  function loadAlbumDetail(albumId) {
    fetch(`http://192.168.4.205:5279/api/library/tracks?albumId=${albumId}`)
      .then(response => response.json())
      .then(data => {
        const container = document.getElementById('album-detail-content');
        container.innerHTML = '';
  
        // Build the album header with cover art and info
        const album = data.album;
        const albumHeader = document.createElement('div');
        albumHeader.classList.add('album-header');
  
        // Album cover (or placeholder)
        if (album.coverArtUrl && album.coverArtUrl.trim() !== '') {
          const albumImage = document.createElement('img');
          albumImage.src = album.coverArtUrl.startsWith('http')
            ? album.coverArtUrl
            : `http://192.168.4.205:5279${album.coverArtUrl}`;
          albumImage.alt = `${album.albumName} cover art`;
          albumImage.classList.add('album-cover-detail');
          albumHeader.appendChild(albumImage);
        } else {
          const placeholder = document.createElement('div');
          placeholder.classList.add('album-cover-placeholder');
          placeholder.textContent = "No Cover";
          albumHeader.appendChild(placeholder);
        }
  
        // Album information
        const infoDiv = document.createElement('div');
        infoDiv.classList.add('album-info-detail');
  
        const albumTitleEl = document.createElement('h2');
        albumTitleEl.textContent = album.albumName;
        infoDiv.appendChild(albumTitleEl);
  
        const albumArtistEl = document.createElement('p');
        albumArtistEl.textContent = `Artist: ${album.albumArtist}`;
        infoDiv.appendChild(albumArtistEl);
  
        const releaseYearEl = document.createElement('p');
        releaseYearEl.textContent = `Released: ${album.releaseYear}`;
        infoDiv.appendChild(releaseYearEl);
  
        const genreEl = document.createElement('p');
        genreEl.textContent = `Genre: ${album.genre} | Tracks: ${album.trackCount}`;
        infoDiv.appendChild(genreEl);
  
        albumHeader.appendChild(infoDiv);
        container.appendChild(albumHeader);
  
        // Build the track listing
        const trackList = document.createElement('div');
        trackList.classList.add('track-list');
  
        data.tracks.forEach((track, index) => {
            const trackEl = document.createElement('div');
            trackEl.classList.add('track-item');
            trackEl.textContent = `${track.trackNumber}. ${track.trackTitle} (${track.duration})`;
            // When a track is clicked, launch the track player view
            trackEl.addEventListener('click', () => {
              // Save the current album and track list globally
              currentAlbum = data.album;
              currentTrackList = data.tracks;
              currentTrackIndex = index;
              loadTrackPlayer(currentTrackIndex);
            });
            trackList.appendChild(trackEl);
          });
  
        container.appendChild(trackList);
  
        // Switch to the album detail view
        switchTab('album-detail');
      })
      .catch(err => console.error('Error loading album detail:', err));
  }

  function loadArtistDetail(artistId) {
    fetch(`http://192.168.4.205:5279/api/library/albums?artistId=${artistId}`)
      .then(response => response.json())
      .then(data => {
        console.log("Artist detail response:", data);
        
        // Our API returns an array of album objects.
        let albums = [];
        if (Array.isArray(data)) {
          albums = data;
        } else if (data.albums) {
          albums = data.albums;
        }
  
        // If there are albums, get the artist name from the first album.
        let artistName = "Unknown Artist";
        if (albums.length > 0 && albums[0].albumArtist) {
          artistName = albums[0].albumArtist;
        }
        
        // Since the API response doesn't provide an artist picture, we'll use an empty string (and later a placeholder)
        const artistPictureUrl = "";
  
        const container = document.getElementById('artist-detail-content');
        container.innerHTML = '';
  
        // Create the artist header section
        const artistHeader = document.createElement('div');
        artistHeader.classList.add('artist-header');
  
        // Artist picture (or placeholder)
        if (artistPictureUrl && artistPictureUrl.trim() !== '') {
          const artistImage = document.createElement('img');
          artistImage.src = artistPictureUrl.startsWith('http')
            ? artistPictureUrl
            : `http://192.168.4.205:5279${artistPictureUrl}`;
          artistImage.alt = `${artistName} picture`;
          artistImage.classList.add('artist-picture');
          artistHeader.appendChild(artistImage);
        } else {
          const placeholder = document.createElement('div');
          placeholder.classList.add('artist-picture-placeholder');
          placeholder.textContent = "No Picture";
          artistHeader.appendChild(placeholder);
        }
  
        // Artist information: name, etc.
        const infoDiv = document.createElement('div');
        infoDiv.classList.add('artist-info-detail');
        const artistNameEl = document.createElement('h2');
        artistNameEl.textContent = artistName;
        infoDiv.appendChild(artistNameEl);
        artistHeader.appendChild(infoDiv);
  
        container.appendChild(artistHeader);
  
        // Add Albums header
        const albumsHeader = document.createElement('h3');
        albumsHeader.textContent = 'Albums';
        container.appendChild(albumsHeader);
  
        // Create a container to list the albums
        const albumList = document.createElement('div');
        albumList.classList.add('artist-album-list');
  
        if (albums.length > 0) {
          albums.forEach(album => {
            const albumCard = document.createElement('div');
            albumCard.classList.add('artist-album-card');
            albumCard.style.cursor = 'pointer';
            albumCard.addEventListener('click', () => {
              loadAlbumDetail(album.albumId);
            });
  
            // Album cover image or placeholder
            if (album.coverArtUrl && album.coverArtUrl.trim() !== '') {
              const albumImage = document.createElement('img');
              albumImage.src = album.coverArtUrl.startsWith('http')
                ? album.coverArtUrl
                : `http://192.168.4.205:5279${album.coverArtUrl}`;
              albumImage.alt = `${album.albumName} cover`;
              albumImage.classList.add('album-cover');
              albumCard.appendChild(albumImage);
            } else {
              const placeholder = document.createElement('div');
              placeholder.classList.add('album-cover-placeholder');
              placeholder.textContent = "No Cover";
              albumCard.appendChild(placeholder);
            }
  
            // Album information: name and release year
            const albumInfo = document.createElement('div');
            albumInfo.classList.add('artist-album-info');
            const albumTitle = document.createElement('h4');
            albumTitle.textContent = album.albumName;
            albumInfo.appendChild(albumTitle);
            if (album.releaseYear) {
              const albumYear = document.createElement('p');
              albumYear.textContent = album.releaseYear;
              albumInfo.appendChild(albumYear);
            }
            albumCard.appendChild(albumInfo);
  
            albumList.appendChild(albumCard);
          });
        } else {
          const noAlbums = document.createElement('p');
          noAlbums.textContent = 'No albums found for this artist.';
          albumList.appendChild(noAlbums);
        }
  
        container.appendChild(albumList);
  
        switchTab('artist-detail');
      })
      .catch(err => console.error('Error loading artist details:', err));
  }
  
  
  
  function backToArtists() {
    // Switch back to the artists tab (assuming you have one)
    switchTab('artists');
  }
  

function loadTracks() {
  fetch('http://192.168.4.205:5279/api/library/tracks')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('tracks-content');
      container.innerHTML = '';
      data.forEach(track => {
        const trackEl = document.createElement('div');
        trackEl.textContent = track.title;
        container.appendChild(trackEl);
      });
    })
    .catch(err => console.error('Error fetching tracks:', err));
}

function loadTrackPlayer(trackIndex) {
    // Retrieve the track using the current track list
    const track = currentTrackList[trackIndex];
    if (!track) return;
    
    // Update player UI elements
    document.getElementById('player-artist').textContent = currentAlbum.albumArtist;
    document.getElementById('player-track-name').innerHTML = `<strong>${track.trackTitle}</strong>`;
    document.getElementById('player-album').textContent = currentAlbum.albumName;
    
    // Set the album artwork (use coverArtUrl from album)
    const artworkEl = document.getElementById('player-album-artwork');
    if (currentAlbum.coverArtUrl && currentAlbum.coverArtUrl.trim() !== '') {
      artworkEl.src = currentAlbum.coverArtUrl.startsWith('http')
        ? currentAlbum.coverArtUrl
        : `http://192.168.4.205:5279${currentAlbum.coverArtUrl}`;
    } else {
      artworkEl.src = 'path/to/placeholder-image.png'; // Provide a fallback image if desired
    }
    
    // Set the audio player source and start playback
    const audioPlayer = document.getElementById('audio-player');
    audioPlayer.src = track.streamUrl.startsWith('http')
      ? track.streamUrl
      : `http://192.168.4.205:5279${track.streamUrl}`;
    audioPlayer.play();
  
    // Set up the seek bar
    const seekBar = document.getElementById('seek-bar');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
  
    // When metadata is loaded, update the max of the seek bar and the total time label
    audioPlayer.addEventListener('loadedmetadata', () => {
      seekBar.max = Math.floor(audioPlayer.duration);
      totalTimeEl.textContent = formatTime(audioPlayer.duration);
    });
  
    // Update seek bar and current time label as the audio plays
    audioPlayer.addEventListener('timeupdate', () => {
      seekBar.value = Math.floor(audioPlayer.currentTime);
      currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    });
  
    // When the user interacts with the seek bar, update the audio currentTime
    seekBar.addEventListener('input', () => {
      audioPlayer.currentTime = seekBar.value;
    });
  
    // Switch to the track player view
    switchTab('track-player');
  }
  
  // Helper function to format seconds as mm:ss
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }
  
  function prevTrack() {
    if (currentTrackIndex > 0) {
      currentTrackIndex--;
      loadTrackPlayer(currentTrackIndex);
    }
  }
  
  function nextTrack() {
    if (currentTrackIndex < currentTrackList.length - 1) {
      currentTrackIndex++;
      loadTrackPlayer(currentTrackIndex);
    }
  }
  
  function togglePlayPause() {
    const audioPlayer = document.getElementById('audio-player');
    if (audioPlayer.paused) {
      audioPlayer.play();
    } else {
      audioPlayer.pause();
    }
  }

  function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }
  
  
  function backToAlbumDetail() {
    // Pause playback when returning to album detail
    const audioPlayer = document.getElementById('audio-player');
    audioPlayer.pause();
    switchTab('album-detail');
  }

  function switchTab(tabId) {
    document.querySelectorAll('.tab').forEach(tab => {
      tab.classList.remove('active');
    });
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
      selectedTab.classList.add('active');
      // Optionally load data if needed for other tabs
      if (tabId === 'artists') {
        loadArtists();
      } else if (tabId === 'albums') {
        loadAlbums();
      } else if (tabId === 'tracks') {
        loadTracks();
      }
    }
  }

  function backToAlbumDetail() {
    // Switch back to the Albums tab
    switchTab('albums');
  
    // Wait a tick to ensure the Albums view is rendered
    setTimeout(() => {
      if (window.lastSelectedAlbumId) {
        const albumCard = document.getElementById(`album-card-${window.lastSelectedAlbumId}`);
        if (albumCard) {
          // Scroll the album card into view
          albumCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, 0);
  }

  function loadTrackPlayerFromSearch(track) {
    // If the track object doesn't include a streamUrl, generate one using its id.
    if (!track.streamUrl) {
      track.streamUrl = `/api/music/stream/${track.id}`;
    }
    
    // Construct a minimal album object from track info.
    currentAlbum = {
      albumName: track.albumName,
      albumArtist: track.artistName,
      coverArtUrl: track.coverArtUrl || "" // fallback if no cover art is provided
    };
    
    // Set up a temporary track list with just this track.
    currentTrackList = [track];
    currentTrackIndex = 0;
    
    // Now call your existing loadTrackPlayer function to update the UI and start playback.
    loadTrackPlayer(currentTrackIndex);
  }
  

  function performSearch() {
    const query = document.getElementById('search-input').value;
    if (!query) {
      document.getElementById('search-results').innerHTML = '';
      return;
    }
  
    const url = `http://192.168.4.205:5279/api/library/search?query=${encodeURIComponent(query)}`;
    console.log('Searching URL:', url);
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log('Search data received:', data);
        const container = document.getElementById('search-results');
        container.innerHTML = '';
  
        // Determine whether each category has results
        const hasArtists = data.artists && data.artists.length > 0;
        const hasAlbums  = data.albums && data.albums.length > 0;
        const hasTracks  = data.tracks && data.tracks.length > 0;
  
        // Render artists if available
        if (hasArtists) {
          const artistsHeader = document.createElement('h2');
          artistsHeader.textContent = 'Artists';
          container.appendChild(artistsHeader);
  
          data.artists.forEach(artist => {
            const artistEl = document.createElement('div');
            artistEl.classList.add('search-artist');
            artistEl.textContent = artist.name;
            // Make artist clickable to load artist details
            artistEl.style.cursor = 'pointer';
            artistEl.addEventListener('click', () => {
              loadArtistDetail(artist.id);
            });
            container.appendChild(artistEl);
          });
        }
  
        // Render albums if available
        if (hasAlbums) {
          const albumsHeader = document.createElement('h2');
          albumsHeader.textContent = 'Albums';
          container.appendChild(albumsHeader);
  
          data.albums.forEach(album => {
            const albumEl = document.createElement('div');
            albumEl.classList.add('search-album');
            albumEl.textContent = `${album.name} - ${album.artistName}`;
            albumEl.style.cursor = 'pointer';
            albumEl.addEventListener('click', () => {
              loadAlbumDetail(album.id);
            });
            container.appendChild(albumEl);
          });
        }
  
        // Render tracks if available
        if (hasTracks) {
          const tracksHeader = document.createElement('h2');
          tracksHeader.textContent = 'Tracks';
          container.appendChild(tracksHeader);
  
          data.tracks.forEach(track => {
            const trackEl = document.createElement('div');
            trackEl.classList.add('search-track');
            trackEl.textContent = `${track.title} - ${track.artistName} (${track.albumName})`;
            trackEl.style.cursor = 'pointer';
            trackEl.addEventListener('click', () => {
              loadTrackPlayerFromSearch(track);
            });
            container.appendChild(trackEl);
          });
        }
  
        // If none of the categories have results, show a "No results found" message.
        if (!hasArtists && !hasAlbums && !hasTracks) {
          const noResults = document.createElement('p');
          noResults.textContent = 'No results found.';
          container.appendChild(noResults);
        }
      })
      .catch(err => console.error('Error performing search:', err));
  }
  
  // Attach the function to the search input (or button if you keep one)
  document.getElementById('search-input').addEventListener('input', debounce(performSearch, 300));

  document.addEventListener('DOMContentLoaded', () => {
    const volumeBar = document.getElementById('volume-bar');
    const audioPlayer = document.getElementById('audio-player');
  
    // Set initial volume
    audioPlayer.volume = volumeBar.value;
  
    // Update the volume when the slider changes
    volumeBar.addEventListener('input', () => {
      audioPlayer.volume = volumeBar.value;
    });
  });
  

// Optionally, load the default tab on startup
document.addEventListener('DOMContentLoaded', () => {
  switchTab('artists');
});
