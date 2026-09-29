import { useEffect, useMemo, useState } from "react";
import { Search, RefreshCw } from "lucide-react";
import { getChangeHistory } from "../services/api";
import "./ChangeHistory.css";

const PAGE_SIZE = 25;

function ChangeHistory() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        loadChangeHistory();
    }, []);

    const loadChangeHistory = async () => {
        try {
            setLoading(true);
            setError("");

            const records = await getChangeHistory();

            setData(records);
        } catch (err) {
            console.error("Failed to load change history:", err);
            setError("Failed to load change history.");
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            setError("");

            const records = await getChangeHistory();

            setData(records);
            setCurrentPage(1);
        } catch (err) {
            console.error("Failed to refresh change history:", err);
            setError("Failed to refresh change history.");
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
                String(item.ISIN || "")
                    .toLowerCase()
                    .includes(searchValue) ||
                String(item.Field || "")
                    .toLowerCase()
                    .includes(searchValue) ||
                String(item.Old_Value || "")
                    .toLowerCase()
                    .includes(searchValue) ||
                String(item.New_Value || "")
                    .toLowerCase()
                    .includes(searchValue) ||
                String(item.Source || "")
                    .toLowerCase()
                    .includes(searchValue) ||
                String(item.Applied_By || "")
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

    return (
        <div className="change-history-page">

            <div className="page-header">
                <div>
                    <h1>Change History</h1>
                    <p>
                        Track changes made to the NSE scrip master.
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

            <div className="history-toolbar">

                <div className="search-box">
                    <Search size={17} />

                    <input
                        type="text"
                        placeholder="Search by ISIN, field, value, source..."
                        value={search}
                        onChange={(event) => {
                            setSearch(event.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>

            </div>

            <div className="history-summary">
                <div>
                    <span>Total Changes</span>
                    <strong>{data.length}</strong>
                </div>

                <div>
                    <span>Filtered Records</span>
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
                        <p>Loading change history...</p>
                    </div>
                ) : paginatedData.length === 0 ? (
                    <div className="empty-state">
                        <p>No change history found.</p>
                    </div>
                ) : (
                    <table className="history-table">

                        <thead>
                            <tr>
                                <th>ISIN</th>
                                <th>Field</th>
                                <th>Old Value</th>
                                <th>New Value</th>
                                <th>Source</th>
                                <th>Applied By</th>
                                <th>Timestamp</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedData.map((item) => (
                                <tr
                                    key={
                                        item.ROWID ||
                                        `${item.ISIN}-${item.Field}-${item.Time_stamp}`
                                    }
                                >
                                    <td className="isin-cell">
                                        {item.ISIN || "-"}
                                    </td>

                                    <td className="field-cell">
                                        {item.Field || "-"}
                                    </td>

                                    <td>
                                        {item.Old_Value || "-"}
                                    </td>

                                    <td className="new-value-cell">
                                        {item.New_Value || "-"}
                                    </td>

                                    <td>
                                        <span className="source-badge">
                                            {item.Source || "-"}
                                        </span>
                                    </td>

                                    <td>
                                        {item.Applied_By || "-"}
                                    </td>

                                    <td>
                                        {formatDate(
                                            item.Time_stamp
                                        )}
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

export default ChangeHistory;