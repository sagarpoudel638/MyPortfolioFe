import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from "./context/AuthContext.jsx";
import { DashboardProvider } from "./context/DashboardContext";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
   <StrictMode>
    <AuthProvider>
      <DashboardProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </DashboardProvider>
    </AuthProvider>
  </StrictMode>
)
