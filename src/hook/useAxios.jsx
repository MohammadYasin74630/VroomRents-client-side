import axios from "axios";
import toast from "react-hot-toast";
import { useContext, useEffect } from "react";
import { authContext } from "../utils/AuthProvider";
import { useNavigate } from "react-router-dom";

const myAxios = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
});

function useAxios() {


    const { logout } = useContext(authContext)
    const navigate = useNavigate()
    const showError = (msg) => toast.error(msg, { position: "top-right" });

    useEffect(
        () => {
            myAxios.interceptors.request.use((config) => {

                // Ignore withCredentials for external URLs
                if (config.url.startsWith("http://api.imgbb.com") || config.url.startsWith("https://api.imgbb.com")) {
                    config.withCredentials = false;
                }
                return config;
            });

            myAxios.interceptors.response.use(function (response) {
                // Any status code that lie within the range of 2xx cause this function to trigger
                return response;
            }, async function (error) {

                if (error.status === 401 || error.status === 403) {

                    try {

                        await logout()
                        navigate("/my-account")
                        return Promise.reject(new Error("token invalid ! plz login again"))
                    }
                    catch (err) { showError(err.message) }

                }
                return Promise.reject(error);
            });
        }, []
    )

    return (
        myAxios
    )
}

export default useAxios