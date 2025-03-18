import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import './App.css';

// Layouts
import AdminLayout from '@/components/layout/AdminLayout';
import SearchLayout from '@/components/layout/SearchLayout';

// Admin pages
import Dashboard from '@/pages/admin/Dashboard';
import PatentReviewDetail from '@/pages/admin/PatentReviewDetail';
import AnalysisView from '@/pages/admin/AnalysisView';
import PatentUpload from '@/pages/admin/PatentUpload';

// Search pages
import PatentSearch from '@/pages/search/PatentSearch';

// Other pages
import Index from '@/pages/Index';
import TrizPrinciples from '@/pages/TrizPrinciples';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <TooltipProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/principles" element={<TrizPrinciples />} />
          
          {/* Admin routes - simplified to just dashboard and necessary detail pages */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="upload" element={<PatentUpload />} />
            <Route path="review/:patentId" element={<PatentReviewDetail />} />
            <Route path="analysis/:analysisId" element={<AnalysisView />} />
          </Route>
          
          {/* Search route - now only showing TRIZ principles */}
          <Route path="/search" element={<SearchLayout />}>
            <Route index element={<PatentSearch />} />
          </Route>
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </TooltipProvider>
  );
}

export default App;
