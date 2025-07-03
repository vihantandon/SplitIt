import { BrowserRouter,Routes,Route } from "react-router-dom";
import Landing from "./landing";
import Signin from "./components/signin"

function App(){
    return (
        <BrowserRouter>
         <Routes>
            <Route path = "/" element={<Landing/>}/>
            <Route path = "/signin" element={<Signin/>}/>
         </Routes>
        </BrowserRouter>
    )
}

export default App