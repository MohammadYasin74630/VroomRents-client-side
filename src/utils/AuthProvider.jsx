import { createContext, useEffect, useState } from "react"
import auth from "./firebase.config";
import { browserLocalPersistence, browserSessionPersistence, createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, setPersistence, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

export const authContext = createContext(null)

function AuthProvider({ children }) {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [remember, setRemember] = useState(localStorage.getItem("remember") === "true");
    const googleProvider = new GoogleAuthProvider();

    const register = (email, password) => {

        return createUserWithEmailAndPassword(auth, email, password);
    }

    const login = (email, password) => {

        return signInWithEmailAndPassword(auth, email, password);
    }

    const updateUserInfo = (name, image) => {

        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: image
        });
    }

    const forgotPassword = (email) => {

        return sendPasswordResetEmail(auth, email);
    }

    const googleLogin = () => {

        return signInWithPopup(auth, googleProvider);
    }

    const logout = () => {

        return signOut(auth);
    }

    useEffect(() => {

        const persistenceMode = remember ? browserLocalPersistence : browserSessionPersistence;

        setPersistence(auth, persistenceMode)
            .then(() => {

                const unsubscribe = onAuthStateChanged(auth, (user) => {

                    if (user) {
                        setUser(user);
                    } else {
                        setUser(null);
                    }

                    if (loading) { setLoading(false) }
                });

                return unsubscribe
            })
            .catch((error) => {
                console.error("Error setting session persistence:", error);
            });
    }, [remember]);

    const authInfo = {
        user,
        loading,
        remember,
        setRemember,
        setUser,
        register,
        login,
        updateUserInfo,
        forgotPassword,
        logout,
        googleLogin
    }

    return (
        <>
            <authContext.Provider value={authInfo}>
                {children}
            </authContext.Provider>
        </>
    )
}

export default AuthProvider