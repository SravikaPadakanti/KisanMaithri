import React, { useState } from 'react';
import { motion } from 'framer-motion';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const LANGS = [{code:'en',label:'EN'},{code:'hi',label:'हि'},{code:'te',label:'తె'}];

const SoilAdvisor = () => {
  const [soil, setSoil] = useState({ N: 80, P: 40, K: 40, pH: 6.5, moisture: 60 });
  const [crop, setCrop] = useState({ area: 1, unit: 'acres', crop: 'rice', rainfall: 800, temperature: 28, humidity: 65 });
  const [soilResult, setSoilResult] = useState(null);
  const [yieldResult, setYieldResult] = useState(null);
  const [weather, setWeather]       = useState(null);
  const [market, setMarket]         = useState(null);
  const [loading, setLoading]       = useState(false);
  const [lang, setLang]             = useState('en');

  const runSoilAnalysis = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${BACKEND}/soil-analysis`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({...soil})
      });
      setSoilResult(await r.json());
    } catch { setSoilResult({error:'Cannot reach server — check backend is running'}); }
    setLoading(false);
  };

  const runYieldPredict = async () => {
    setLoading(true);
    try {
      const payload = { ...soil, ...crop };
      const r = await fetch(`${BACKEND}/predict-yield`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      });
      const yd = await r.json();
      setYieldResult(yd);

      // Also fetch market & weather
      const [mkt, wx] = await Promise.all([
        fetch(`${BACKEND}/market?crop=${crop.crop}`).then(r=>r.json()).catch(()=>null),
        fetch(`${BACKEND}/weather?lat=17.38&lon=78.48`).then(r=>r.json()).catch(()=>null),
      ]);
      setMarket(mkt); setWeather(wx);
    } catch { setYieldResult({error:'Prediction failed'}); }
    setLoading(false);
  };

  const Input = ({ label, field, min, max, step=1, obj, setObj }) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">{label}: <span className="text-green-600">{obj[field]}</span></label>
      <input type="range" min={min} max={max} step={step} value={obj[field]}
        onChange={e => setObj(o => ({...o, [field]: parseFloat(e.target.value)}))}
        className="accent-green-600"/>
    </div>
  );

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">🌱 Soil & Yield Advisor</h1>
            <p className="text-sm text-gray-500">AI-powered soil analysis + yield prediction with regulatory guardrails</p>
          </div>
          <div className="flex gap-2">
            {LANGS.map(l => (
              <button key={l.code} onClick={() => setLang(l.code)}
                className={`px-3 py-1 rounded-full text-sm font-bold border ${lang===l.code?'bg-green-600 text-white border-green-600':'bg-white text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-200'}`}>
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Soil Inputs */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg">
            <h2 className="font-bold text-gray-700 dark:text-gray-200 mb-4">🧪 Soil Parameters</h2>
            <div className="space-y-4">
              <Input label="Nitrogen (N) kg/ha" field="N" min={10} max={200} obj={soil} setObj={setSoil}/>
              <Input label="Phosphorus (P) kg/ha" field="P" min={5} max={100} obj={soil} setObj={setSoil}/>
              <Input label="Potassium (K) kg/ha" field="K" min={5} max={100} obj={soil} setObj={setSoil}/>
              <Input label="pH level" field="pH" min={4} max={9} step={0.1} obj={soil} setObj={setSoil}/>
              <Input label="Moisture %" field="moisture" min={10} max={100} obj={soil} setObj={setSoil}/>
            </div>
            <button onClick={runSoilAnalysis} disabled={loading}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl transition-all disabled:opacity-50">
              {loading ? 'Analysing...' : '🔬 Analyse Soil'}
            </button>
          </div>

          {/* Crop Inputs */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg">
            <h2 className="font-bold text-gray-700 dark:text-gray-200 mb-4">🌾 Crop & Climate</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">Crop</label>
                <select value={crop.crop} onChange={e => setCrop(c=>({...c,crop:e.target.value}))}
                  className="w-full mt-1 p-2 border rounded-lg text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600">
                  {['rice','wheat','maize','cotton','tomato','groundnut','soybean','chilli','onion','turmeric'].map(c=>(
                    <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">Area</label>
                  <input type="number" value={crop.area} onChange={e=>setCrop(c=>({...c,area:parseFloat(e.target.value)}))}
                    className="w-full mt-1 p-2 border rounded-lg text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" min={0.1} step={0.1}/>
                </div>
                <div className="w-24">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">Unit</label>
                  <select value={crop.unit} onChange={e=>setCrop(c=>({...c,unit:e.target.value}))}
                    className="w-full mt-1 p-2 border rounded-lg text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600">
                    <option value="acres">acres</option><option value="hectares">ha</option>
                  </select>
                </div>
              </div>
              <Input label="Rainfall (mm/year)" field="rainfall" min={200} max={2500} step={50} obj={crop} setObj={setCrop}/>
              <Input label="Temperature (°C)" field="temperature" min={10} max={45} obj={crop} setObj={setCrop}/>
              <Input label="Humidity (%)" field="humidity" min={20} max={100} obj={crop} setObj={setCrop}/>
            </div>
            <button onClick={runYieldPredict} disabled={loading}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-all disabled:opacity-50">
              {loading ? 'Predicting...' : '📊 Predict Yield + Revenue'}
            </button>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {/* Soil Analysis Result */}
            {soilResult && !soilResult.error && (
              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
                className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg">
                <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-3">🧪 Soil Health</h3>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Health Score</span><span className="font-bold text-green-600">{soilResult.soil_health_score}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full transition-all" style={{width:`${soilResult.soil_health_score}%`}}/>
                  </div>
                </div>
                {soilResult.alerts?.map((a,i)=>(
                  <div key={i} className="text-xs bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 p-2 rounded-lg mb-2">{a}</div>
                ))}
                {soilResult.recommendations?.map((r,i)=>(
                  <div key={i} className={`text-xs p-2 rounded-lg mb-2 ${r.priority==='high'?'bg-red-50 dark:bg-red-900/30 text-red-700':'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200'}`}>
                    <span className="font-bold capitalize">{r.type}: </span>{r.action}
                  </div>
                ))}
                <div className="mt-3">
                  <p className="text-xs font-semibold text-gray-500 mb-1">Recommended Crops:</p>
                  <div className="flex flex-wrap gap-1">
                    {soilResult.suitable_crops?.map(c=>(
                      <span key={c} className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-full text-xs">{c}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Yield Prediction Result */}
            {yieldResult && !yieldResult.error && (
              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
                className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg">
                <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-3">📊 Yield Forecast</h3>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-3">
                    <div className="text-2xl font-bold text-green-600">{yieldResult.yield_score}%</div>
                    <div className="text-xs text-gray-500">Yield Score</div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-3">
                    <div className="text-2xl font-bold text-blue-600">{yieldResult.estimated_production_tonnes}t</div>
                    <div className="text-xs text-gray-500">Production</div>
                  </div>
                  <div className="col-span-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl p-3">
                    <div className="text-2xl font-bold text-yellow-600">₹{yieldResult.estimated_revenue_inr?.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Estimated Revenue</div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-2 text-center">
                  Based on {yieldResult.area_ha} ha • {yieldResult.confidence} model
                </div>
                {yieldResult.guardrails?.warnings?.map((w,i)=>(
                  <div key={i} className="mt-2 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 p-2 rounded-lg">{w}</div>
                ))}
              </motion.div>
            )}

            {/* Market Price */}
            {market && (
              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
                <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-2">💰 Market Price</h3>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Current price</span>
                  <span className="font-bold text-green-600">₹{market.price}/quintal</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Trend</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${market.trend==='rising'?'bg-green-100 text-green-700':market.trend==='falling'?'bg-red-100 text-red-700':'bg-gray-100 text-gray-600'}`}>
                    {market.trend} {market.trend==='rising'?'📈':market.trend==='falling'?'📉':'➡️'}
                  </span>
                </div>
                {market.msp_note && <p className="text-xs text-blue-600 mt-2 bg-blue-50 p-2 rounded-lg">{market.msp_note}</p>}
              </motion.div>
            )}

            {/* Weather */}
            {weather && (
              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
                <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-2">
                  🌤 Weather {weather.source==='offline_default'?'(cached)':weather.source==='cache'?'(cached)':'(live)'}
                </h3>
                <div className="grid grid-cols-2 gap-2 text-center text-sm">
                  <div><span className="text-2xl">{weather.temperature}°C</span><div className="text-xs text-gray-500">Temperature</div></div>
                  <div><span className="text-2xl">{weather.windspeed}</span><div className="text-xs text-gray-500">km/h wind</div></div>
                </div>
                <div className="mt-2 flex gap-1 overflow-x-auto">
                  {weather.precipitation?.slice(0,7).map((p,i)=>(
                    <div key={i} className="flex flex-col items-center text-xs min-w-[28px]">
                      <span className={p>0?'text-blue-500':'text-gray-400'}>{p>0?'🌧':'☀️'}</span>
                      <span className="text-gray-500">{p}mm</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {(soilResult?.error || yieldResult?.error) && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200 rounded-xl p-4 text-sm">
                {soilResult?.error || yieldResult?.error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoilAdvisor;
