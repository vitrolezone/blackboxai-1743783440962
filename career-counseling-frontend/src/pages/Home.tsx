import React from 'react';
import { useNavigate } from 'react-router-dom';
import { login, getCurrentUser } from '../services/api';

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [showLogin, setShowLogin] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        await getCurrentUser();
        setIsLoggedIn(true);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      setIsLoggedIn(true);
      setShowLogin(false);
      setError('');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-blue-600 mb-8 text-center">Career Counseling</h1>
        
        {isLoggedIn ? (
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/test')}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Start Career Test
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem('access_token');
                setIsLoggedIn(false);
              }}
              className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Logout
            </button>
          </div>
        ) : showLogin ? (
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p>{error}</p>
              </div>
            )}
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setShowLogin(false)}
              className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => navigate('/reset-password')}
              className="text-blue-600 hover:underline text-sm"
            >
              Forgot password?
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <button 
              onClick={() => setShowLogin(true)}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/test')}
              className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Continue as Guest
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;