import Login from "./features/Auth/pages/Login";
import Register from "./features/Auth/pages/Register";
import { Routes , Route } from "react-router";
import "./features/shared/style/global.scss"
import Protected from "./features/Auth/components/Protected";
import Home from "./features/Home/pages/Home";
import Welcome from "./features/Welcome/pages/Welcome";

const AppRoutes = () => {
  console.log('APProutes RENDERING');
  // TEMPORARY: Always show welcome first to test
  const hasSeenWelcome = false;

  return (
    <>
        <Routes>
            <Route path="/" element={!hasSeenWelcome ? <Welcome/> : <Protected><Home/></Protected>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
        </Routes>
    </>
  )
}

export default AppRoutes