const InputSpace = ({ fabricCanvasRef, firstNameRef, lastNameRef, ageRef, descriptionRef }) => {



  var saveCanvas = () => {
    
    var canvas = fabricCanvasRef.current;
    if (canvas) {
      var dataURL = canvas.toDataURL({ format: 'png' });
      var link = document.createElement('a');
      link.href = dataURL;
      link.download = 'canvas_image.png';
      //link.click();
      // saving to db
      const file = dataURLtoFile(dataURL, 'canvas_image.png');
      var formData = new FormData();
      formData.append('file', file); // Append the file to the FormData object
      const name = firstNameRef.current.value; // Accessing the value of the input
      const surname = lastNameRef.current.value;
      const description = descriptionRef.current.value;
      const age = parseInt(ageRef.current.value);
      formData.append("file", file); // Append the file
      formData.append("name", name); // Append other parameters to FormData
      formData.append("surname", surname);
      formData.append("description", description);
      formData.append("age", age); // Convert age to a string for FormData

      // Send the request
      fetch("http://localhost:8080/api/uploads/images", {
          method: "POST",
          body: formData, // Send FormData directly
      })
          .then(response => {
              if (response.ok) return response.text();
              throw new Error(`HTTP error! status: ${response.status}`);
          })
          .then(data => {
              console.log("File uploaded successfully:", data);
          })
          .catch(error => {
              console.error("Error uploading file:", error);
          });
        
      }
  };

  function dataURLtoFile(dataURL, filename) {
    var arr = dataURL.split(',');
    var mime = arr[0].match(/:(.*?);/)[1]; // Extract MIME type
    var bstr = atob(arr[1]); // Decode base64 string
    var n = bstr.length;
    var u8arr = new Uint8Array(n);
  
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
  
    return new File([u8arr], filename, { type: mime });
  }


  return (
    <div className="inputSpace">
            <label htmlFor="fname">Imię:</label>
            <input type="text" id="fname" name="fname" ref={firstNameRef} />

            <label htmlFor="lname">Nazwisko:</label>
            <input type="text" id="lname" name="lname" ref={lastNameRef} />

            <label htmlFor="age">Wiek:</label>
            <input type="number" id="age" name="age" ref={ageRef} />

            <label htmlFor="desc">Opis:</label>
            <textarea id="desc" name="desc" ref={descriptionRef}></textarea>
            <button className='saveButton' onClick={saveCanvas}>Save Image</button>
            
            
    </div>
  )
}
export default InputSpace;



