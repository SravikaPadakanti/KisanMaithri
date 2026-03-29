"""
KisanMaithri v3 — Agricultural Advisory Agent
Fixes: real disease detection, soil report OCR, multilingual everywhere,
       compliance guardrails, offline mode, explainability
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os, json, tempfile, random, time, requests, base64, re
from datetime import datetime

app = Flask(__name__)
CORS(app)

# ── Feature flags ──────────────────────────────────────────────────────────────
WHISPER_AVAILABLE = False
LLAMA_CPP_AVAILABLE = False
ML_AVAILABLE = False
OCR_AVAILABLE = False
disease_model = None
disease_model_38 = None
USE_38_CLASS = False
YIELD_MODEL = None

try:
    import whisper
    WHISPER_MODEL = whisper.load_model("base")
    WHISPER_AVAILABLE = True
    print("✅ Whisper loaded")
except Exception as e:
    print(f"⚠️  Whisper: {e}")

try:
    from llama_cpp import Llama
    LLAMA_MODEL_PATH = os.environ.get("LLAMA_MODEL_PATH", "./models/Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf")
    if os.path.exists(LLAMA_MODEL_PATH):
        llm = Llama(model_path=LLAMA_MODEL_PATH, n_ctx=2048, n_threads=4, verbose=False)
        LLAMA_CPP_AVAILABLE = True
        print("✅ Llama 3.1 8B loaded")
    else:
        print(f"⚠️  GGUF not found — run download_models.py")
except Exception as e:
    print(f"⚠️  llama-cpp: {e}")

try:
    import numpy as np
    import tensorflow as tf
    ML_AVAILABLE = True
    try:
        model_path = "model_saved"
        if os.path.exists(model_path):
            disease_model = tf.keras.models.load_model(model_path)
            print("✅ 4-class disease model loaded")
    except Exception as me:
        try:
            from keras.layers import TFSMLayer
            disease_model = TFSMLayer(model_path, call_endpoint="serving_default")
            print("✅ 4-class model (TFSMLayer) loaded")
        except Exception as me2:
            print(f"⚠️  4-class model: {me2}")
    try:
        vgg_path = "./models/plant_disease_vgg13.h5"
        if os.path.exists(vgg_path):
            disease_model_38 = tf.keras.models.load_model(vgg_path)
            USE_38_CLASS = True
            print("✅ 38-class VGG13 loaded")
    except Exception as ve:
        print(f"⚠️  VGG13: {ve}")
except Exception as e:
    print(f"⚠️  TensorFlow: {e}")

try:
    import joblib
    yp = "./models/crop_yield_model.pkl"
    if os.path.exists(yp):
        YIELD_MODEL = joblib.load(yp)
        print("✅ Yield model loaded")
except Exception as e:
    print(f"⚠️  Yield model: {e}")

try:
    import pytesseract
    from PIL import Image
    import PyPDF2
    OCR_AVAILABLE = True
    print("✅ OCR available")
except Exception as e:
    print(f"⚠️  OCR: {e}")

# ── Static data ────────────────────────────────────────────────────────────────
CLASS_NAMES_4 = {0:"Tomato Target Spot",1:"Tomato Mosaic Virus",2:"Tomato Yellow Leaf Curl Virus",3:"Tomato Healthy"}

CLASS_NAMES_38 = {
    0:"Apple Apple_scab",1:"Apple Black_rot",2:"Apple Cedar_apple_rust",3:"Apple healthy",
    4:"Blueberry healthy",5:"Cherry Powdery_mildew",6:"Cherry healthy",
    7:"Corn Cercospora_leaf_spot",8:"Corn Common_rust",9:"Corn Northern_Leaf_Blight",10:"Corn healthy",
    11:"Grape Black_rot",12:"Grape Esca",13:"Grape Leaf_blight",14:"Grape healthy",
    15:"Orange Haunglongbing",16:"Peach Bacterial_spot",17:"Peach healthy",
    18:"Pepper Bacterial_spot",19:"Pepper healthy",
    20:"Potato Early_blight",21:"Potato Late_blight",22:"Potato healthy",
    23:"Raspberry healthy",24:"Soybean healthy",25:"Squash Powdery_mildew",
    26:"Strawberry Leaf_scorch",27:"Strawberry healthy",
    28:"Tomato Bacterial_spot",29:"Tomato Early_blight",30:"Tomato Late_blight",
    31:"Tomato Leaf_Mold",32:"Tomato Septoria_leaf_spot",33:"Tomato Spider_mites",
    34:"Tomato Target_Spot",35:"Tomato Yellow_Leaf_Curl_Virus",36:"Tomato mosaic_virus",37:"Tomato healthy"
}

DISEASE_RECS = {
    "Tomato Target_Spot":["Remove infected leaves immediately","Apply chlorothalonil fungicide every 7 days","Avoid overhead irrigation","Improve air circulation between plants"],
    "Tomato mosaic_virus":["Remove and destroy infected plants","Control aphid vectors with neem spray","Use certified virus-free seeds next season","Disinfect all tools with bleach solution"],
    "Tomato Yellow_Leaf_Curl_Virus":["Control whitefly with yellow sticky traps","Use reflective silver mulch","Remove and burn affected plants","Use resistant hybrid varieties next season"],
    "Tomato Early_blight":["Apply mancozeb fungicide at 2.5g per litre","Remove lower infected leaves","Avoid wetting foliage during irrigation","Rotate crops next season"],
    "Tomato Late_blight":["Apply metalaxyl fungicide IMMEDIATELY","Remove all infected plant material","Avoid overhead irrigation","Monitor neighbouring fields"],
    "Tomato Bacterial_spot":["Apply copper-based bactericide (Bordeaux mixture)","Use disease-free certified seed","Avoid working in wet field","Maintain proper plant spacing"],
    "Tomato Leaf_Mold":["Improve greenhouse ventilation","Apply copper fungicide","Reduce humidity below 85%","Remove infected lower leaves"],
    "Tomato Septoria_leaf_spot":["Apply chlorothalonil or mancozeb","Remove infected leaves at base","Avoid overhead watering","Mulch around plants"],
    "Tomato Spider_mites":["Apply miticide or neem oil spray (5ml per litre)","Increase humidity around plants","Remove heavily infested leaves","Spray undersides of leaves"],
    "Corn Common_rust":["Apply propiconazole foliar fungicide","Plant resistant varieties next season","Monitor early in season","Remove severely infected plants"],
    "Corn Northern_Leaf_Blight":["Apply azoxystrobin fungicide","Use resistant hybrid seeds","Practice crop rotation","Avoid excessive nitrogen"],
    "Potato Early_blight":["Apply chlorothalonil or mancozeb","Ensure proper potassium nutrition","Practice crop rotation","Remove infected tubers"],
    "Potato Late_blight":["Apply systemic fungicide metalaxyl immediately","Destroy all infected tissue","Avoid overhead irrigation","Harvest early if widespread"],
    "Apple Apple_scab":["Apply captan fungicide during wet periods","Rake and dispose fallen leaves","Prune for better air circulation","Use scab-resistant varieties"],
    "Grape Black_rot":["Apply mancozeb or myclobutanil","Remove mummified berries from vine","Improve air circulation by pruning","Avoid overhead irrigation"],
    "healthy":["Continue regular monitoring every 3-5 days","Maintain proper irrigation schedule","Apply balanced NPK fertilizer as scheduled","Keep field weed-free"],
    "default":["Consult local Krishi Vigyan Kendra toll-free 1800-180-1551","Apply general broad-spectrum fungicide as precaution","Isolate affected plants from healthy ones","Take a leaf sample to KVK for free laboratory test"]
}

BANNED_PESTICIDES = ["endosulfan","methyl parathion","monocrotophos","chlorpyrifos","lindane","phorate","aldicarb","carbofuran","ddt","aldrin","dieldrin","heptachlor","mirex","toxaphene"]

MSP_2024 = {"wheat":2275,"rice":2300,"paddy":2300,"maize":2090,"bajra":2625,"jowar":3371,"cotton":7521,"groundnut":6783,"soybean":4892,"sunflower":7280,"mustard":5650,"lentil":6425,"gram":5440,"arhar":7000,"moong":8682,"urad":7400,"sugarcane":340}

OFFLINE_PRICES = {
    "tomato":{"price":1800,"trend":"rising","mandi":"Kurnool"},
    "rice":{"price":2350,"trend":"stable","mandi":"Warangal"},
    "wheat":{"price":2300,"trend":"stable","mandi":"Hyderabad"},
    "cotton":{"price":7600,"trend":"falling","mandi":"Guntur"},
    "maize":{"price":2100,"trend":"rising","mandi":"Nizamabad"},
    "groundnut":{"price":6900,"trend":"stable","mandi":"Anantapur"},
    "onion":{"price":1200,"trend":"falling","mandi":"Kurnool"},
    "chilli":{"price":12000,"trend":"rising","mandi":"Guntur"},
    "turmeric":{"price":15000,"trend":"rising","mandi":"Nizamabad"},
    "soybean":{"price":4950,"trend":"stable","mandi":"Adilabad"},
    "potato":{"price":1100,"trend":"stable","mandi":"Hyderabad"},
    "cabbage":{"price":800,"trend":"falling","mandi":"Kurnool"}
}

GOVT_SCHEMES = {
    "PM-KISAN":"Rs 6000 per year income support in 3 instalments — apply at pmkisan.gov.in or nearest CSC",
    "PMFBY":"Pradhan Mantri Fasal Bima Yojana — crop insurance at subsidised premium — contact your bank or district agriculture office",
    "KCC":"Kisan Credit Card — crop loan up to Rs 3 lakh at 4% interest — apply at any nationalised bank",
    "eNAM":"National Agriculture Market — sell online at better prices — register at enam.gov.in",
    "Soil Health Card":"Free soil testing and personalised fertiliser recommendation — visit nearest KVK",
    "PM-KUSUM":"Solar pump subsidy 60% — apply at district agriculture office"
}

weather_cache = {}

SYSTEM_PROMPT = """You are KisanMaithri, an expert agricultural advisor for Indian farmers specialising in Telangana and Andhra Pradesh.
Rules:
1. Give practical 3-4 sentence advice focused on the specific crop and problem.
2. Immediately warn if any chemical mentioned is banned in India by CIB&RC.
3. Mention relevant government schemes (PM-KISAN, PMFBY, KCC, eNAM) when applicable.
4. Always recommend Krishi Vigyan Kendra (KVK, toll-free 1800-180-1551) for lab-level diagnosis.
5. Mention MSP when discussing selling crops.
6. Keep language simple and practical.
7. Never recommend endosulfan, monocrotophos, chlorpyrifos, or other banned pesticides.
8. Always add: This is advisory only. Consult your local KVK for critical decisions."""

# ── Helpers ────────────────────────────────────────────────────────────────────
def translate_msg(text, target):
    if not text or target == "en":
        return text
    try:
        from deep_translator import GoogleTranslator
        if len(text) <= 4500:
            return GoogleTranslator(source='auto', target=target).translate(text)
        chunks = [text[i:i+4500] for i in range(0, len(text), 4500)]
        return " ".join(GoogleTranslator(source='auto', target=target).translate(c) for c in chunks)
    except Exception as e:
        print(f"Translation error: {e}")
        return text

def check_guardrails(query, advice=""):
    combined = (query + " " + advice).lower()
    warnings = []
    blocked = []
    for p in BANNED_PESTICIDES:
        if p in combined:
            blocked.append(f"BANNED: {p.title()} is banned in India by Central Insecticides Board. Do NOT use. Use neem-based alternatives.")
    crop_hit = next((c for c in MSP_2024 if c in combined), None)
    if crop_hit and any(w in combined for w in ["sell","price","msp","market","rate","mandi"]):
        warnings.append(f"MSP 2024-25 for {crop_hit.title()}: Rs {MSP_2024[crop_hit]} per quintal. Sell at govt procurement centre for guaranteed price.")
    if any(w in combined for w in ["loan","kcc","credit"]):
        warnings.append(GOVT_SCHEMES["KCC"])
    if any(w in combined for w in ["insurance","pmfby","fasal bima"]):
        warnings.append(GOVT_SCHEMES["PMFBY"])
    return {"warnings": blocked + warnings, "compliant": len(blocked) == 0, "has_banned": len(blocked) > 0}

def generate_advice(query, soil_ctx=None, weather_ctx=None):
    context = ""
    if soil_ctx:
        context += f"[Farm: N={soil_ctx.get('N','?')} P={soil_ctx.get('P','?')} K={soil_ctx.get('K','?')} pH={soil_ctx.get('pH','?')}] "
    if weather_ctx:
        context += f"[Weather: {weather_ctx.get('temperature','?')}C] "
    full_query = context + query
    if LLAMA_CPP_AVAILABLE:
        try:
            prompt = f"<|system|>\n{SYSTEM_PROMPT}\n<|user|>\n{full_query}\n<|assistant|>\n"
            out = llm(prompt, max_tokens=300, stop=["<|user|>","<|system|>"])
            return out["choices"][0]["text"].strip()
        except Exception as e:
            print(f"LlamaCPP error: {e}")
    try:
        import ollama
        r = ollama.generate(model='llama3.2:1b', prompt=f"{SYSTEM_PROMPT}\n\nQuestion: {full_query}\nAnswer:")
        return r['response'].strip()
    except:
        pass
    q = query.lower()
    if any(w in q for w in ["disease","spot","yellow","curl","virus","blight","mold","rust","wilt"]):
        return "Crop disease detected. Remove infected leaves immediately and avoid overhead irrigation. Apply appropriate fungicide — visit nearest Krishi Vigyan Kendra (KVK) toll-free 1800-180-1551. PMFBY crop insurance may cover disease losses — contact your bank. This is advisory only. Consult your local KVK for critical decisions."
    if any(w in q for w in ["water","irrigation","dry","drought"]):
        return "For water stress, irrigate at root zone using drip method to save 30% water. PM-KUSUM scheme provides solar pump subsidy — apply at your district agriculture office. This is advisory only. Consult your local KVK for critical decisions."
    if any(w in q for w in ["fertilizer","manure","npk","urea","soil","nutrient"]):
        return "Get soil tested at nearest KVK (free service) before applying fertilizer. Use neem-coated urea to improve nitrogen efficiency by 10-15%. This is advisory only. Consult your local KVK for critical decisions."
    if any(w in q for w in ["price","market","sell","msp","rate","mandi"]):
        return "Sell at APMC mandi or e-NAM for best price. Check MSP on agmarknet.gov.in before selling. Consider joining a Farmer Producer Organisation for better bargaining power. This is advisory only. Consult your local KVK for critical decisions."
    if any(w in q for w in ["pest","insect","bug","worm","aphid","whitefly"]):
        return "Start with neem oil spray (4ml per litre water) as organic first step. Avoid endosulfan and monocrotophos — BANNED in India. Contact KVK toll-free 1800-180-1551 for safe pesticide guidance. This is advisory only. Consult your local KVK for critical decisions."
    return "Please describe your crop, the problem you see, and your soil type. Upload a leaf photo for AI disease detection. Contact KVK toll-free 1800-180-1551 for local expert guidance. This is advisory only. Consult your local KVK for critical decisions."

def get_weather(lat, lon):
    key = f"{round(lat,1)},{round(lon,1)}"
    now = time.time()
    if key in weather_cache:
        ts, d = weather_cache[key]
        if now - ts < 3600:
            d["source"] = "cache"; return d
    try:
        url = (f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}"
               f"&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum"
               f"&timezone=Asia%2FKolkata&forecast_days=7")
        r = requests.get(url, timeout=5).json()
        d = {"temperature":r["current_weather"]["temperature"],"windspeed":r["current_weather"]["windspeed"],
             "daily_max":r["daily"]["temperature_2m_max"],"daily_min":r["daily"]["temperature_2m_min"],
             "precipitation":r["daily"]["precipitation_sum"],"source":"live"}
        weather_cache[key] = (now, d)
        return d
    except:
        return {"temperature":32.0,"windspeed":12.0,"daily_max":[33,34,33,35,34,32,33],"daily_min":[24,23,25,24,23,22,23],"precipitation":[0,0,2,5,0,0,0],"source":"offline_default"}

def parse_soil_from_text(text):
    result = {}
    patterns = {
        "pH": r"pH[:\s=]+([0-9]+\.?[0-9]*)",
        "N": r"(?:Nitrogen|Avail\.?\s*N|Available N)[:\s=]+([0-9]+\.?[0-9]*)",
        "P": r"(?:Phosphorus|Avail\.?\s*P|P2O5)[:\s=]+([0-9]+\.?[0-9]*)",
        "K": r"(?:Potassium|Avail\.?\s*K|K2O)[:\s=]+([0-9]+\.?[0-9]*)",
        "OC": r"(?:Organic Carbon|OC)[:\s=]+([0-9]+\.?[0-9]*)",
        "EC": r"EC[:\s=]+([0-9]+\.?[0-9]*)",
    }
    for key, pattern in patterns.items():
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            try:
                result[key] = float(match.group(1))
            except:
                pass
    return result

# ── Routes ─────────────────────────────────────────────────────────────────────
@app.route("/")
def home():
    return jsonify({"status":"KisanMaithri v3","whisper":WHISPER_AVAILABLE,"llama":LLAMA_CPP_AVAILABLE,"ml":ML_AVAILABLE,"ocr":OCR_AVAILABLE,"disease_38class":USE_38_CLASS})

@app.route("/health")
def health():
    return jsonify({"status":"ok","timestamp":datetime.utcnow().isoformat(),"whisper":WHISPER_AVAILABLE,"llama":LLAMA_CPP_AVAILABLE,"ml":ML_AVAILABLE,"ocr":OCR_AVAILABLE})

@app.route("/transcribe", methods=["POST"])
def transcribe():
    if not WHISPER_AVAILABLE:
        return jsonify({"transcript":"","language":"en","error":"Whisper not installed","fallback":"browser_stt"}),200
    if "audio" not in request.files:
        return jsonify({"error":"No audio file"}),400
    try:
        f = request.files["audio"]
        with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
            f.save(tmp.name)
            result = WHISPER_MODEL.transcribe(tmp.name, task="transcribe")
            os.unlink(tmp.name)
        return jsonify({"transcript":result["text"].strip(),"language":result["language"]})
    except Exception as e:
        return jsonify({"error":str(e)}),500

@app.route("/get-advice", methods=["POST"])
def get_advice():
    data = request.json or {}
    user_text = data.get("message","")
    user_lang = data.get("lang","en")
    soil = data.get("soil",{})
    weather_ctx = data.get("weather",{})
    eng = translate_msg(user_text,"en") if user_lang != "en" else user_text
    answer_en = generate_advice(eng, soil_ctx=soil, weather_ctx=weather_ctx)
    guardrail = check_guardrails(eng, answer_en)
    final = translate_msg(answer_en, user_lang) if user_lang != "en" else answer_en
    translated_warnings = [translate_msg(w, user_lang) if user_lang != "en" else w for w in guardrail.get("warnings",[])]
    return jsonify({
        "answer": final,
        "answer_en": answer_en,
        "lang_code": f"{user_lang}-IN",
        "guardrails": {**guardrail,"warnings":translated_warnings},
        "explanation": {
            "model_used": "llama3.1-8b" if LLAMA_CPP_AVAILABLE else "rule_based",
            "soil_context_used": bool(soil),
            "disclaimer": translate_msg("Advisory only. Consult your local Krishi Vigyan Kendra for critical decisions.", user_lang)
        }
    })

@app.route("/detect", methods=["POST"])
def detect():
    lang = request.form.get("lang","en")
    if "image" not in request.files:
        return jsonify({"error":"No image uploaded"}),400
    try:
        import numpy as np
        from PIL import Image as PILImage
        f = request.files["image"]
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            f.save(tmp.name)
            pil_img = PILImage.open(tmp.name)
            width, height = pil_img.size
            if width < 50 or height < 50:
                os.unlink(tmp.name)
                return jsonify({"error":"low_quality","message":translate_msg("Image too small. Please upload a clear close-up photo of the leaf in daylight.",lang)}),200
            img_resized = pil_img.resize((224,224))
            arr = np.expand_dims(np.array(img_resized)/255.0,0)
            os.unlink(tmp.name)

        if not ML_AVAILABLE or (disease_model is None and not USE_38_CLASS):
            cid = random.choices(list(CLASS_NAMES_4.keys()),weights=[15,15,15,55],k=1)[0]
            dn = CLASS_NAMES_4[cid]
            conf = round(random.uniform(0.72,0.91),3)
            recs = DISEASE_RECS.get(dn.replace(" ","_"),DISEASE_RECS["default"])
            return jsonify({
                "class_id":cid,"disease":dn,"confidence":conf,"confidence_pct":f"{conf*100:.1f}%",
                "recommendations":[translate_msg(r,lang) for r in recs[:4]],
                "guardrails":check_guardrails(dn," ".join(recs)),
                "note":"SIMULATION_MODE",
                "explanation":{"model":"simulation","disclaimer":translate_msg("Advisory only. Consult KVK toll-free 1800-180-1551.",lang)}
            })

        if USE_38_CLASS and disease_model_38 is not None:
            preds = disease_model_38.predict(arr)
            cid = int(np.argmax(preds)); conf = float(np.max(preds))
            dn = CLASS_NAMES_38.get(cid,"Unknown")
        else:
            output = disease_model(arr)
            if isinstance(output,dict): preds = list(output.values())[0]
            else: preds = output
            if hasattr(preds,'numpy'): preds = preds.numpy()
            cid = int(np.argmax(preds)); conf = float(np.max(preds))
            dn = CLASS_NAMES_4.get(cid,"Unknown")

        if conf < 0.45:
            return jsonify({
                "error":"low_confidence","confidence":round(conf,3),
                "message":translate_msg(f"Image quality insufficient ({conf*100:.0f}% confidence). Retake in natural daylight with leaf filling the frame.",lang),
                "suggestion":translate_msg("Tip: Use daylight, hold phone 15-20cm from leaf, keep camera steady.",lang)
            }),200

        key = dn.replace(" ","_")
        recs = DISEASE_RECS.get(key, DISEASE_RECS.get("healthy" if "healthy" in dn.lower() else "default"))
        guardrail = check_guardrails(dn," ".join(recs))
        warning_msg = ""
        if conf < 0.70:
            warning_msg = translate_msg(f"Low confidence ({conf*100:.0f}%). Consult KVK (1800-180-1551) before acting.",lang)
        return jsonify({
            "class_id":cid,"disease":dn,"confidence":round(conf,3),"confidence_pct":f"{conf*100:.1f}%",
            "recommendations":[translate_msg(r,lang) for r in recs[:4]],
            "guardrails":guardrail,"low_confidence_warning":warning_msg,
            "explanation":{
                "model":"38-class VGG13" if USE_38_CLASS else "4-class CNN",
                "crop_detected":dn.split(" ")[0] if " " in dn else dn,
                "condition":dn.split(" ",1)[1] if " " in dn else "Unknown",
                "disclaimer":translate_msg("Advisory only. Consult KVK toll-free 1800-180-1551.",lang)
            }
        })
    except Exception as e:
        return jsonify({"error":str(e)}),500

@app.route("/parse-soil-report", methods=["POST"])
def parse_soil_report():
    lang = request.form.get("lang","en")
    extracted_text = ""
    method_used = "none"

    if "report" in request.files:
        f = request.files["report"]
        fname = f.filename.lower()
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(fname)[1] or ".jpg") as tmp:
            f.save(tmp.name)
            if fname.endswith(".pdf"):
                if OCR_AVAILABLE:
                    try:
                        import PyPDF2
                        reader = PyPDF2.PdfReader(tmp.name)
                        extracted_text = " ".join(page.extract_text() or "" for page in reader.pages)
                        method_used = "pdf_text"
                    except Exception as pe:
                        print(f"PDF error: {pe}")
                if not extracted_text.strip() and OCR_AVAILABLE:
                    try:
                        import pytesseract
                        from PIL import Image as PILImage
                        img = PILImage.open(tmp.name)
                        extracted_text = pytesseract.image_to_string(img, lang='eng')
                        method_used = "pdf_ocr"
                    except:
                        pass
            else:
                if OCR_AVAILABLE:
                    try:
                        import pytesseract
                        from PIL import Image as PILImage
                        img = PILImage.open(tmp.name)
                        extracted_text = pytesseract.image_to_string(img, lang='eng')
                        method_used = "image_ocr"
                    except Exception as oe:
                        print(f"OCR error: {oe}")
                        method_used = "no_ocr"
                else:
                    method_used = "no_ocr"
            os.unlink(tmp.name)

    soil_vals = parse_soil_from_text(extracted_text)

    if not soil_vals and not extracted_text.strip():
        if not OCR_AVAILABLE:
            msg = "OCR not installed on server. Install pytesseract and Tesseract-OCR. Enter soil values manually below."
        else:
            msg = "Could not extract values from this image. Please enter values manually."
        return jsonify({"success":False,"message":translate_msg(msg,lang),"manual_entry_required":True,"method":method_used})

    N = soil_vals.get("N",80); P = soil_vals.get("P",40); K = soil_vals.get("K",40)
    pH = soil_vals.get("pH",6.5); OC = soil_vals.get("OC",0.5)
    recs = []; alerts = []
    if pH < 5.5:
        recs.append(translate_msg("Apply agricultural lime 2-3 tonnes per hectare to raise pH",lang))
        alerts.append(translate_msg(f"Soil is very acidic (pH {pH}) — nutrients unavailable to plants",lang))
    elif pH > 7.5:
        recs.append(translate_msg("Apply gypsum or sulphur 500kg per hectare to lower pH",lang))
        alerts.append(translate_msg(f"Soil is alkaline (pH {pH}) — iron and zinc deficiency likely",lang))
    if N < 50: recs.append(translate_msg(f"Apply urea 100kg per hectare — nitrogen is low ({N} kg/ha)",lang))
    if P < 25: recs.append(translate_msg("Apply Single Superphosphate SSP 250kg per hectare",lang))
    if K < 30: recs.append(translate_msg("Apply Muriate of Potash MOP 100kg per hectare",lang))
    if OC < 0.5: alerts.append(translate_msg("Very low organic carbon — add farmyard manure 5-10 tonnes per hectare",lang))
    suitable_crops = []
    if 5.5 <= pH <= 7.0 and N >= 60: suitable_crops.extend(["Rice","Maize","Tomato","Chilli","Groundnut"])
    if pH >= 6.5 and N >= 80: suitable_crops.extend(["Wheat","Soybean"])
    if pH <= 6.5: suitable_crops.extend(["Cotton","Turmeric"])
    score = min(100,int((N/120+P/60+K/40)/3*100*(1 if 5.5<=pH<=7.0 else 0.8)))
    return jsonify({
        "success":True,"method":method_used,"extracted_values":soil_vals,
        "raw_text_preview":extracted_text[:300] if extracted_text else "",
        "recommendations":recs,"alerts":alerts,"suitable_crops":list(set(suitable_crops))[:6],
        "soil_health_score":score,
        "message":translate_msg(f"Extracted {len(soil_vals)} soil parameters from your report.",lang)
    })

@app.route("/soil-analysis", methods=["POST"])
def soil_analysis():
    data = request.json or {}
    lang = data.get("lang","en")
    N=data.get("N",80); P=data.get("P",40); K=data.get("K",40)
    pH=data.get("pH",6.5); moisture=data.get("moisture",60)
    recs=[]; alerts=[]
    if pH<5.5:
        recs.append({"type":"amendment","action":"Apply agricultural lime 2-3 t/ha to raise pH to 6.0-6.5","priority":"high"})
        alerts.append("Soil acidic (pH<5.5) — nutrients unavailable")
    elif pH>7.5:
        recs.append({"type":"amendment","action":"Apply gypsum or sulphur 500kg/ha to lower pH","priority":"medium"})
        alerts.append("Soil alkaline (pH>7.5) — iron and zinc deficiency likely")
    if N<50: recs.append({"type":"fertilizer","action":f"Apply urea at 100kg/ha (deficit: {max(0,80-N)}kg N/ha)","priority":"high"})
    if P<25: recs.append({"type":"fertilizer","action":"Apply Single Superphosphate (SSP) at 250kg/ha","priority":"medium"})
    if K<30: recs.append({"type":"fertilizer","action":"Apply Muriate of Potash (MOP) at 100kg/ha","priority":"medium"})
    crops=[]
    if 5.5<=pH<=7.0 and N>=60 and moisture>=50: crops.extend(["Rice","Maize","Tomato","Chilli","Groundnut"])
    if pH>=6.5 and N>=80: crops.extend(["Wheat","Soybean"])
    if pH<=6.5: crops.extend(["Cotton","Turmeric"])
    score=min(100,int((N/120+P/60+K/40)/3*100*(1 if 5.5<=pH<=7.0 else 0.8)))
    if lang != "en":
        recs = [{"type":r["type"],"action":translate_msg(r["action"],lang),"priority":r["priority"]} for r in recs]
        alerts = [translate_msg(a,lang) for a in alerts]
    return jsonify({
        "soil_health_score":score,"recommendations":recs,"suitable_crops":list(set(crops))[:6],
        "alerts":alerts,
        "fertilizer_schedule":{
            "basal":translate_msg("50% N + full P + full K before planting",lang),
            "top_dress_1":translate_msg("25% N at tillering (21 days after planting)",lang),
            "top_dress_2":translate_msg("25% N at panicle initiation (45-50 days after planting)",lang)
        },
        "explanation":{"pH_status":"optimal" if 5.5<=pH<=7.0 else ("acidic" if pH<5.5 else "alkaline"),"N_status":"adequate" if N>=80 else ("low" if N<50 else "moderate")}
    })

@app.route("/predict-yield", methods=["POST"])
def predict_yield():
    data = request.json or {}
    lang = data.get("lang","en")
    feats = [data.get("nitrogen",80),data.get("phosphorus",40),data.get("potassium",40),data.get("ph",6.5),data.get("temperature",28),data.get("humidity",65),data.get("rainfall",800)]
    pred = None
    if YIELD_MODEL:
        try:
            import numpy as np
            pred = float(YIELD_MODEL.predict([feats])[0])
        except: pass
    if pred is None:
        N,P,K,pH,temp,hum,rain = feats
        ph_f = 1.0 if 5.5<=pH<=7.0 else 0.85
        nut_f = min((N/120+P/60+K/40)/3,1.2)
        cli_f = 1.0 if 20<=temp<=35 and hum>=50 else 0.9
        pred = round(data.get("base_yield",60)*ph_f*nut_f*cli_f,1)
    area=data.get("area",1); unit=data.get("unit","acres")
    ha = area*0.4047 if unit=="acres" else area
    crop = data.get("crop","rice").lower()
    typical = {"rice":3.5,"wheat":3.2,"maize":5.0,"cotton":1.8,"tomato":25.0}.get(crop,3.0)
    prod = round((pred/100)*typical*ha,2)
    mp = OFFLINE_PRICES.get(crop,{}).get("price",MSP_2024.get(crop,3000))
    rev = int(prod*mp/10)
    return jsonify({
        "yield_score":round(pred,1),"estimated_production_tonnes":prod,
        "area_ha":round(ha,2),"estimated_revenue_inr":rev,
        "confidence":"model" if YIELD_MODEL else "formula",
        "guardrails":check_guardrails(crop,f"yield {pred}"),
        "explanation":{
            "yield_score_meaning":translate_msg(f"Farm score {pred:.0f}/100 — {'excellent' if pred>80 else 'good' if pred>60 else 'needs improvement'}.",lang),
            "revenue_basis":translate_msg(f"Based on mandi price Rs {mp} per quintal for {crop.title()}.",lang),
            "disclaimer":translate_msg("Estimates are indicative. Consult KVK for precise planning.",lang)
        }
    })

@app.route("/weather", methods=["GET"])
def weather():
    lat=float(request.args.get("lat",17.3850)); lon=float(request.args.get("lon",78.4867))
    return jsonify(get_weather(lat,lon))

@app.route("/market", methods=["GET"])
def market():
    crop=request.args.get("crop",None); lang=request.args.get("lang","en")
    if crop:
        d=OFFLINE_PRICES.get(crop.lower(),{"price":random.randint(1500,8000),"trend":"unknown","mandi":"Local"}).copy()
        msp=MSP_2024.get(crop.lower())
        if msp:
            d["msp"]=msp
            note=f"Govt MSP: Rs {msp} per quintal. Market is {'above' if d['price']>msp else 'below'} MSP."
            d["msp_note"]=translate_msg(note,lang)
        return jsonify(d)
    return jsonify(OFFLINE_PRICES)

@app.route("/guardrails-check", methods=["POST"])
def guardrails_check():
    data=request.json or {}; lang=data.get("lang","en")
    result=check_guardrails(data.get("query",""),data.get("advice",""))
    if lang != "en":
        result["warnings"]=[translate_msg(w,lang) for w in result["warnings"]]
    return jsonify(result)

@app.route("/schemes", methods=["GET"])
def schemes():
    lang=request.args.get("lang","en")
    return jsonify({k:translate_msg(v,lang) for k,v in GOVT_SCHEMES.items()})

@app.route("/offline-data", methods=["GET"])
def offline_data():
    return jsonify({"prices":OFFLINE_PRICES,"msp":MSP_2024,"schemes":GOVT_SCHEMES,"banned_pesticides":BANNED_PESTICIDES,"timestamp":datetime.utcnow().isoformat(),"cache_valid_hours":24})

if __name__ == "__main__":
    app.run(port=5000, debug=True)