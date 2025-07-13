import config from './config';
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
      let token = localStorage.getItem('token');
      // Send the request
      fetch(`${config.API_BASE_URL}/api/uploads/images`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
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
     <div className="flex flex-col space-y-3 w-full">
          <label htmlFor="fname">Imię:</label>
          <input id="fname" ref={firstNameRef} className="border p-2 rounded w-full" />

          <label htmlFor="lname">Nazwisko:</label>
          <input id="lname" ref={lastNameRef} className="border p-2 rounded w-full" />

          <label htmlFor="age">Wiek:</label>
          <input type="number" id="age" ref={ageRef} className="border p-2 rounded w-full" />

          <label htmlFor="desc">Opis:</label>
          <textarea id="desc" ref={descriptionRef} className="border p-2 rounded resize-none w-full h-24" />

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => saveCanvas(fabricCanvasRef, firstNameRef, lastNameRef, ageRef, descriptionRef)}
          >
            Zapisz obraz
    </button>
  </div>
  );
};
export default InputSpace;



