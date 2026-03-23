import React from 'react';
import { ThemeProvider } from 'next-themes';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MarketplaceProvider } from './contexts/MarketplaceContext';
import { CartProvider } from './contexts/CartContext';
import { SocketProvider } from './contexts/SocketContext';
import { Toaster } from './components/ui/sonner';
import routes from './routes';

const App: React.FC = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <AuthProvider>
        <MarketplaceProvider>
          <CartProvider>
            <SocketProvider>
              <Router>
                <Routes>
                  {routes.map((route, index) => (
                    <Route
                      key={index}
                      path={route.path}
                      element={route.element}
                    />
                  ))}
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
                <Toaster />
              </Router>
            </SocketProvider>
          </CartProvider>
        </MarketplaceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;