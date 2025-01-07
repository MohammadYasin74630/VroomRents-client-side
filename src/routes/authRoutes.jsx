import ForgotPassword from "../pages/Forgot-Password/ForgotPassword";
import MyAccount from "../pages/Login-Register/MyAccount";
import UpdateProfile from "../pages/Update-Profile/UpdateProfile";

const register = async ({ request }) => {
    const formData = await request.formData()
    console.log(console.log(Object.fromEntries(formData)))
    return {result : 'abc'}
}

export const authRoutes = [
    {
        path: "/my-account",
        element: <MyAccount />
    },
    {
        path: "/update-account",
        element: <UpdateProfile/>,
        action: register
    },
    {
        path: "/forgot-password",
        element: <ForgotPassword/>,
        action: register
    }
]