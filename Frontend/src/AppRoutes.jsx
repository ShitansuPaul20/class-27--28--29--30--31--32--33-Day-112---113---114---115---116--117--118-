import Login from "./features/Auth/pages/Login";
import Register from "./features/Auth/pages/Register";
import { Routes, Route } from "react-router";
import "./features/shared/style/global.scss"
import Protected from "./features/Auth/components/Protected";
import Home from "./features/Home/pages/Home";
import Welcome from "./features/Welcome/pages/Welcome";
import { useAuth } from "./features/Auth/hook/useAuth";
import Nav from "./features/shared/components/Nav";
import MobileSidebar from "./features/shared/components/MobileSidebar";
import Profile from "./features/User/pages/Profile";
import AddSongModal from "./features/shared/components/AddSongModal";
import { useState } from "react";
import MyPlaylist from "./features/Home/pages/MyPlaylist";

const AppRoutes = () => {
  const hasSeenWelcome = localStorage.getItem('welcomeShown') === 'true';
  const { User } = useAuth();
  const [showAddSongModal, setShowAddSongModal] = useState(false);
  const [songAddedTrigger, setSongAddedTrigger] = useState(0);

  console.log('AppRoutes: hasSeenWelcome =', hasSeenWelcome, '| User =', User);

  return (
    <>
      <Nav onAddSongClick={() => setShowAddSongModal(true)} />
      <MobileSidebar onAddSongClick={() => setShowAddSongModal(true)} />

      <AddSongModal
        isOpen={showAddSongModal}
        onClose={() => setShowAddSongModal(false)}
        onSongAdded={() => {
          setShowAddSongModal(false)
          setSongAddedTrigger(prev => prev + 1)
        }}
      />

      <Routes>
        <Route path="/" element={
          !hasSeenWelcome ? (
            <Welcome />
          ) : User ? (
            <Protected><Home /></Protected>
          ) : (
            <Login />
          )
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={
          <Protected>
            <Profile songAddedTrigger={songAddedTrigger} />
          </Protected>
        } />
        <Route path="/my-playlist" element={
          <Protected>
            <MyPlaylist />
          </Protected>
        } />
      </Routes>
    </>
  )
}

export default AppRoutes