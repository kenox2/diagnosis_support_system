import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import './App.css';
import BrushControls from './BrushControls';
import InputSpace from './InputSpace';
import PredictionButton from './PredictionButton';
import InputImage from './InputImage';
import OwnModel from './ownModel';

var DrawingCanvas = () => {
  var SCALE_FACTOR = 2.5;
  var ZOOM_MAX = 2.5;
  var canvasRef = useRef(null);
  var fabricCanvasRef = useRef(null);
  
  

  // model, classes
  const [model, setModel] = useState(null)
  const [classes, setClasses] = useState(null)
  const [isModel, setIsModel] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    console.log('Updated imageFile:', imageFile);
  }, [imageFile]);

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const ageRef = useRef(null);
  const descriptionRef = useRef(null);

  const [brushSize, setBrushSize] = useState(5);
  const [brushColorR, setBrushColorR] = useState(0);
  const [brushColorG, setBrushColorG] = useState(0);
  const [brushColorB, setBrushColorB] = useState(0);


  const [predictedImage, setPredictedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  var canvasHeight = 700;
  var canvasWidth = 800;

  // Initialize Fabric.js Canvas
  useEffect(() => {
    var fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: '#ffffff',
    });

    

    fabricCanvas.isDrawingMode = true;  // Drawing enabled by default
    fabricCanvas.freeDrawingBrush.width = brushSize;
    fabricCanvas.freeDrawingBrush.color = '#000000';
    fabricCanvasRef.current = fabricCanvas;

    // Key Down event to zoom
    var handleKeyDown = (e) => {
      if(e.ctrlKey || e.metaKey){
        if (e.key === 'z') {
          zoomIn(e); // Zoom In
        } else if (e.key === 'x') {
          resetZoom(); // Zoom Out
        }  else if (e.key === "v"){
          undoDrawing();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      fabricCanvas.dispose();
    };
  }, []);


  function resetZoom() {
    const canvas = fabricCanvasRef.current;

    if (!canvas) {
        console.error("Canvas is not available.");
        return;
    }

    // Reset zoom level to 1 (default zoom level)
    canvas.setZoom(1);

    // Reset viewport transform to default (no translation or scaling)
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

    // Re-render the canvas to apply the reset
    canvas.renderAll();

  }

  function undoDrawing() {
    const canvas = fabricCanvasRef.current
    const objects = canvas.getObjects();

    if(objects.length > 0){
      canvas.remove(objects[objects.length - 1]);
      canvas.renderAll();
    } else {
      console.log("No objects to undo.");
    }
  };


  const zoomIn = (e) => {
    const canvas = fabricCanvasRef.current;

    // Get mouse position relative to the canvas
    const pointer = canvas.getPointer(e);
    const mouseX = pointer.x;
    const mouseY = pointer.y;
    console.log(`mouse coord before transformation are: x = ${mouseX}, y = ${mouseY}`);

    // Get the current zoom level
    const currentZoom = canvas.getZoom();

    // Prevent zooming if maximum zoom level is reached
    if (currentZoom * SCALE_FACTOR > ZOOM_MAX) {
        return;
    }

    // Apply the new zoom level
    const newZoom = currentZoom * SCALE_FACTOR;
    canvas.setZoom(newZoom);

    // Get the current viewport translation (position)
    const deltaX = mouseX - canvas.viewportTransform[4]; // X offset
    const deltaY = mouseY - canvas.viewportTransform[5]; // Y offset

    // Recalculate new position to ensure zooming happens around the mouse pointer
    const newLeft = mouseX - deltaX * SCALE_FACTOR;
    const newTop = mouseY - deltaY * SCALE_FACTOR;

    // Apply the new transformation (zoom and position)
    canvas.setViewportTransform([
        newZoom, 0, 0, newZoom, newLeft, newTop
    ]);

    // Re-render the canvas to apply the changes
    canvas.renderAll();
};

  
  
  return (
    <div className="bg-gray-gradient min-h-screen w-full flex flex-col">
  <div className="flex-grow flex flex-col">
    <div className="flex justify-start"> 
      <img
        src="/lupka.jpg"
        alt="Example"
        className="rounded-full border-2 border-blue-500 w-20 h-20 m-2 mb-4"
      />
    </div>

    <div className="mb-2">
      <BrushControls
        fabricCanvasRef={fabricCanvasRef}
        brushSize={brushSize}
        brushColorR={brushColorR}
        brushColorG={brushColorG}
        brushColorB={brushColorB}
        setBrushSize={setBrushSize}
        setBrushColorR={setBrushColorR}
        setBrushColorG={setBrushColorG}
        setBrushColorB={setBrushColorB}
      />
    </div>


    <div className="flex w-full flex-grow gap-4">
  {/* Left Panel: Canvas or Upload */}
  <div className="p-4 flex-grow-[3] flex items-center justify-start relative">
    {/* Always render the canvas */}
    <canvas
      ref={canvasRef}
      style={{
        border: '1px solid black',
        visibility: imageFile ? 'visible' : 'hidden',
      }}
    ></canvas>
  </div>

  {/* Middle Panel: Reserved for additional use or just empty */}
 <div className="p-4 flex flex-col items-start justify-center h-full gap-12 w-60 mt-8 ml-6">
  <InputImage
    fabricCanvasRef={fabricCanvasRef}
    setUploadedImage={setUploadedImage}
    setImageFile={setImageFile}
  />

  <button className="cursor-pointer bg-gray-400 hover:bg-gray-500 text-white rounded-full px-10 py-5 w-full">
    Predykcja
  </button>
  <button className="cursor-pointer bg-gray-400 hover:bg-gray-500 text-white rounded-full px-10 py-5 w-full">
    Własny model
  </button>
  <button className="cursor-pointer bg-gray-400 hover:bg-gray-500 text-white rounded-full px-10 py-5 w-full">
    Zapisz obrazvvvvvvvvv
  </button>
</div>

  {/* Right Panel: Instructions (always shown) */}
  <div className="p-4 flex-grow max-w-md overflow-auto">
    <div className="text-white text-base leading-relaxed space-y-2">
      <h2 className="font-semibold text-white">Instrukcja:</h2>
      <ol className="list-decimal list-inside">
        <li>Wybierz obraz z komputera</li>
        <li>Nanieś adnotacje na obraz rysując po nim</li>
        <li>Dokonaj predykcji przy użyciu przycisku predykcji</li>
        <li>
          Przy użyciu przycisku własny model możesz załadować na serwer własny
          model (musi zgadzać się on z dokumentacją)
        </li>
        <li>
          Zapisz obraz za pomocą przycisku. Wyświetli się okienko w którym należy
          wpisać dane pacjenta.
        </li>
        <li>W każdej chwili możesz załadować nowy obraz klikając wybierz plik</li>
      </ol>

      <div className="mt-4">
        <h3 className="font-semibold text-white">Skróty klawiszowe</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>zoom in - ctrl + z</li>
          <li>zoom out - ctrl + x</li>
          <li>undo - ctrl + v</li>
        </ul>
      </div>
    </div>
  </div>
</div>

    
  </div>
</div>

  );
};

export default DrawingCanvas;
