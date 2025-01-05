import { useContext } from "react"
import { authContext } from "../../utils/AuthProvider"

function Home() {

    const {user} = useContext(authContext);

    return (
        <div>welcome Home {user}</div>
    )
}

export default Home