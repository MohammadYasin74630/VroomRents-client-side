import MainLayout from "../layouts/MainLayout"
import { authRoutes } from "./authRoutes"
import { mainRoutes } from "./mainRoutes"
import { userRoutes } from "./userRoutes"

const routes = [
    {
        path: '/',
        element: <MainLayout/>,
        children: [...mainRoutes, ...authRoutes, ...userRoutes]
    }
]

export { routes }