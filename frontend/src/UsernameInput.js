import React from 'react';

function UsernameInput({onChange}){
    return (
        <>
            <input type = "text" placeholder="Username" onChange={onChange}/>
        </>
    )
}

export default UsernameInput;