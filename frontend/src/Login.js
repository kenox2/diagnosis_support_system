import React, { useState } from 'react';
import UsernameInput from './UsernameInput';
import PasswordInput from './PasswordInput';
import { Navigate } from 'react-router-dom';

function Login(){
    const [userName, setUserName] = useState("");
    const [pass, setPass] = useState("");
    const [isLogged, setIsLogged] = useState(false)

    const handleSubmit = async (e)=>{
        e.preventDefault();
        console.log(userName);
        console.log(pass);
        var formData = new FormData();
        formData.append('login', userName);
        formData.append('password', pass);
        try {
            // Fetch request to login endpoint
            const res = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                body: formData
            });
             
            if (res.ok) {  
                const token = await res.text();
                localStorage.setItem("token", token);               
                console.log("Token saved:", token);
                setIsLogged(true);
            } else {
                // If response isn't OK, log the error message
                const errorMessage = await res.text();
                console.error("Login failed:", errorMessage);
                alert(errorMessage);
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("An error occurred during login.");
        }
    }

    function changeLogin(e){
        setUserName(e.target.value);
    }

    const changePass = (e)=>{
        setPass(e.target.value);
    }

    

    return (
        <>
        {isLogged ? <Navigate to="/app"/> : 
        <>
            <h1>Log in</h1>
            <form onSubmit={handleSubmit}> 
                <UsernameInput onChange={changeLogin}/><br></br>
                <PasswordInput onChange={changePass}/><br></br>
                <input type='submit' value="Submit"></input>
            </form>
        </>}
        </>
    )
}

export default Login;