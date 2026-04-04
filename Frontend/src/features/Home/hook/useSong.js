import { getSong, getSongsByUser, deleteUserSong } from "../service/song.api";
import { useContext } from "react";
import { songContext } from "../songContext";

export const useSong = () => {
    const context = useContext(songContext);
    const {
        song, 
        songs,
        loading, 
        setSongs, 
        setLoading,
        currentSongIndex,
        setCurrentSongIndex,
        getSongsByMood,
        addToHistory
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
        } finally {
            setLoading(false);
        }
    }

    async function handleEmotionToSong({emotion}) {
        const mood = emotionToMoodMap[emotion] || 'Happy';
        await handleGetSong({mood});
    }

    async function handleGetUserSongs() {
        setLoading(true);
        try {
            const data = await getSongsByUser();
            return data.songs || [];
        } catch (error) {
            console.error("Error fetching user songs:", error);
            return [];
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteUserSong(songId) {
        try {
            const data = await deleteUserSong(songId);
            return data;
        } catch (error) {
            console.error("Error deleting song:", error);
            throw error;
        }
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
        handleGetUserSongs,
        handleDeleteUserSong,
        goToNextSong,
        goToPreviousSong,
        isFirstSong,
        isLastSong,
        currentSongIndex,
        trackSongListen
    });
}