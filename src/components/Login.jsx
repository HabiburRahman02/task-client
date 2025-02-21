import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const { googleLogin } = useContext(AuthContext);

    const handleGoogleLogin = () => {
        googleLogin()
            .then(result => {
                const user = result.user;
                const userInfo = {
                    userId: user?.uid,
                    name: user?.displayName,
                    email: user?.email
                }
                navigate('/')
                axios.post('https://task-server-eight-murex.vercel.app/users', userInfo)
                    .then(res => {
                        console.log(res.data);
                    })
            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <div className="mt-20 mx-auto flex items-center justify-center">
            <button onClick={handleGoogleLogin} className="btn-lg btn max-w-72 border-2 bg-gray-200 dark:bg-gray-600 dark:text-white">Login With Google</button>
        </div>
    );
};

export default Login;