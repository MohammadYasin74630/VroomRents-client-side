import ForgotPassword from "../pages/Forgot-Password/ForgotPassword";
import MyAccount from "../pages/Login-Register/MyAccount";
import UpdateProfile from "../pages/Update-Profile/UpdateProfile";

export const authRoutes = [
    {
        path: "/my-account",
        element: <MyAccount />
    },
    {
        path: "/update-account",
        element: <UpdateProfile/>
    },
    {
        path: "/forgot-password",
        element: <ForgotPassword/>
    }
]