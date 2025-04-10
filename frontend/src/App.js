import React from "react";
import Login from "./Login";
import Main from "./Main";
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute";

function LoggedInToMain({id}){
    const token = localStorage.getItem('token');
    // potentailly add token validation later
    console.log("token: ",token)
    if(id == 0){
        return !token ? <Login /> : <Navigate to="/app"/>
    }else{
        return !token ? <Navigate to={"/login"} /> : <Navigate to="/app"/>
    }
    

}


function App(){
    return(
    <>
        <Router>
            <Routes>
                <Route path="/login" element={<LoggedInToMain id={0}/>} />
                <Route path="/app" element={
                    <ProtectedRoute> <Main/> </ProtectedRoute>
                }/>
                 <Route path="*" element={<LoggedInToMain id={1}/>} />
            </Routes>
        </Router>
    </>);
}

export default App;