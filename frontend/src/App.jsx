import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SimulatorProvider } from './context/SimulatorContext';

// Layout Components
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import SimulatorModal from './components/simulator/SimulatorModal';
import ChatAssistantDrawer from './components/ai/ChatAssistantDrawer';

// Pages
import DashboardPage from './pages/DashboardPage';
import CampusPage from './pages/CampusPage';
import BlocksPage from './pages/BlocksPage';
import SensorsPage from './pages/SensorsPage';
import TanksPage from './pages/TanksPage';
import PumpsPage from './pages/PumpsPage';
import BorewellsPage from './pages/BorewellsPage';
import STPPage from './pages/STPPage';
import ROPage from './pages/ROPage';
import RainwaterPage from './pages/RainwaterPage';
import GardensPage from './pages/GardensPage';
import LeakDetectionPage from './pages/LeakDetectionPage';
import AIPredictionsPage from './pages/AIPredictionsPage';
import AIAnomaliesPage from './pages/AIAnomaliesPage';
import AIRecommendationsPage from './pages/AIRecommendationsPage';
import MaintenancePage from './pages/MaintenancePage';
import WaterSavingsPage from './pages/WaterSavingsPage';
import WaterProblemsPage from './pages/WaterProblemsPage';
import ReportsPage from './pages/ReportsPage';
import AlertsPage from './pages/AlertsPage';
import SimulatorPage from './pages/SimulatorPage';
import SettingsPage from './pages/SettingsPage';

// Lucide Icons for Floating Buttons
import { Bot, Sliders } from 'lucide-react';

function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSimulatorModalOpen, setIsSimulatorModalOpen] = useState(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="app-shell">
      {/* Dark Navy Collapsible Sidebar */}
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        toggleSidebar={toggleSidebar} 
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        {/* Top Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Dynamic Route Pages */}
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage onOpenSimulator={() => setIsSimulatorModalOpen(true)} />} />
            <Route path="/campus" element={<CampusPage />} />
            <Route path="/blocks" element={<BlocksPage />} />
            <Route path="/sensors" element={<SensorsPage />} />
            <Route path="/tanks" element={<TanksPage />} />
            <Route path="/pumps" element={<PumpsPage />} />
            <Route path="/borewells" element={<BorewellsPage />} />
            <Route path="/stp" element={<STPPage />} />
            <Route path="/ro-water" element={<ROPage />} />
            <Route path="/rainwater" element={<RainwaterPage />} />
            <Route path="/gardens" element={<GardensPage />} />
            <Route path="/leak-detection" element={<LeakDetectionPage />} />
            <Route path="/ai-predictions" element={<AIPredictionsPage />} />
            <Route path="/ai-anomalies" element={<AIAnomaliesPage />} />
            <Route path="/ai-recommendations" element={<AIRecommendationsPage />} />
            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="/water-savings" element={<WaterSavingsPage />} />
            <Route path="/water-problems" element={<WaterProblemsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/simulator" element={<SimulatorPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* Floating Simulator Quick Launcher Button */}
      <button 
        className="floating-sim-btn d-none d-md-flex"
        onClick={() => setIsSimulatorModalOpen(true)}
      >
        <Sliders size={16} />
        <span>Virtual ESP32</span>
      </button>

      {/* Floating "Ask WaterGuard AI" RAG Assistant Button (Section 28) */}
      <button 
        className="floating-ai-btn"
        onClick={() => setIsChatDrawerOpen(true)}
      >
        <Bot size={20} />
        <span>Ask WaterGuard AI</span>
      </button>

      {/* Simulator Modal Dialog */}
      <SimulatorModal 
        isOpen={isSimulatorModalOpen} 
        onClose={() => setIsSimulatorModalOpen(false)} 
      />

      {/* Chat Assistant Side Drawer */}
      <ChatAssistantDrawer 
        isOpen={isChatDrawerOpen} 
        onClose={() => setIsChatDrawerOpen(false)} 
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <SimulatorProvider>
        <Router>
          <AppLayout />
        </Router>
      </SimulatorProvider>
    </AuthProvider>
  );
}

export default App;
