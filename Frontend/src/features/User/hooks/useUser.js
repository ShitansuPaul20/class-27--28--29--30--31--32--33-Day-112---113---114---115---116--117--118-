import { useContext, useState} from 'react';
import { userContext } from '../user.context.jsx';
import { fetchUserData, updateProfilePicture, fetchUserStats, fetchUserHistory } from '../services/user.api';    

export const useUser = () => {

    const context = useContext(userContext);

    if (!context) {
        return { user: null, loading: false }; 
    }
    
    const { user, setUser } = context;

    const [loading, setloading] = useState(false);


        const handleGetMe = async () => {
            setloading(true);
            try{
                const data = await fetchUserData();
                console.log(data.user);
                setUser(data.user);
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
                setUser(data.user);
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
                console.log(data.stats);
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


    return ({
        user,
        loading,
        handleGetMe,
        handleUpdateProfile,
        handleUserStats,
        handleUserHistory
    });

};  