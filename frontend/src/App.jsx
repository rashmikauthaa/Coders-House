import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Navigation from './components/shared/Navigation/Navigation';
import Authenticate from './pages/Authenticate/Authenticate';
import Activate from './pages/Activate/Activate';
import Rooms from './pages/Rooms/Rooms'
// import Login from './pages/Login/Login'
// import Register from './pages/Register/Register'
const isAuth = false;
const user = {
  activated: false,
};




function App() {
 
  return (
    <BrowserRouter>
      <Navigation />
      <Routes> 
      <Route path="/" element={<GuestRoute><Home /></GuestRoute>} />
      {/* <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} /> */}
      {/* <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} /> */}
      <Route path="/authenticate" element={<GuestRoute><Authenticate /></GuestRoute>} />
      <Route path="/activate" element={<SemiProtected><Activate /></SemiProtected>}/>
      <Route path="/rooms" element={<Protected><Rooms /></Protected>}/>
      </Routes>
    </BrowserRouter>
  )
}

const GuestRoute = ({ children }) => {
  return isAuth ? <Navigate to="/rooms" replace /> : children;
};

const SemiProtected = ({ children }) => {
  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  if (isAuth && !user.activated) {
    return children; 
  }

  return <Navigate to="/rooms" replace />;
};


const Protected = ({ children }) => {
  if (!isAuth) {
    return <Navigate to="/" replace />;
  }
  if (isAuth && !user.activated) {
    return <Navigate to="/activate" replace />;
  }
  
  return children;
};

export default App