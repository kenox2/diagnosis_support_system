import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import Draggable from 'react-draggable';
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

  const [model, setModel] = useState(null)
  const [classes, setClasses] = useState(null)
  const [isModel, setIsModel] = useState(false);
  const [imageFile, setImageFile] = useState(null);

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

  const [showPredictionPopup, setShowPredictionPopup] = useState(false);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [showModelPopup, setShowModelPopup] = useState(false);

  var canvasHeight = 700;
  var canvasWidth = 800;

  useEffect(() => {
    var fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: '#ffffff',
    });

    fabricCanvas.isDrawingMode = true;
    fabricCanvas.freeDrawingBrush.width = brushSize;
    fabricCanvas.freeDrawingBrush.color = '#000000';
    fabricCanvasRef.current = fabricCanvas;

    var handleKeyDown = (e) => {
      if(e.ctrlKey || e.metaKey){
        if (e.key === 'z') {
          zoomIn(e);
        } else if (e.key === 'x') {
          resetZoom();
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
    if (!canvas) return;
    canvas.setZoom(1);
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    canvas.renderAll();
  }

  function undoDrawing() {
    const canvas = fabricCanvasRef.current;
    const objects = canvas.getObjects();
    if(objects.length > 0){
      canvas.remove(objects[objects.length - 1]);
      canvas.renderAll();
    }
  };

  const zoomIn = (e) => {
    const canvas = fabricCanvasRef.current;
    const pointer = canvas.getPointer(e);
    const mouseX = pointer.x;
    const mouseY = pointer.y;
    const currentZoom = canvas.getZoom();

    if (currentZoom * SCALE_FACTOR > ZOOM_MAX) return;

    const newZoom = currentZoom * SCALE_FACTOR;
    canvas.setZoom(newZoom);

    const deltaX = mouseX - canvas.viewportTransform[4];
    const deltaY = mouseY - canvas.viewportTransform[5];

    const newLeft = mouseX - deltaX * SCALE_FACTOR;
    const newTop = mouseY - deltaY * SCALE_FACTOR;

    canvas.setViewportTransform([
      newZoom, 0, 0, newZoom, newLeft, newTop
    ]);

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

        <div className="flex w-full flex-grow gap-4 relative">
          <div className="p-4 flex-grow-[3] flex items-center justify-start relative">
            <canvas
              ref={canvasRef}
              style={{
                border: '1px solid black',
                
              }}
            ></canvas>
          </div>

          <div className="p-4 flex flex-col items-start justify-center h-full gap-12 w-60 mt-8 ml-6">
            <InputImage
              fabricCanvasRef={fabricCanvasRef}
              setUploadedImage={setUploadedImage}
              setImageFile={setImageFile}
            />

            <PredictionButton 
              setPredictedImage={setPredictedImage}
              uploadedImage={uploadedImage}
              model={model}
              classes={classes}
              isModel={isModel}
              imageFile={imageFile}
              setShowPredictionPopup={setShowPredictionPopup}
              fabricCanvasRef={fabricCanvasRef}
            />
            <button onClick={() => setShowModelPopup(true)} className="cursor-pointer bg-gray-400 hover:bg-gray-500 text-white rounded-full px-10 py-5 w-full">
              Własny model
            </button>
            <button onClick={() => setShowSavePopup(true)} className="cursor-pointer bg-gray-400 hover:bg-gray-500 text-white rounded-full px-10 py-5 w-full">
              Zapisz obraz
            </button>
          </div>

          <div className="p-4 flex-grow max-w-md overflow-auto">
            <div className="text-white text-base leading-relaxed space-y-2">
              <h2 className="font-semibold text-white">Instrukcja:</h2>
              <ol className="list-decimal list-inside">
                <li>Wybierz obraz z komputera</li>
                <li>Nanieś adnotacje na obraz rysując po nim</li>
                <li>Dokonaj predykcji przy użyciu przycisku predykcji</li>
                <li>Załaduj własny model jeśli chcesz użyć innego</li>
                <li>Zapisz obraz, podając dane pacjenta</li>
                <li>Możesz załadować nowy obraz klikając wybierz plik</li>
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

          {/* Prediction Popup */}

          {showPredictionPopup && (
            <Draggable>
              <div className="fixed top-20 right-10 bg-white shadow-lg rounded-lg p-4 z-50 cursor-move">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold">Wynik predykcji</h3>
                  <button onClick={() => setShowPredictionPopup(false)} className="text-red-500 font-bold">X</button>
                </div>
                <img
                  src={predictedImage}
                  alt="Prediction Result"
                  className="object-contain"
                  style={{ maxWidth: '90vw', maxHeight: '80vh' }}
                />
              </div>
            </Draggable>
          )}

          {/* Save Popup */}
          {showSavePopup && (
            <Draggable>
              <div className="fixed top-40 right-10 w-96 bg-white shadow-lg rounded-lg p-6 flex flex-col z-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Zapis obrazu</h3>
                  <button onClick={() => setShowSavePopup(false)} className="text-red-500 font-bold">X</button>
                </div>
                <InputSpace
                  firstNameRef={firstNameRef}
                  lastNameRef={lastNameRef}
                  ageRef={ageRef}
                  descriptionRef={descriptionRef}
                  fabricCanvasRef={fabricCanvasRef}
                />
              </div>
          </Draggable>
        )}

          {/* Own Model Popup */}
          {showModelPopup && (
            <div className="fixed top-60 right-10 w-96 bg-white shadow-lg rounded-lg p-6 flex flex-col z-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Własny model</h3>
                <button onClick={() => setShowModelPopup(false)} className="text-red-500 font-bold">X</button>
              </div>
              <OwnModel
                setModel={setModel}
                setClasses={setClasses}
                isModel={isModel}
                setIsModel={setIsModel}
                
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default DrawingCanvas;
