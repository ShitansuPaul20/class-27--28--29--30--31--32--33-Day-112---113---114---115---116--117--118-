import Login from "./features/Auth/pages/Login";
import Register from "./features/Auth/pages/Register";
import { Routes , Route } from "react-router";
import "./features/shared/style/global.scss"
import Protected from "./features/Auth/components/Protected";
import Home from "./features/Home/pages/Home";
import Welcome from "./features/Welcome/pages/Welcome";
import { useAuth } from "./features/Auth/hook/useAuth";
import Nav from "./features/shared/components/Nav";
import MobileSidebar from "./features/shared/components/MobileSidebar";
import Profile from "./features/User/pages/Profile";


const AppRoutes = () => {
  const hasSeenWelcome = localStorage.getItem('welcomeShown') === 'true';
  const { User } = useAuth();
  
  console.log('AppRoutes: hasSeenWelcome =', hasSeenWelcome, '| User =', User);

  return (
    <>
        <Nav />
        <MobileSidebar />
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
        </Routes>
    </>
  )
}

export default AppRoutes