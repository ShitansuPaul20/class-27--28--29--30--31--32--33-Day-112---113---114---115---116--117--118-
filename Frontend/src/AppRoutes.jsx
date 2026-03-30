import Login from "./features/Auth/pages/Login";
import Register from "./features/Auth/pages/Register";
import { Routes , Route } from "react-router";
import FaceExpression from "./features/expression/components/FaceExpression";
import "./features/shared/style/global.scss"
import Protected from "./features/Auth/components/Protected";
import Home from "./features/Home/pages/Home";

const AppRoutes = () => {
  return (
    <>
        <Routes>
            <Route path="/" element={<Protected><Home/></Protected>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
        </Routes>
    </>
  )
}

export default AppRoutes