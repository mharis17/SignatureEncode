import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Connection from "./components/connection/connection";
import Reciever from "./components/connection/reciever";
import Send from "./components/connection/send";
import Dhky from "./components/connection/DHKY";
import AES from "./components/connection/AES";
import Sidebar from "./components/connection/Sidebar";
import ViewAddresses from "./components/connection/ViewAddresses";
import SendTransaction from "./components/connection/SendTransaction";
function App() {
  return (
    <div className="flex-wrap	">
      <Sidebar></Sidebar>
      <div>
        <div className="md:p-[30px]">
          <h3
            className="text-[30px] font-bold text-center cursor-pointer"
            onClick={() => (window.location.href = "/")}
          >
            BlockSend
          </h3>
          <Router>
            <Routes>
              <Route path="/" element={<Connection />} />
              <Route path="/send" element={<Send />} />
              <Route path="/reciever" element={<Reciever />} />
              <Route path="/dhky" element={<Dhky />} />
              <Route path="/aes" element={<AES />} />
              <Route path="/viewAllAddress" element={<ViewAddresses />} />
              <Route path="/SendTransaction" element={<SendTransaction />} />
            </Routes>
          </Router>
        </div>
      </div>
    </div>
  );
}

export default App;
