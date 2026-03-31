import { useState } from "react";
import { songContext } from "./songContext";

export const SongContextProvider = ({ children }) => {
   
    const [songs, setSongs] = useState([{
        "url": "https://ik.imagekit.io/yhvjrutsa/cohort-2/moodify/songs/Do_Din_Ke_Baad_zuZf1rxnU.mp3",
        "posterUrl": "https://ik.imagekit.io/yhvjrutsa/cohort-2/moodify/posters/Do_Din_Ke_Baad_hKACH3g46.jpeg",
        "title": "Do Din Ke Baad",
        "mood": "Sad",
    }])
    const [currentSongIndex, setCurrentSongIndex] = useState(0)
    const [loading, setLoading] = useState(false)

    const song = songs[currentSongIndex] || songs[0]

    return (
        <songContext.Provider value={{ 
            song, 
            setSong: (newSong) => {
                setSongs([newSong])
                setCurrentSongIndex(0)
            }, 
            songs,
            setSongs,
            currentSongIndex,
            setCurrentSongIndex,
            loading, 
            setLoading 
        }}>
            {children}
        </songContext.Provider>
    );
};

