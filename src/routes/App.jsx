import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { mainRoutes } from "./mainRoutes";

function App() {

  const routes = createBrowserRouter([...mainRoutes])

  return (
    <>
      <RouterProvider router={routes}/>
    </>
  )
}

export default App
