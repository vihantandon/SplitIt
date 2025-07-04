import { useEffect } from "react";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import axios from "axios";
import Landing from "./landing";
import Signin from "./components/signin"
import Signup from "./components/signup";

function App(){

    useEffect(() => {
    axios
    .get('http://localhost:3000/api/test')
    .then(res => console.log(res.data))
    .catch(err => console.error(err));
  }, []);


    return (
        <BrowserRouter>
         <Routes>
            <Route path = "/" element={<Landing/>}/>
            <Route path = "/signin" element={<Signin/>}/>
            <Route path = "/signup" element={<Signup/>}/>
         </Routes>
        </BrowserRouter>
    )
}

export default App