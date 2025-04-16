 import React, { useState } from "react";
 import ScrollableExpandableList from "./ExpandableList";
import SearchBar from "./SearchBar";



 function SearchPage(){
    const [searchStatement, setSearchStatement] = useState("");
    const [items, setItems] = useState([]);
    
    function onInput(e){
        setSearchStatement(e.target.value);
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        // Send a GET request to your backend search endpoint
        let token = localStorage.getItem('token')
        const response = await fetch(`http://localhost:8080/api/search/get?query=${encodeURIComponent(searchStatement)}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
      });
        if (!response.ok) {
          // Handle non-2xx response statuses here
          throw new Error("Failed to fetch search results.");
        }
        const data = await response.json();
  
        // Map the backend structure to the structure expected by your list
        // e.g., the backend returns objects with properties id, name, description, imageUrl
        const formattedItems = data.map(item => ({
          id: item.id,
          title: item.name, 
          description: item.description,
          image: "http://localhost:8080"+item.imageUrl 
        }));
  
        setItems(formattedItems);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };
  


    return(
    <>
        <SearchBar onChange = {onInput} onSubmit={handleSubmit}/>
        <ScrollableExpandableList items={items}/>
    </>
    )
 }

 export default SearchPage;