import keras.src.saving
from flask import Flask, request, jsonify, send_file
from PIL import Image
import io
import torch
from ultralytics import YOLO
import numpy as np
import os
import tempfile
import cv2
import torchvision.transforms as T



app = Flask(__name__)


model = YOLO("best.pt")

def annotate_image(igg, boxes, labels, scores, class_names):
    for i in scores:
        x1, y1, x2, y2 = boxes[i].int().numpy()
        class_name = class_names[labels[i].item() - 2]  # Get class name
        print(class_name)
        cv2.rectangle(igg, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(igg, class_name, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 1, cv2.LINE_AA)

    return igg


def load_model(file_path, file_type):
    if file_type == 'h5' or file_type == 'tf':
        return keras.src.saving.load_model(file_path)
    elif file_type == 'pth':
        return torch.load(file_path)
    else:
        raise ValueError("Unsupported file type")


def preprocess_image(image, model_type):
    # Convert the image to RGB (if not already) and preprocess accordingly
    image = Image.open(image).convert("RGB")
    if model_type == 'keras':
        image = image.resize((224, 224))  # Example resizing for Keras models
        image_array = np.array(image) / 255.0
        return np.expand_dims(image_array, axis=0)
    elif model_type == 'pytorch':
        image_tensor = torch.torch.to_tensor(image).unsqueeze(0)  # Add batch dimension
        return image_tensor
    else:
        raise ValueError("Unsupported model type")


@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    print("Got request")

    file = request.files['file']

    # Open the image using PIL
    image = Image.open(file)
    results = model.predict(image)
    # Perform inference with YOLOv5

    # Access the processed image (first result, assuming a single image input)
    annotated_img = results[0].plot()  # Returns an annotated image (numpy array)
    annotated_img = np.array(annotated_img)
    annotated_img = cv2.cvtColor(annotated_img, cv2.COLOR_BGR2RGB)




    # Convert the modified NumPy array back to a PIL image
    #image_with_boxes = Image.fromarray(results.ims[0])
    #image_with_boxes.show()

    # Save the image to an in-memory buffer
    buf = io.BytesIO()
    final = Image.fromarray(annotated_img)
    final.save(buf, format='JPEG')
    buf.seek(0)

    # Option 1: Return the image as a downloadable file
    return send_file(buf, mimetype='image/jpeg', as_attachment=True, download_name='predicted_image.jpg')



@app.route("/predict/own_model", methods=["POST"])
def predict_own_model():
    if 'model' not in request.files or 'image' not in request.files or 'class_names' not in request.files:
        return jsonify({'error': 'Model file, image, and script are required'}), 400

    model_file = request.files['model']
    image_file = request.files['image']
    class_names_file = request.files['class_names']

    # Save the model and script temporarily
    model_path = os.path.join(tempfile.gettempdir(), model_file.filename)
    print(model_path)
    class_path = os.path.join(tempfile.gettempdir(), class_names_file.filename)
    print(class_path)
    image_path = os.path.join(tempfile.gettempdir(), image_file.filename)
    print(image_path)
    image_file.save(image_path)
    model_file.save(model_path)
    class_names_file.save(class_path)

    # Determine model type
    if not model_file.filename.endswith("pt"):
        return jsonify({'error': "bad model"}), 400

    try:
        model_temp = torch.load(model_path)
    except:
        return jsonify({'error': "bad model"}), 400



    ### GET classess
    with open(class_path) as f:
        names = f.readlines()

    image = Image.open(image_path).convert("RGB")
    transform = T.ToTensor()
    img = transform(image)
    model_temp.eval()
    with torch.no_grad():
        pred = model_temp(img.unsqueeze(0))

    boxes = pred[0]["boxes"]
    labels = pred[0]["labels"]
    scores = pred[0]["scores"]

    igg = np.array(image)
    igg = cv2.cvtColor(igg, cv2.COLOR_RGB2BGR)  # Convert RGB to BGR for OpenCV
    # Filter predictions with confidence > 0.8
    threshold = 0.8
    high_conf_indices = torch.nonzero(scores > threshold).flatten()
    annotated_image = annotate_image(igg, boxes,labels, high_conf_indices, names)
    annotated_image = cv2.cvtColor(igg, cv2.COLOR_BGR2RGB)
    # Return the image as a response
    img_io = io.BytesIO()
    final = Image.fromarray(annotated_image)
    final.save(img_io, 'JPEG')
    img_io.seek(0)
    return send_file(img_io, mimetype='image/jpeg', as_attachment=True, download_name='predicted_image.jpg')



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)