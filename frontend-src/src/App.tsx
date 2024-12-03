import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import { Sidebar } from './components/Layout/Sidebar';
import { Navbar } from './components/Layout/Navbar';
import { Dashboard } from './components/Layout/Dashboard';
import CustomerIntelligence from './pages/CustomerIntelligence';
import GrowthStrategy from './pages/GrowthStrategy';
import MarketAnalysis from './pages/MarketAnalysis';
import EnhancedProfileForm from './components/BusinessProfile/EnhancedProfileForm';
import { AnalysisDashboard } from './components/Visualizations/AnalysisDashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/forms.css';
import './index.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Sidebar />
          <Dashboard>
            <Routes>
              <Route path="/" element={<div>Welcome to Dashboard</div>} />
              <Route path="/market-analysis" element={<MarketAnalysis />} />
              <Route path="/customer-intelligence" element={<CustomerIntelligence />} />
              <Route path="/growth-strategy" element={<GrowthStrategy />} />
              <Route path="/business-profile" element={<EnhancedProfileForm />} />
              <Route path="/analysis-dashboard" element={<AnalysisDashboard />} />
            </Routes>
          </Dashboard>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
