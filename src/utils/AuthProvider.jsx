import { createContext, useState } from "react"

export const authContext = createContext(null)

function AuthProvider({ children }) {

    const [user, setUser] = useState("mohammad yasin")

    const auth = {
        user,
        setUser
    }

    return (
        <>
            <authContext.Provider value={auth}>
                {children}
            </authContext.Provider>
        </>
    )
}

export default AuthProvider