import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { Game } from './components/Game';
import './App.css';

function AppContent() {
  const { currentUser } = useAuth();

  return currentUser ? <Game /> : <Login />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
