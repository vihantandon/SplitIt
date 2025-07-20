import { useEffect } from "react";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import axios from "axios";
import Landing from "./landing";
import Signin from "./components/signin"
import Signup from "./components/signup";
import CreateGroup from "./components/creategrp";
import AddExpense from "./components/addexpense";
import YourGroups from "./components/yourgroups";
import GroupDetail from "./components/grpdetails";
import ProtectedRoutes from "./components/ProtectedRoutes"; //after logging out the back button redirects to signin page
import HandleInvite from "./components/handleinvite"; 

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


            <Route path = "/creategrp" element={<ProtectedRoutes><CreateGroup/></ProtectedRoutes>}/>
            <Route path = "/addexpense" element={<ProtectedRoutes><AddExpense/></ProtectedRoutes>}/>
            <Route path = "/yourgroups" element={<ProtectedRoutes><YourGroups/></ProtectedRoutes>}/>
            <Route path = "/grpdetails" element={<ProtectedRoutes><GroupDetail/></ProtectedRoutes>}/>
            <Route path = "/grpdetails/:groupId" element={<ProtectedRoutes><GroupDetail/></ProtectedRoutes>}/>
            <Route path = "/invite/:token" element={<HandleInvite/>}/>
            {/* Catch-all route for 404 */}
         </Routes>
        </BrowserRouter>
    )
}

export default App