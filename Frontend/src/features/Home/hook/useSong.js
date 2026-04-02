import {getSong} from "../service/song.api";
import { getSongsByMood } from "../../Auth/services/userSong.api";
import { useContext } from "react";
import { songContext } from "../songContext";
import { addToHistory } from "../../Auth/services/profile.api";

export const useSong = () => {
    const context = useContext(songContext);
    const {
        song, 
        songs,
        loading, 
        setSongs, 
        setLoading,
        currentSongIndex,
        setCurrentSongIndex
    } = context;

    const emotionToMoodMap = {
        smiling: 'Happy',
        surprised: 'Surprised',
        sorrow: 'Sad'
    };

    async function handleGetSong({mood}) {
        setLoading(true);
        try {
            const songData = await getSong({mood});
            console.log(`Fetching songs for mood: ${mood}`, songData);
            setSongs(songData.songs || []);
            setCurrentSongIndex(0);
        } catch (error) {
            console.error("Error fetching songs:", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    async function handleGetSongWithUserSongs({mood}) {
        setLoading(true);
        try {
            const songData = await getSongsByMood(mood);
            console.log(`Fetching combined songs for mood: ${mood}`, songData);
            setSongs(songData.songs || []);
            setCurrentSongIndex(0);
        } catch (error) {
            console.error("Error fetching combined songs:", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    async function handleEmotionToSong({emotion}) {
        const mood = emotionToMoodMap[emotion] || 'Happy';
        await handleGetSong({mood});
    }

    function goToNextSong() {
        if (currentSongIndex < songs.length - 1) {
            setCurrentSongIndex(currentSongIndex + 1);
        }
    }

    function goToPreviousSong() {
        if (currentSongIndex > 0) {
            setCurrentSongIndex(currentSongIndex - 1);
        }
    }

    async function trackSongListen(songTitle, mood) {
        try {
            await addToHistory(songTitle, mood, 'listened');
            console.log('Song listen tracked:', songTitle);
        } catch (error) {
            console.error('Error tracking song listen:', error);
        }
    }

    const isFirstSong = currentSongIndex === 0;
    const isLastSong = currentSongIndex === songs.length - 1;

    return ({ 
        song, 
        songs,
        loading, 
        handleGetSong,
        handleGetSongWithUserSongs,
        handleEmotionToSong,
        goToNextSong,
        goToPreviousSong,
        isFirstSong,
        isLastSong,
        currentSongIndex,
        trackSongListen
    });
}



