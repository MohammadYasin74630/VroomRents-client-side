import { Outlet } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Nav from "../components/Nav";
import Footer from "../components/Footer";

function MainLayout() {

    return <>
            <Nav />
            <Outlet />
            <Footer />
            <Toaster />
            <div className="h-[100vh]"></div>
    </>
}

export default MainLayout;