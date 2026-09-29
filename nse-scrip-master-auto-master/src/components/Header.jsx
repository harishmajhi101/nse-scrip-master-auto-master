import {
  Bell,
  RefreshCw,
  Menu,
  X
} from "lucide-react";

function Header({
  onRunNow,
  sidebarOpen,
  setSidebarOpen
}) {
  return (
    <header className="header">
      <div className="header-left">
        <button
          className="mobile-menu-button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={21} /> : <Menu size={21} />}
        </button>

        <div>
          <h1>NSE Scrip Master</h1>
          <p>Auto-update and security management</p>
        </div>
      </div>

      <div className="header-actions">
        <button className="icon-button">
          <Bell size={18} />
          <span className="notification-dot"></span>
        </button>

        <button
          className="run-button"
          onClick={onRunNow}
        >
          <RefreshCw size={16} />
          Run Now
        </button>
      </div>
    </header>
  );
}

export default Header;