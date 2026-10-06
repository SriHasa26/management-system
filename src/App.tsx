import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ToastProvider } from './hooks/useToast';
import { AppRoutes } from './routes/AppRoutes';
import ClickSpark from './components/common/ClickSpark';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ClickSpark
            sparkColor="#C99A3D"
            sparkSize={10}
            sparkRadius={18}
            sparkCount={8}
            duration={400}
          >
            <AppRoutes />
          </ClickSpark>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

