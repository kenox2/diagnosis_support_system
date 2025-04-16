import React from "react";


function SearchBar({onChange, onSubmit}){
    return(
        <>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="search for ..." onChange={onChange}/>
            </form>
        </>
    )

}

export default SearchBar;