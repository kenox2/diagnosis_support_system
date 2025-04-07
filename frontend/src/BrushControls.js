import React from 'react';

const BrushControls = ({ fabricCanvasRef, brushSize, brushColorR, brushColorG, brushColorB, setBrushSize, setBrushColorR, setBrushColorG, setBrushColorB }) => {
    const changeBrushSize = (e) => {
        const newSize = e.target.value; // Get the new brush size from the slider
        setBrushSize(newSize); // Update React state (if needed for UI display)
    
        const canvas = fabricCanvasRef.current;
        if (canvas && canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.width = parseInt(newSize, 10); // Update brush size directly
        }
      }
    
    
    
      const changeColor = (value, color) =>{
        var r, g, b;
        switch(color){
          case("r"):
            r = parseInt(value);
            g = parseInt(brushColorG);
            b = parseInt(brushColorB);
            break;
          case("g"):
            r = parseInt(brushColorR);
            g = parseInt(value);
            b = parseInt(brushColorB);
            break;
          case("b"):
            r = parseInt(brushColorR);
            g = parseInt(brushColorG);
            b = parseInt(value);
            break;
          default:
            console.log("something went horrbily wrong");
            return -1;
        }
        const colUpd = calcNewColor(r, g, b);
        const canvas = fabricCanvasRef.current;
        canvas.freeDrawingBrush.color = colUpd;
    
      }
    
      const  calcNewColor = (r, g, b) => {
        console.log(r);
        console.log(g);
        console.log(b);
        r = r.toString(16);
        g = g.toString(16);
        b = b.toString(16);
    
        if(r.length < 2) r = "0" + r ;
        if(g.length < 2) g = "0" + g;
        if(b.length < 2) b = "0" + b;
    
        console.log(r+g+b);
        return "#" + r + g + b;
      }
    
      const changeRed = (e) => {
        const newColor = e.target.value; // Get the new brush size from the slider
        setBrushColorR(newColor); // Update React state (if needed for UI display)
        changeColor(newColor, 'r');
      }
    
      
      const changeGreen = (e) => {
        const newColor = e.target.value; // Get the new brush size from the slider
        setBrushColorG(newColor); // Update React state (if needed for UI display)
        changeColor(newColor, 'g');
      }
    
      const changeBlue = (e) => {
        const newColor = e.target.value; // Get the new brush size from the slider
        setBrushColorB(newColor); // Update React state (if needed for UI display)
        changeColor(newColor, 'b');
      }

  return (
    <div className='brush'>
      <input
          type="range"
          id="brushSize"
          min="1"
          max="100"
          value={brushSize}
          onChange={changeBrushSize}
        />
        <span>{brushSize}px</span> {/* Display the current brush size */}

        <input
          type="range"
          id="brushColorR"
          min="0"
          max="255"
          value={brushColorR}
          onChange={changeRed}
        />
        <span>{brushColorR} R</span> {/* Display the current brush size */}

        <input
          type="range"
          id="brushColorG"
          min="0"
          max="255"
          value={brushColorG}
          onChange={changeGreen}
        />
        <span>{brushColorG} G</span> {/* Display the current brush size */}

        <input
          type="range"
          id="brushColorB"
          min="0"
          max="255"
          value={brushColorB}
          onChange={changeBlue}
        />
        <span>{brushColorB} B</span> {/* Display the current brush size */}

        <span
          className="currentColor"
          style={{
            display: "inline-block",
            width: "20px",
            height: "20px",
            backgroundColor: `rgb(${brushColorR}, ${brushColorG}, ${brushColorB})`,
            border: "1px solid black",
          }}
        ></span>
    </div>
  );
};

export default BrushControls;