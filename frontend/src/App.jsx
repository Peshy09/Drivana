import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { UserProvider } from './components/UserContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import VehicleList from './pages/VehicleList';
import VehicleDetail from './pages/VehicleDetail';
import Transactions from './pages/Transactions';
import Reviews from './pages/Reviews';
import Recommendations from './pages/Recommendations';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Payment from './pages/Payment';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

// Component to handle layout
const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <>
      {!isAuthPage && <Navbar />}
      {children}
      {!isAuthPage && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />

            {/* Protected Feature Routes */}
            <Route path="/vehicle-list" element={
              <PrivateRoute>
                <VehicleList />
              </PrivateRoute>
            } />
            <Route path="/vehicleDetails/:id" element={
              <PrivateRoute>
                <VehicleDetail />
              </PrivateRoute>
            } />
            <Route path="/transactions" element={
              <PrivateRoute>
                <Transactions />
              </PrivateRoute>
            } />
            <Route path="/payment" element={
              <PrivateRoute>
                <Payment />
              </PrivateRoute>
            } />
            <Route path="/reviews" element={
              <PrivateRoute>
                <Reviews />
              </PrivateRoute>
            } />
            <Route path="/recommendations" element={
              <PrivateRoute>
                <Recommendations />
              </PrivateRoute>
            } />
            <Route path="/chat" element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />

            {/* Redirect /vehicles to /vehicle-list */}
            <Route path="/vehicles" element={<Navigate to="/vehicle-list" replace />} />

            {/* Catch all undefined routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </UserProvider>
  );
};

export default App;