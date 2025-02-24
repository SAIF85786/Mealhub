import "./App.css";
import MyNavbar from "./components/MyNavbar";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router";
import Home from "./components/Home/Home";
import Order from "./components/Order/Order";
import Management from "./components/Management/Management";
import BookTable from "./components/BookTable/BookTable";
import SelectRole from "./components/SelectRole";
import { useEffect } from "react";
import { changeRole } from "./store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import ChefPage from "./components/ChefPage/ChefPage";
import WaiterPage from "./components/WaiterPage/WaiterPage";
import Account from "./components/Account/Account";
import Signup from "./components/Account/SignUp";
import Login from "./components/Account/Login";
import Menu from "./components/Menu/Menu";
import MyCart from "./components/MyCart/MyCart";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector((state) => state.user.role);
  useEffect(() => {
    const role = Cookies.get("role");
    if (role) {
      dispatch(changeRole(role));
    } else {
      navigate("/select-role");
    }
  }, []);
  useEffect(() => {
    if (role === "Manager") navigate("/management");
    else if (role === "Waiter") navigate("/waiter");
    else if (role === "Chef") navigate("/chef");
  }, [role]);
  return (
    <>
      <MyNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Account />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>
        <Route path="/order" element={<Order />} />
        <Route path="/myorders" element={<MyCart />} />

        <Route path="/book-table" element={<BookTable />} />
        <Route path="/management" element={<Management />} />
        <Route path="/waiter" element={<WaiterPage />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/chef" element={<ChefPage />} />
        <Route path="/select-role" element={<SelectRole />} />
      </Routes>
    </>
  );
}

export default App;
