import { useEffect, useState } from "react";
import {
    Activity,
    CheckCircle,
    AlertCircle,
    Clock,
    Database,
    RefreshCw
} from "lucide-react";

import { getDashboard } from "../services/api";
import "./Dashboard.css";

function Dashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getDashboard();

            setDashboard(data);
        } catch (err) {
            console.error(
                "Dashboard error:",
                err
            );

            setError(
                err.message ||
                "Failed to load dashboard"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    if (loading) {
        return (
            <div className="dashboard-loading">
                Loading dashboard...
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-error">
                <AlertCircle size={20} />
                <span>{error}</span>

                <button
                    onClick={loadDashboard}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>
                        NSE Scrip Master Auto-Update
                    </p>
                </div>

                <button
                    className="refresh-button"
                    onClick={loadDashboard}
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            <div className="dashboard-stats">

                <div className="stat-card">
                    <div className="stat-icon">
                        <CheckCircle size={22} />
                    </div>

                    <div>
                        <span>
                            Auto Updated
                        </span>

                        <strong>
                            {dashboard.autoUpdated}
                        </strong>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <Database size={22} />
                    </div>

                    <div>
                        <span>
                            New Securities
                        </span>

                        <strong>
                            {dashboard.newSecurities}
                        </strong>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <Clock size={22} />
                    </div>

                    <div>
                        <span>
                            Approval Required
                        </span>

                        <strong>
                            {dashboard.approvalRequired}
                        </strong>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <AlertCircle size={22} />
                    </div>

                    <div>
                        <span>
                            Unresolved
                        </span>

                        <strong>
                            {dashboard.unresolved}
                        </strong>
                    </div>
                </div>

            </div>

            <div className="dashboard-section">

                <div className="section-header">
                    <h2>Pipeline Status</h2>

                    <span
                        className={
                            dashboard.latestRun
                                ? "status-active"
                                : "status-idle"
                        }
                    >
                        <Activity size={15} />

                        {dashboard.latestRun
                            ? dashboard.latestRun.status
                            : "No Run"}
                    </span>
                </div>

                {dashboard.latestRun ? (
                    <div className="run-details">

                        <div>
                            <span>
                                Run ID
                            </span>

                            <strong>
                                {
                                    dashboard
                                        .latestRun
                                        .runId
                                }
                            </strong>
                        </div>

                        <div>
                            <span>
                                Run Date
                            </span>

                            <strong>
                                {
                                    dashboard
                                        .latestRun
                                        .runDate
                                }
                            </strong>
                        </div>

                        <div>
                            <span>
                                Auto Updated
                            </span>

                            <strong>
                                {
                                    dashboard
                                        .latestRun
                                        .autoUpdated
                                }
                            </strong>
                        </div>

                        <div>
                            <span>
                                New Securities
                            </span>

                            <strong>
                                {
                                    dashboard
                                        .latestRun
                                        .newSecurities
                                }
                            </strong>
                        </div>

                        <div>
                            <span>
                                Approval Required
                            </span>

                            <strong>
                                {
                                    dashboard
                                        .latestRun
                                        .approvalRequired
                                }
                            </strong>
                        </div>

                        <div>
                            <span>
                                Unresolved
                            </span>

                            <strong>
                                {
                                    dashboard
                                        .latestRun
                                        .unresolved
                                }
                            </strong>
                        </div>

                    </div>
                ) : (
                    <div className="empty-run">
                        <Activity size={22} />

                        <div>
                            <strong>
                                No run history available
                            </strong>

                            <p>
                                Run data will appear
                                here after the first
                                successful pipeline run.
                            </p>
                        </div>
                    </div>
                )}

            </div>

            <div className="dashboard-section">

                <div className="section-header">
                    <h2>Scrip Master</h2>
                </div>

                <div className="master-summary">

                    <div>
                        <span>
                            Total Securities
                        </span>

                        <strong>
                            {
                                dashboard
                                    .totalSecurities
                            }
                        </strong>
                    </div>

                    <div>
                        <span>
                            Active Securities
                        </span>

                        <strong>
                            {
                                dashboard
                                    .activeSecurities
                            }
                        </strong>
                    </div>

                    <div>
                        <span>
                            Pending Approvals
                        </span>

                        <strong>
                            {
                                dashboard
                                    .pendingApprovals
                            }
                        </strong>
                    </div>

                    <div>
                        <span>
                            Total Runs
                        </span>

                        <strong>
                            {
                                dashboard.totalRuns
                            }
                        </strong>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default Dashboard;