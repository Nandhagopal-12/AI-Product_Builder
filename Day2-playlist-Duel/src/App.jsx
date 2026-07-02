import { useState } from 'react'
import './App.css'

const starterSongs = [
  {
    id: 1,
    title: 'Hall of Fame',
    artist: 'ft. Will.i.am',
    mood: 'Motivational',
    votes: 0,
  },
  {
    id: 2,
    title: 'Headlights',
    artist: 'Alan Walker',
    mood: 'Electronic',
    votes: 0,
  },
]

function CandidateCard({ song, isLeader, onVote }) {
  return (
    <article className={isLeader ? 'candidate leader-card' : 'candidate'}>
      <p className="tag">{song.mood}</p>
      <h2>{song.title}</h2>
      <p className="artist">by {song.artist}</p>
      <p className="votes">{song.votes} votes</p>
      <button type="button" onClick={() => onVote(song.id)}>
        Vote for {song.title}
      </button>
    </article>
  )
}

function App() {
  const [songs, setSongs] = useState(starterSongs)

  function handleVote(songId) {
    const updatedSongs = songs.map((song) => {
      if (song.id === songId) {
        return { ...song, votes: song.votes + 1 }
      }

      return song
    })

    setSongs(updatedSongs)
  }

  const leader = songs.reduce((topSong, currentSong) => {
    if (currentSong.votes > topSong.votes) {
      return currentSong
    }

    return topSong
  }, songs[0])

  const isTie = songs[0].votes === songs[1].votes

  return (
    <main className="app">
      <section className="intro">
        <p className="eyebrow">Playlist Duel</p>
        <h1>Choose the next song</h1>
        <p>
          Vote between two tracks. The app updates the votes and shows the
          current leader.
        </p>
      </section>

      <section className="duel">
        {songs.map((song) => (
          <CandidateCard
            key={song.id}
            song={song}
            isLeader={!isTie && song.id === leader.id}
            onVote={handleVote}
          />
        ))}
      </section>

      <section className="leader-box">
        <h2>Current leader</h2>
        {isTie ? (
          <p>The duel is tied. Pick a track to break the tie.</p>
        ) : (
          <p>
            {leader.title} is leading with {leader.votes} votes.
          </p>
        )}
      </section>
    </main>
  )
}

export default App
