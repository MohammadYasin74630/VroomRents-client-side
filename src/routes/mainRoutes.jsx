import MainLayout from "../layouts/MainLayout"
import Home from "../pages/Home/Home"


const mainRoutes = [
    {
        path: '/',
        element: <MainLayout/>,
        children: [
            {
                path: '/',
                element: <Home/>
            }
        ]
    }
]

export { mainRoutes }