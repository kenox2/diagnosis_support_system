import React from "react"

function PasswordInput({onChange}){
    return (
        <>
            <input type = "password" placeholder="Password" onChange={onChange}/>
        </>
    )
}

export default PasswordInput;