import { useEffect, useState } from "react";
import {
    RefreshCw,
    Search,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle
} from "lucide-react";
import { getApprovalQueue } from "../services/api";
import "./ApprovalQueue.css";

function ApprovalQueue() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const loadApprovalQueue = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getApprovalQueue();

            setRecords(data);
        } catch (err) {
            console.error(err);
            setError(
                err.message ||
                "Failed to load approval queue"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadApprovalQueue();
    }, []);

    const filteredRecords = records.filter((record) => {
        const searchText = search.toLowerCase();

        const matchesSearch =
            String(record.ISIN || "")
                .toLowerCase()
                .includes(searchText) ||
            String(record.Current_Company_Name || "")
                .toLowerCase()
                .includes(searchText) ||
            String(record.Proposed_Company_Name || "")
                .toLowerCase()
                .includes(searchText) ||
            String(record.Current_NSE_Symbol || "")
                .toLowerCase()
                .includes(searchText) ||
            String(record.Proposed_NSE_Symbol || "")
                .toLowerCase()
                .includes(searchText);

        const matchesStatus =
            statusFilter === "All" ||
            record.Status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusClass = (status) => {
        switch (status) {
            case "Pending":
            case "Pending Approval":
                return "pending";

            case "Approved":
                return "approved";

            case "Rejected":
                return "rejected";

            default:
                return "default";
        }
    };

    return (
        <div className="approval-page">

            <div className="approval-header">
                <div>
                    <h1>Approval Queue</h1>
                    <p>
                        Review and manage scrip update proposals
                    </p>
                </div>

                <button
                    className="refresh-btn"
                    onClick={loadApprovalQueue}
                    disabled={loading}
                >
                    <RefreshCw
                        size={17}
                        className={
                            loading
                                ? "refresh-icon spinning"
                                : "refresh-icon"
                        }
                    />
                    Refresh
                </button>
            </div>

            <div className="approval-stats">

                <div className="approval-stat-card">
                    <div className="approval-stat-icon">
                        <Clock size={20} />
                    </div>

                    <div>
                        <span>Pending</span>
                        <strong>
                            {
                                records.filter(
                                    (r) =>
                                        r.Status === "Pending" ||
                                        r.Status ===
                                            "Pending Approval"
                                ).length
                            }
                        </strong>
                    </div>
                </div>

                <div className="approval-stat-card">
                    <div className="approval-stat-icon">
                        <CheckCircle size={20} />
                    </div>

                    <div>
                        <span>Approved</span>
                        <strong>
                            {
                                records.filter(
                                    (r) =>
                                        r.Status === "Approved"
                                ).length
                            }
                        </strong>
                    </div>
                </div>

                <div className="approval-stat-card">
                    <div className="approval-stat-icon">
                        <XCircle size={20} />
                    </div>

                    <div>
                        <span>Rejected</span>
                        <strong>
                            {
                                records.filter(
                                    (r) =>
                                        r.Status === "Rejected"
                                ).length
                            }
                        </strong>
                    </div>
                </div>

                <div className="approval-stat-card">
                    <div className="approval-stat-icon">
                        <AlertCircle size={20} />
                    </div>

                    <div>
                        <span>Total</span>
                        <strong>
                            {records.length}
                        </strong>
                    </div>
                </div>

            </div>

            <div className="approval-toolbar">

                <div className="search-box">
                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search ISIN, company or symbol..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value)
                    }
                >
                    <option value="All">All Status</option>
                    <option value="Pending">
                        Pending
                    </option>
                    <option value="Pending Approval">
                        Pending Approval
                    </option>
                    <option value="Approved">
                        Approved
                    </option>
                    <option value="Rejected">
                        Rejected
                    </option>
                </select>

            </div>

            {loading ? (
                <div className="approval-message">
                    Loading approval queue...
                </div>
            ) : error ? (
                <div className="approval-error">
                    {error}
                </div>
            ) : filteredRecords.length === 0 ? (
                <div className="approval-empty">
                    <AlertCircle size={38} />

                    <h3>No approval records</h3>

                    <p>
                        There are currently no records
                        waiting for approval.
                    </p>
                </div>
            ) : (
                <div className="approval-table-container">

                    <table className="approval-table">

                        <thead>
                            <tr>
                                <th>ISIN</th>
                                <th>Current Company</th>
                                <th>Proposed Company</th>
                                <th>Current NSE Symbol</th>
                                <th>Proposed NSE Symbol</th>
                                <th>Source</th>
                                <th>Confidence</th>
                                <th>Status</th>
                                <th>Run ID</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredRecords.map(
                                (record) => (
                                    <tr
                                        key={
                                            record.ROWID ||
                                            record.ISIN
                                        }
                                    >
                                        <td>
                                            <strong>
                                                {record.ISIN ||
                                                    "-"}
                                            </strong>
                                        </td>

                                        <td>
                                            {record.Current_Company_Name ||
                                                "-"}
                                        </td>

                                        <td>
                                            {record.Proposed_Company_Name ||
                                                "-"}
                                        </td>

                                        <td>
                                            {record.Current_NSE_Symbol ||
                                                "-"}
                                        </td>

                                        <td>
                                            {record.Proposed_NSE_Symbol ||
                                                "-"}
                                        </td>

                                        <td>
                                            {record.Source ||
                                                "-"}
                                        </td>

                                        <td>
                                            {record.Confidence ||
                                                "-"}
                                        </td>

                                        <td>
                                            <span
                                                className={`status-badge ${getStatusClass(
                                                    record.Status
                                                )}`}
                                            >
                                                {record.Status ||
                                                    "-"}
                                            </span>
                                        </td>

                                        <td>
                                            {record.Run_ID ||
                                                "-"}
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>

                    </table>

                </div>
            )}

        </div>
    );
}

export default ApprovalQueue;