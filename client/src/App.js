import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth/Auth";
import Profile from "./pages/Profile/Profile";
import { useSelector } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import LayOut from "./components/Layout";
import PostDetails from "./pages/PostDetails";
import Dashboard from "./pages/Dashboard";



function App() {
  const user = useSelector((state) => state.authReducer.authData);
  return (
    <div
      className="App"
    >


      <div className="blur" style={{ top: "-18%", right: "0" }}></div>
      <div className="blur" style={{ top: "36%", left: "-8rem" }}></div>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="home" /> : <Navigate to="auth" />}
        />
        <Route
          path="/home"
          element={user ? <LayOut  >  <Home /> </LayOut> : <Navigate to="../auth" />}
        />
        <Route
          path="/postDetails/:id"
          element={user ? <LayOut  >  <PostDetails /> </LayOut> : <Navigate to="../auth" />}
        />
        <Route
          path="/auth"
          element={user ? <Navigate to="../home" /> : <Auth />}
        />
        <Route
          path="/profile/:id"
          element={user ? <LayOut  >   <Profile /></LayOut> : <Navigate to="../auth" />}
        />
        <Route
          path="/admin-dashboard"
          element={user ? <LayOut  >   <Dashboard /></LayOut> : <Navigate to="../auth" />}
        />
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />

      </Routes>
    </div>
  );
}

export default App;
