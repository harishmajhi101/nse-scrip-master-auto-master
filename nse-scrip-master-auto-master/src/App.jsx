import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import ScripMaster from "./pages/ScripMaster";
import ApprovalQueue from "./pages/ApprovalQueue";
import ChangeHistory from "./pages/ChangeHistory";
import RunHistory from "./pages/RunHistory";

import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [running, setRunning] = useState(false);

  const handleRunNow = () => {
    if (running) {
      return;
    }

    setRunning(true);

    setTimeout(() => {
      setRunning(false);
    }, 2000);
  };

  const handlePageChange = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return (
          <Dashboard
            setActivePage={setActivePage}
          />
        );

      case "Scrip Master":
        return <ScripMaster />;

      case "Approval Queue":
        return <ApprovalQueue />;

      case "Change History":
        return <ChangeHistory />;

      case "Run History":
        return <RunHistory />;

      default:
        return (
          <Dashboard
            setActivePage={setActivePage}
          />
        );
    }
  };

  return (
    <div className="app">

      <Sidebar
        activePage={activePage}
        setActivePage={handlePageChange}
        sidebarOpen={sidebarOpen}
      />

      <div className="main-area">

        <Header
          onRunNow={handleRunNow}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {running && (
          <div className="running-bar">
            <span className="running-spinner"></span>
            NSE update process started...
          </div>
        )}

        <main>
          {renderPage()}
        </main>

      </div>

    </div>
  );
}

export default App;