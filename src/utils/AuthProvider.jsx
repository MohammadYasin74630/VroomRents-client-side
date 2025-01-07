import { createContext, useEffect, useState } from "react"
import auth from "./firebase.config";
import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

export const authContext = createContext(null)

function AuthProvider({ children }) {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
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

    useEffect(
        () => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {

                if (user) {
                    setUser(user);
                } else {
                    setUser(null);
                }

                if (loading) { setLoading(false) }
            });

            return unsubscribe
        }, []
    )

    const authInfo = {
        user,
        loading,
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