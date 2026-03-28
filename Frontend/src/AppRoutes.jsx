import Login from "./features/Auth/pages/Login";
import Register from "./features/Auth/pages/Register";
import { Routes , Route } from "react-router";
import FaceExpression from "./features/expression/components/FaceExpression";
import "./features/shared/style/global.scss"

const AppRoutes = () => {
  return (
    <>
        <Routes>
            <Route path="/" element={<FaceExpression/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
        </Routes>
    </>
  )
}

export default AppRoutes