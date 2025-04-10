import React from 'react';
import { fabric } from 'fabric';

const PredictionButton = ({ setPredictedImage, uploadedImage, model, classes, isModel, imageFile, fabricCanvasRef }) => {
 
  
  
  const fetchPrediction = async () => {
        if (!uploadedImage) {
            console.log('No image uploaded to predict!');
            return;
          }
          if(!imageFile){
            console.log("image nie doszedl :(")
            return 
          }
          
          let token = localStorage.getItem('token');
          if(isModel){
            var formData = new FormData();
            console.log(imageFile);
            console.log(model);
            console.log(classes);
            formData.append('image', imageFile);
            formData.append('model', model);
            formData.append('class_names', classes);
            
            try{ 
              // Send the request with the FormData
              var response = await fetch('http://localhost:8080/api/uploads/predict/own_model', {
                method: 'POST',
                headers: {
                  "Authorization": `Bearer ${token}`,
                },
                body: formData, // Automatically sets the correct content-type for multipart/form-data
              });
              
              if (!response.ok) {
                throw new Error('Failed to fetch prediction');
              }
              
              const blob = await response.blob();
              const imageUrl = URL.createObjectURL(blob);

              fabric.Image.fromURL(imageUrl, (img) => {
                const canvas = fabricCanvasRef.current
                const tempCanvas = document.createElement("canvas");
                const tempCtx = tempCanvas.getContext("2d");

                // Set the dimensions of the temporary canvas to the scaled image size
                tempCanvas.width = canvas.width;
                tempCanvas.height = canvas.height;

                // Draw the resized image on the temporary canvas
                tempCtx.drawImage(img.getElement(), 0, 0, tempCanvas.width, tempCanvas.height);

                // Get the data URL of the resized image
                const resizedImageUrl = tempCanvas.toDataURL("image/jpeg");

                // Update the predicted image state with the resized image URL
                setPredictedImage(resizedImageUrl);
              });
              

              
            } catch (error) {
              console.error('Error fetching prediction:', error);
            }
              

          }
          else{
            try {
              const response = await fetch('http://localhost:8080/api/uploads/images/'+ uploadedImage, {
                method: 'GET',
                headers: {
                  "Authorization": `Bearer ${token}`,
                },
              });
        
              if (!response.ok) {
                throw new Error('Failed to fetch prediction');
              }

              const blob = await response.blob();
              const imageUrl = URL.createObjectURL(blob);
              
              fabric.Image.fromURL(imageUrl, (img) => {
                const canvas = fabricCanvasRef.current
                const tempCanvas = document.createElement("canvas");
                const tempCtx = tempCanvas.getContext("2d");

                // Set the dimensions of the temporary canvas to the scaled image size
                tempCanvas.width = canvas.width;
                tempCanvas.height = canvas.height;

                // Draw the resized image on the temporary canvas
                tempCtx.drawImage(img.getElement(), 0, 0, tempCanvas.width, tempCanvas.height);

                // Get the data URL of the resized image
                const resizedImageUrl = tempCanvas.toDataURL("image/jpeg");

                // Update the predicted image state with the resized image URL
                setPredictedImage(resizedImageUrl);
              });
            } catch (error) {
              console.error('Error fetching prediction:', error);
            }
          }
          
    };
  
    return (
    <div>
      <button onClick={fetchPrediction}>Predict</button>
    </div>
  );
};

export default PredictionButton;
