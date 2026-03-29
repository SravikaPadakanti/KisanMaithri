import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import DigitalTwin from './pages/DigitalTwin';
import CropHealth from './pages/CropHealth';
import MarketPage from './pages/MarketPage';
import SoilAdvisor from './pages/SoilAdvisor';
import SoilReportUpload from './pages/Soilreportupload';
import Placeholder from './pages/Placeholder';
import FloatingAssistant from './components/AiAssistant/FloatingAssistant';
import { ThemeProvider } from './theme/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/digital-twin" element={<DigitalTwin />} />
              <Route path="/crop-health" element={<CropHealth />} />
              <Route path="/market" element={<MarketPage />} />
              <Route path="/soil-advisor" element={<SoilAdvisor />} />
              <Route path="/soil-report-upload" element={<SoilReportUpload />} />
              <Route path="*" element={<Placeholder />} />
            </Routes>
          </Layout>
          <FloatingAssistant />
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
