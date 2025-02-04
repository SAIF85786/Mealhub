import "./App.css";
import MyNavbar from "./components/MyNavbar";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./components/Home/Home";
import Order from "./components/Order/Order";
import Management from "./components/Management/Management";
import BookTable from "./components/BookTable/BookTable";

function App() {
  return (
    <BrowserRouter>
      <MyNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order" element={<Order />} />
        <Route path="/book-table" element={<BookTable />} />
        <Route path="/management" element={<Management />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
