import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminProvider } from './context/AdminContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import BrowseTools from './pages/BrowseTools';
import Categories from './pages/Categories';
import ToolDetails from './pages/ToolDetails';
import AddTool from './pages/AddTool';
import UpdateTool from './pages/UpdateTool';
import ChangePassword from './pages/ChangePassword';

function App() {
  return (
    <AdminProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tools" element={<BrowseTools />} />
              <Route path="/tools/:id" element={<ToolDetails />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/add-tool" element={<AddTool />} />
              <Route path="/update-tool/:id" element={<UpdateTool />} />
              <Route path="/change-password" element={<ChangePassword />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AdminProvider>
  );
}

export default App;
