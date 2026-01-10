import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import ReactGA from 'react-ga4'
import Home from './pages/HomeTemplate'
import Pricing from './pages/PricingTemplate'
import Dashboard from './pages/DashboardTemplate'
import Header from './components/Header'
import { Footer } from './components/Footer'
import BlogIndex from './blog/BlogIndex'
import BlogPost from './blog/BlogPost'
import { useAppStore } from './stores/useAppStore'

// Content Pages
import AboutUs from './contentpages/AboutUs'
import Contact from './contentpages/Contact'
import FAQ from './contentpages/FAQ'
import HelpSupport from './contentpages/HelpSupport'
import PrivacyPolicy from './contentpages/PrivacyPolicy'
import TermsOfService from './contentpages/TermsOfService'
import CookiePolicy from './contentpages/CookiePolicy'
import CommunityGuidelines from './contentpages/CommunityGuidelines'
import RefundPolicy from './contentpages/RefundPolicy'
import CancellationPolicy from './contentpages/CancellationPolicy'
import SafetyAndSecurity from './contentpages/SafetyAndSecurity'
import ReportBlockFunctionality from './contentpages/ReportBlockFunctionality'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import { Toaster } from 'sonner'

function App() {
  const theme = useAppStore((s) => s.theme)
  const location = useLocation()

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [theme])

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search })
  }, [location])

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />

          {/* Content Pages */}
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/help-support" element={<HelpSupport />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/community-guidelines" element={<CommunityGuidelines />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/cancellation-policy" element={<CancellationPolicy />} />
          <Route path="/safety-and-security" element={<SafetyAndSecurity />} />
          <Route path="/report-block-functionality" element={<ReportBlockFunctionality />} />

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Toaster position="top-center" richColors />
      <Analytics />
    </div>
  )
}

export default App
