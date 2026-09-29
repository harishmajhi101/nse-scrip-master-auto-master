import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Database,
  ClipboardCheck,
  History,
  FileClock
} from "lucide-react";
import { getApprovalQueue } from "../services/api";

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard
  },
  {
    name: "Scrip Master",
    icon: Database
  },
  {
    name: "Approval Queue",
    icon: ClipboardCheck
  },
  {
    name: "Change History",
    icon: History
  },
  {
    name: "Run History",
    icon: FileClock
  }
];

function Sidebar({
  activePage,
  setActivePage,
  sidebarOpen
}) {
  const [approvalCount, setApprovalCount] = useState(0);

  useEffect(() => {
    const loadApprovalCount = async () => {
      try {
        const data = await getApprovalQueue();
        setApprovalCount(data.length);
      } catch (error) {
        console.error(
          "Failed to load approval count:",
          error
        );
        setApprovalCount(0);
      }
    };

    loadApprovalCount();
  }, []);

  return (
    <>
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <div className="logo-mark">N</div>

          <div>
            <strong>NSE Master</strong>
            <span>Management System</span>
          </div>
        </div>

        <div className="menu-section">
          <span className="menu-title">MAIN MENU</span>

          <nav>
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.name}
                  className={`menu-item ${
                    activePage === item.name ? "active" : ""
                  }`}
                  onClick={() => setActivePage(item.name)}
                >
                  <Icon size={19} />

                  <span>{item.name}</span>

                  {item.name === "Approval Queue" &&
                    approvalCount > 0 && (
                      <span className="menu-count">
                        {approvalCount}
                      </span>
                    )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="system-status">
            <span className="online-dot"></span>

            <div>
              <strong>System Online</strong>
              <small>Last sync: 06:34 AM</small>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="sidebar-overlay"></div>
      )}
    </>
  );
}

export default Sidebar;