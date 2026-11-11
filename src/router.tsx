import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import FlashPage from "./pages/FlashPage.tsx";
import App from "./App.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";


export const router = createBrowserRouter([
    {
        element: <App/>,
        children: [
            {index:true, element: <HomePage/>},
            {path:"flash", element: <FlashPage/>},
            {path: "*", element: <NotFoundPage/>}
        ]
    }
]);