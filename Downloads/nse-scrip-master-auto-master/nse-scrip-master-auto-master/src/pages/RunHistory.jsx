import { useEffect, useMemo, useState } from "react";
import { Search, RefreshCw } from "lucide-react";
import { getRunHistory } from "../services/api";
import "./RunHistory.css";

const PAGE_SIZE = 25;

function RunHistory() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        loadRunHistory();
    }, []);

    const loadRunHistory = async () => {
        try {
            setLoading(true);
            setError("");

            const records = await getRunHistory();

            setData(records);
        } catch (err) {
            console.error("Failed to load run history:", err);
            setError("Failed to load run history.");
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            setError("");

            const records = await getRunHistory();

            setData(records);
            setCurrentPage(1);
        } catch (err) {
            console.error("Failed to refresh run history:", err);
            setError("Failed to refresh run history.");
        } finally {
            setRefreshing(false);
        }
    };

    const filteredData = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        if (!searchValue) {
            return data;
        }

        return data.filter((item) => {
            return (
                String(item.Run_ID || "")
                    .toLowerCase()
                    .includes(searchValue) ||
                String(item.Status || "")
                    .toLowerCase()
                    .includes(searchValue) ||
                String(item.Errors || "")
                    .toLowerCase()
                    .includes(searchValue)
            );
        });
    }, [data, search]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredData.length / PAGE_SIZE)
    );

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;

        return filteredData.slice(
            startIndex,
            startIndex + PAGE_SIZE
        );
    }, [filteredData, currentPage]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const formatDate = (value) => {
        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short"
        });
    };

    const getStatusClass = (status) => {
        const value = String(status || "").toLowerCase();

        if (value === "success" || value === "completed") {
            return "run-status success";
        }

        if (value === "failed" || value === "error") {
            return "run-status failed";
        }

        if (value === "running") {
            return "run-status running";
        }

        return "run-status";
    };

    return (
        <div className="run-history-page">

            <div className="page-header">
                <div>
                    <h1>Run History</h1>
                    <p>
                        View previous NSE Scrip Master processing runs.
                    </p>
                </div>

                <button
                    className="refresh-button"
                    onClick={handleRefresh}
                    disabled={refreshing}
                >
                    <RefreshCw
                        size={16}
                        className={refreshing ? "spin" : ""}
                    />

                    {refreshing
                        ? "Refreshing..."
                        : "Refresh"}
                </button>
            </div>

            <div className="run-history-toolbar">

                <div className="search-box">
                    <Search size={17} />

                    <input
                        type="text"
                        placeholder="Search by Run ID, status or error..."
                        value={search}
                        onChange={(event) => {
                            setSearch(event.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>

            </div>

            <div className="run-summary">
                <div>
                    <span>Total Runs</span>
                    <strong>{data.length}</strong>
                </div>

                <div>
                    <span>Filtered Runs</span>
                    <strong>{filteredData.length}</strong>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="table-container">

                {loading ? (
                    <div className="table-loading">
                        <div className="loader"></div>
                        <p>Loading run history...</p>
                    </div>
                ) : paginatedData.length === 0 ? (
                    <div className="empty-state">
                        <p>No run history available.</p>
                    </div>
                ) : (
                    <table className="run-table">

                        <thead>
                            <tr>
                                <th>Run ID</th>
                                <th>Run Date</th>
                                <th>EQUITY Rows</th>
                                <th>SME Rows</th>
                                <th>Auto Updated</th>
                                <th>New</th>
                                <th>Approval</th>
                                <th>Unresolved</th>
                                <th>Errors</th>
                                <th>Status</th>
                                <th>Circuit Breaker</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedData.map((item) => (
                                <tr
                                    key={
                                        item.ROWID ||
                                        item.Run_ID
                                    }
                                >
                                    <td className="run-id-cell">
                                        {item.Run_ID || "-"}
                                    </td>

                                    <td>
                                        {formatDate(
                                            item.Run_Date
                                        )}
                                    </td>

                                    <td>
                                        {item.EQUITY_Row_Count ??
                                            "-"}
                                    </td>

                                    <td>
                                        {item.SME_Row_Count ??
                                            "-"}
                                    </td>

                                    <td>
                                        {item.Auto_Updated_Count ??
                                            "-"}
                                    </td>

                                    <td>
                                        {item.New_Count ?? "-"}
                                    </td>

                                    <td>
                                        {item.Approval_Count ??
                                            "-"}
                                    </td>

                                    <td>
                                        {item.Unresolved_Count ??
                                            "-"}
                                    </td>

                                    <td>
                                        {item.Error_Count ?? "-"}
                                    </td>

                                    <td>
                                        <span
                                            className={getStatusClass(
                                                item.Status
                                            )}
                                        >
                                            {item.Status || "-"}
                                        </span>
                                    </td>

                                    <td>
                                        {item.Circuit_Breaker_Triggered
                                            ? "Yes"
                                            : "No"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                )}

            </div>

            {!loading && filteredData.length > 0 && (
                <div className="pagination">

                    <div className="pagination-info">
                        Showing{" "}
                        {(currentPage - 1) * PAGE_SIZE + 1}
                        {" - "}
                        {Math.min(
                            currentPage * PAGE_SIZE,
                            filteredData.length
                        )}
                        {" of "}
                        {filteredData.length}
                    </div>

                    <div className="pagination-buttons">

                        <button
                            onClick={() =>
                                setCurrentPage((page) =>
                                    Math.max(page - 1, 1)
                                )
                            }
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>

                        <span>
                            Page {currentPage} of {totalPages}
                        </span>

                        <button
                            onClick={() =>
                                setCurrentPage((page) =>
                                    Math.min(
                                        page + 1,
                                        totalPages
                                    )
                                )
                            }
                            disabled={
                                currentPage === totalPages
                            }
                        >
                            Next
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
}

export default RunHistory;