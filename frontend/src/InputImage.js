import { fabric } from 'fabric';
const InputImage = ({fabricCanvasRef, setUploadedImage, setImageFile}) => {
    var handleImageUpload = (e) => {
        var file = e.target.files[0];
        console.log('SFile before set:', file);
        setImageFile(file);
        
        const maxWidth = 800;
        const maxHeight = 800;

        const minWidth = 700;
        const minHeight = 500;
        
        if (file && fabricCanvasRef.current) {
          // Create a local image URL (for use on the canvas)
          const imageUrl = URL.createObjectURL(file); // Creates a temporary URL for the local file
      
          // Load the image into Fabric.js and update the canvas
          fabric.Image.fromURL(imageUrl, (img) => {
            var canvas = fabricCanvasRef.current;
            // Get the image's original width and height
            const imgWidth = img.width;
            const imgHeight = img.height;
            
            var newWidth, newHeight;
            // Scale the image to cover the canvas
            if((imgWidth <= maxWidth && imgWidth >= minWidth) && (imgWidth <= maxHeight && imgWidth >= minHeight)){
              newWidth = imgWidth;
              newHeight = imgHeight;
            }else{
              var scale = Math.min(maxHeight/imgHeight, maxWidth/imgWidth);
              img.scale(scale);
              newWidth = imgWidth * scale;
              newHeight = imgHeight * scale;
            }
            canvas.setDimensions({ width: newWidth, height: newHeight });
            console.log("width is: ", newWidth);

            img.selectable = false; // Make it non-selectable
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));

          });
      
          var formData = new FormData();
          formData.append('file', file); // Append the file to the FormData object
    
          // Send the request with the FormData
          let token = localStorage.getItem('token')
          fetch('http://localhost:8080/api/uploads/images_temp', {
            method: 'POST',
            headers: {
              "Authorization": `Bearer ${token}`,
            },
            body: formData, // Automatically sets the correct content-type for multipart/form-data
          })
            .then((response) => response.text())  // Since the server returns a plain string (not JSON)
            .then((data) => {
              // Now data is just a string (the filename or URL returned by the server)
              const serverFileName = data.trim(); // Optional: trim the response if needed
    
              // Store the filename for future use
              setUploadedImage(serverFileName);
              console.log('Uploaded file:', serverFileName);
            })  
            .catch((error) => {
              console.error('Upload failed:', error);
            });
          }
    };
    return(<input type="file" accept="image/*" onChange={handleImageUpload} />);
}
export default InputImage;