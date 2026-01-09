//! *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
//! Elements
//! *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
const audio = document.getElementById("song_audio");
const playBtn = document.getElementById("play");
const pauseBtn = document.getElementById("pause");
const skipBtn = document.getElementById("skip");
const rewindBtn = document.getElementById("rewind");

const titleEl = document.getElementById("song_title");
const coverEl = document.getElementById("cover_photo");

const progressContainer = document.querySelector(".progress_container");
const progress = document.querySelector(".progress");

const tracksListEl = document.querySelector(".tracks_list");

//! *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
//! State
//! *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
let tracks = [];
let currentTrackIndex = 0;

//! *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
//! Load JSON
//! *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
fetch("audio.json")
  .then(response => response.json())
  .then(data => {
    tracks = data.tracks;
    loadTrack(0);
    renderTrackList();
  })
  .catch(error => {
    console.error("Error loading audio.json:", error);
  });

//! *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
//! Load Track
//! *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function loadTrack(index) {
  const track = tracks[index];
  if (!track) return;

  titleEl.textContent = track.title;
  coverEl.src = track.cover;
  audio.src = track.audio;

  currentTrackIndex = index;
}

//! *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
//! Play / Pause
//! *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function playTrack() {
  audio.play();
}

function pauseTrack() {
  audio.pause();
}

//! *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
//! Next / Previous
//! *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function nextTrack() {
  currentTrackIndex++;
  if (currentTrackIndex >= tracks.length) {
    currentTrackIndex = 0;
  }
  loadTrack(currentTrackIndex);
  playTrack();
}

function prevTrack() {
  currentTrackIndex--;
  if (currentTrackIndex < 0) {
    currentTrackIndex = tracks.length - 1;
  }
  loadTrack(currentTrackIndex);
  playTrack();
}

//! *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
//! Progress Bar
//! *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
audio.addEventListener("timeupdate", updateProgress);

function updateProgress() {
  const { duration, currentTime } = audio;
  if (duration) {
    const percent = (currentTime / duration) * 100;
    progress.style.width = `${percent}%`;
  }
}

progressContainer.addEventListener("click", setProgress);

function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}

//! *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
//! Track List Render
//! *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function renderTrackList() {
  tracksListEl.innerHTML = "";

  tracks.forEach((track, index) => {
    const p = document.createElement("p");
    p.textContent = track.title;
    p.id = "tracks";

    p.addEventListener("click", () => {
      loadTrack(index);
      playTrack();
    });

    tracksListEl.appendChild(p);
  });
}

//! *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
//! Event Listeners
//! *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
playBtn.addEventListener("click", playTrack);
pauseBtn.addEventListener("click", pauseTrack);
skipBtn.addEventListener("click", nextTrack);
rewindBtn.addEventListener("click", prevTrack);

//? Auto play next when song ends
audio.addEventListener("ended", nextTrack);

