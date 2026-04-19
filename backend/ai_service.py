import uvicorn
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import torch
from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import io

app = FastAPI()

# Enable CORS for communication with Node.js backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Model
print("Loading CLIP model (openai/clip-vit-base-patch16)...", flush=True)
try:
    model = CLIPModel.from_pretrained("openai/clip-vit-base-patch16")
    processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch16")
    print("Model loaded successfully!", flush=True)
except Exception as e:
    print(f"CRITICAL ERROR: Failed to load model: {e}", flush=True)
    raise e

# Define our civic categories (labels for zero-shot classification)
# These should ideally describe the visual content clearly
CATEGORIES = [
    {"id": "roads", "label": "potholes, damaged roads, broken asphalt, road construction"},
    {"id": "water", "label": "water leakage, burst water pipe, water flooding from ground"},
    {"id": "garbage", "label": "garbage pile, overflowing trash bin, waste on street"},
    {"id": "sanitation", "label": "sewage overflow, open manhole, dirty drain, blocked sewer"},
    {"id": "streetlights", "label": "broken street light, dark street lamp, electrical post damage"},
    {"id": "other", "label": "general public issue, broken bench, noise, or stray animal"}
]

LABELS = [c["label"] for c in CATEGORIES]

@app.get("/")
def read_root():
    return {"message": "Spotfix AI Classification Service is Live"}

@app.post("/predict")
async def predict(image: UploadFile = File(...)):
    try:
        # Read and process image
        image_data = await image.read()
        img = Image.open(io.BytesIO(image_data)).convert("RGB")
        
        # Prepare inputs for CLIP
        inputs = processor(text=LABELS, images=img, return_tensors="pt", padding=True)
        
        # Inference
        with torch.no_grad():
            outputs = model(**inputs)
            logits_per_image = outputs.logits_per_image
            probs = logits_per_image.softmax(dim=1)
            
        # Get results
        confidences = probs[0].tolist()
        results = []
        for i, conf in enumerate(confidences):
            results.append({
                "id": CATEGORIES[i]["id"],
                "confidence": conf
            })
            
        # Sort by confidence
        results.sort(key=lambda x: x["confidence"], reverse=True)
        
        # Return top prediction and all scores
        return {
            "success": True,
            "prediction": results[0]["id"],
            "confidence": results[0]["confidence"],
            "all_scores": results
        }
        
    except Exception as e:
        print(f"Error during prediction: {e}")
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    print("Starting Spotfix AI Service on port 8000...", flush=True)
    uvicorn.run(app, host="0.0.0.0", port=8000)
