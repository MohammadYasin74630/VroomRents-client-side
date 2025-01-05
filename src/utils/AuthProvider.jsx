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

        return createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                console.log(user)
            })
            .catch((error) => {
                console.log(error.message)
            });
    }

    const login = (email, password) => {

        return signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential.user)
            })
            .catch((error) => {
                console.log(error.message)
            });
    }

    const updateUserInfo = (name, image) => {

        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: image
        }).then((abc) => {
            console.log("updated user infor", abc)
        }).catch((error) => {
            console.log(error.message)
        });
    }

    const forgotPassword = (email) => {

        return sendPasswordResetEmail(auth, email)
            .then((abc) => {
                console.log("email sent ", abc)
            })
            .catch((error) => {
                console.log(error.message)
            });
    }

    const googleLogin = () => {

        return signInWithPopup(auth, googleProvider)
            .then((result) => {
                console.log(result)
            }).catch((error) => {
                console.log(error.message)
            });
    }

    const logout = () => {

        return signOut(auth).then((abc) => {
            console.log("logout successfull", abc)
        }).catch((error) => {
            console.log(error.message)
        });
    }

    useEffect(
        () => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {

                if (user) {
                    setUser(user);
                } else {
                    setUser(null);
                }

                setLoading(false)
            });

            return () => unsubscribe()
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