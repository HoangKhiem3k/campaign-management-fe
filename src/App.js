import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import Login from './views/Login'
import NotFound from './views/NotFound'
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './views/Dashboard';
import Campaign from './views/Campaign';
import Account from './views/Account';
import Profile from './views/Profile';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Loading from './components/Common/Loading';
import Paginate from './components/Common/Pagination'
function App() {
  const user = useSelector((state) => state.auth.currentUser);
  return (
    <>
      <BrowserRouter>
        <Loading />
        <div className="App">
          <Routes>
            <Route path="/paginate" element={< Paginate/>}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/" render element={user !== null ? <MainLayout /> : <Navigate replace to="/login" />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="campaign" element={<Campaign />} />
              <Route path="account" element={<Account />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

export default App;
