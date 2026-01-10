import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConvexReactClient } from 'convex/react'
import { ConvexAuthProvider } from '@convex-dev/auth/react'
import ReactGA from 'react-ga4'
import './theme.css'
import App from './App.tsx'

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string)

ReactGA.initialize(import.meta.env.VITE_GOOGLE_ANALYTICS_ID)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ConvexAuthProvider client={convex}>
        <App />
      </ConvexAuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
