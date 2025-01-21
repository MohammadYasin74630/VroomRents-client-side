import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './routes/App'
import AuthProvider from './utils/AuthProvider'
import 'keen-slider/keen-slider.min.css'
import 'react-tabs/style/react-tabs.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
