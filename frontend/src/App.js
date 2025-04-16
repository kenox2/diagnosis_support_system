import React from "react";
import Login from "./Login";
import Main from "./Main";
import SearchPage from "./search_page";
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute";

function LoggedInToMain(){
    const token = localStorage.getItem('token');
    // potentailly add token validation later
    console.log("token: ",token)
    return !token ? <Navigate to={"/login"} /> : <Navigate to="/app"/>
    
    

}


function App(){
    return(
    <>
        <Router>
            <Routes>
                <Route path="/login" element={<Login/>} />
                <Route path="/app" element={
                    <ProtectedRoute> <Main/> </ProtectedRoute>
                }/>
                 <Route path= "/search" element={<ProtectedRoute> <SearchPage/> </ProtectedRoute>}/>
                 <Route path="*" element={<LoggedInToMain />} />
            </Routes>
        </Router>
    </>);
}

export default App;