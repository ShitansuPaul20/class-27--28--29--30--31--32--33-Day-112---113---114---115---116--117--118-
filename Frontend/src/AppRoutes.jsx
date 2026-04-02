import Login from "./features/Auth/pages/Login";
import Register from "./features/Auth/pages/Register";
import { Routes , Route } from "react-router";
import "./features/shared/style/global.scss"
import Protected from "./features/Auth/components/Protected";
import Home from "./features/Home/pages/Home";
import Welcome from "./features/Welcome/pages/Welcome";
import Profile from "./features/shared/pages/Profile";
import MyPlaylist from "./features/shared/pages/MyPlaylist";
import { useAuth } from "./features/Auth/hook/useAuth";

const AppRoutes = () => {
  const hasSeenWelcome = localStorage.getItem('welcomeShown') === 'true';
  const { User } = useAuth();
  
  console.log('AppRoutes: hasSeenWelcome =', hasSeenWelcome, '| User =', User);

  return (
    <>
        <Routes>
            <Route path="/" element={
              !hasSeenWelcome ? (
                <Welcome/>
              ) : User ? (
                <Protected><Home/></Protected>
              ) : (
                <Login/>
              )
            }/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/profile" element={<Protected><Profile/></Protected>}/>
            <Route path="/my-playlist" element={<Protected><MyPlaylist/></Protected>}/>
        </Routes>
    </>
  )
}

export default AppRoutes