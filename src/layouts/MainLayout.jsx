import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

function MainLayout() {

    return <>
        <div className="bg-emerald-950">
            <Nav />
            <Outlet />
            <Footer />
            <div className="h-[100vh]"></div>
        </div>
    </>
}

export default MainLayout;