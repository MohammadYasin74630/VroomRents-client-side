import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

function MainLayout() {

    return <>
        <Nav />
        <Outlet />
        <Footer />
        <div className="h-[100vh]"></div>
    </>
}

export default MainLayout;