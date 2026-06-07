import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider, useAuth, RedirectToSignIn, useClerk } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { queryClientInstance } from '@/lib/query-client';
import ScrollToTop from './components/ScrollToTop';
import Layout from '@/components/Layout';
import { Toaster } from '@/components/ui/toaster';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Dashboard from '@/pages/Dashboard';
import ChatbotDetail from '@/pages/ChatbotDetail';
import ChatbotSettings from '@/pages/ChatbotSettings';
import KnowledgeBase from '@/pages/KnowledgeBase';
import Conversations from '@/pages/Conversations';
import ChatPreview from '@/pages/ChatPreview';
import PageNotFound from './lib/PageNotFound';

const CLERK_KEY = 'pk_test_aGVhbHRoeS1zcG9uZ2UtODcuY2xlcmsuYWNjb3VudHMuZGV2JA';

function ClerkWindowExposer() {
  const clerk = useClerk();
  useEffect(() => {
    window.Clerk = clerk;
  }, [clerk]);
  return null;
}

function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
  if (!isSignedIn) return <RedirectToSignIn />;
  return children;
}

function App() {
  return (
    <ClerkProvider publishableKey={CLERK_KEY}>
      <ClerkWindowExposer />
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="/" element={<Dashboard />} />
              <Route path="/chatbot/:id" element={<ChatbotDetail />} />
              <Route path="/chatbot/:id/settings" element={<ChatbotSettings />} />
              <Route path="/chatbot/:id/knowledge" element={<KnowledgeBase />} />
              <Route path="/chatbot/:id/conversations" element={<Conversations />} />
              <Route path="/chatbot/:id/preview" element={<ChatPreview />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;
