import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import Home from './pages/Home';
import Preview2 from './pages/Preview2';
import Projects from './pages/Projects';
import { initAnalytics, trackPageView } from '@/lib/analytics';
// Add page imports here

const RouteAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    initAnalytics();
    trackPageView(`${location.pathname}${location.search}`);
  }, [location.pathname, location.search]);

  return null;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/preview2" element={<Preview2 />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {

  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <RouteAnalytics />
        <AppRoutes />
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
