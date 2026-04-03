import { AuthContext } from "../authContext";
import { register, login, logout, fetchUserData , updateProfilePicture , fetchUserStats , fetchUserHistory } from "../services/auth.api";   
import { useContext, useEffect } from "react";

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

        const handleGetMe = async () => {
            setloading(true);
            try{
                const data = await fetchUserData();
                setUser(data);
            }
            catch(error){
                console.log(error);
            }
            finally{
                setloading(false);
            }
        };

        const handleUpdateProfile = async (formData) => {
            setloading(true);
            try{
                const data = await updateProfilePicture(formData);
                setUser(data);
            }
            catch(error){
                console.log(error);
            }
            finally{
                setloading(false);
            }
        };

        const handleUserStats = async () => {
            setloading(true);
            try{
                const data = await fetchUserStats();
                return data.stats;
            }
            catch(error){
                console.log(error);
                return null;
            }
            finally{
                setloading(false);
            }
        };

        const handleUserHistory = async () => {
            setloading(true);
            try{
                const data = await fetchUserHistory();
                return data.history;
            }
            catch(error){
                console.log(error);
                return null;
            }
            finally{
                setloading(false);
            }
        };



        useEffect(() => {
            handleGetMe();
        }, []);

    return ({
        User,
        loading,
        handleRegister,
        handleLogin,
        handleLogout,
        handleGetMe,
        handleUpdateProfile,
        handleUserStats,
        handleUserHistory
    });
}