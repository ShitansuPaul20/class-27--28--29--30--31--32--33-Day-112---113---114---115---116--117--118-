import { AuthContext } from "../authContext";
import { register, login, logout,} from "../services/auth.api";   
import { useContext } from "react";

export const useAuth = () => {

    const context = useContext(AuthContext);
    const { User, setUser, loading, setloading } = context;

        const handleRegister = async (username , email , password) => {
            setloading(true);
            try{
                const data = await register(username , email , password);
                setUser(data.user);
            }
            catch(error){
                console.log(error);
            }
            finally{
                setloading(false);
            }
        };

        const handleLogin = async (usernameorEmail , password) => {
            setloading(true);
            try{
                const data = await login(usernameorEmail , password);
                setUser(data.user);
            }
            catch(error){
                console.log(error);
            }
            finally{
                setloading(false);
            }
        };

        const handleLogout = async () => {
            setloading(true);
            try{
                await logout();
                setUser(null);
            }
            catch(error){
                console.log(error);
            }
            finally{
                setloading(false);
            }
        };

        



       

    return ({
        User,
        loading,
        handleRegister,
        handleLogin,
        handleLogout,
    });
}