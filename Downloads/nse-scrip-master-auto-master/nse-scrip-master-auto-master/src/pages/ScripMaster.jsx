import { useEffect, useMemo, useState } from "react";
import { Search, RefreshCw } from "lucide-react";
import { getScripMaster } from "../services/api";
import "./ScripMaster.css";

const PAGE_SIZE = 25;

function ScripMaster() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        loadScripMaster();
    }, []);

    const loadScripMaster = async () => {
        try {
            setLoading(true);
            setError("");

            const records = await getScripMaster();

            setData(records);
        } catch (err) {
            console.error("Failed to load scrip master:", err);
            setError("Failed to load scrip master data.");
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            setError("");

            const records = await getScripMaster();

            setData(records);
            setCurrentPage(1);
        } catch (err) {
            console.error("Failed to refresh:", err);
            setError("Failed to refresh scrip master data.");
        } finally {
            setRefreshing(false);
        }
    };

    const filteredData = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return data.filter((item) => {
            const matchesSearch =
                !searchValue ||
                String(item.ISIN || "")
                    .toLowerCase()
                    .includes(searchValue) ||
                String(item.Company_Name || "")
                    .toLowerCase()
                    .includes(searchValue) ||
                String(item.NSE_Symbol || "")
                    .toLowerCase()
                    .includes(searchValue) ||
                String(item.BSE_Code || "")
                    .toLowerCase()
                    .includes(searchValue);

            const matchesStatus =
                statusFilter === "All" ||
                String(item.Status || "").toLowerCase() ===
                    statusFilter.toLowerCase();

            return matchesSearch && matchesStatus;
        });
    }, [data, search, statusFilter]);

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

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        setCurrentPage(1);
    };

    const handleStatusChange = (event) => {
        setStatusFilter(event.target.value);
        setCurrentPage(1);
    };

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

        if (value === "active") {
            return "status-badge active";
        }

        if (value === "delisted") {
            return "status-badge delisted";
        }

        if (value === "suspended") {
            return "status-badge suspended";
        }

        return "status-badge";
    };

    return (
        <div className="scrip-master-page">

            <div className="page-header">
                <div>
                    <h1>Scrip Master</h1>
                    <p>
                        View and manage NSE security master records.
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

                    {refreshing ? "Refreshing..." : "Refresh"}
                </button>
            </div>

            <div className="scrip-master-toolbar">

                <div className="search-box">
                    <Search size={17} />

                    <input
                        type="text"
                        placeholder="Search by ISIN, company, symbol or BSE code..."
                        value={search}
                        onChange={handleSearchChange}
                    />
                </div>

                <select
                    className="status-filter"
                    value={statusFilter}
                    onChange={handleStatusChange}
                >
                    <option value="All">All Status</option>
                    <option value="active">Active</option>
                    <option value="delisted">Delisted</option>
                    <option value="suspended">Suspended</option>
                </select>

            </div>

            <div className="scrip-master-summary">
                <div>
                    <span>Total Records</span>
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
                        <p>Loading scrip master...</p>
                    </div>
                ) : paginatedData.length === 0 ? (
                    <div className="empty-state">
                        <p>No scrip records found.</p>
                    </div>
                ) : (
                    <table className="scrip-table">

                        <thead>
                            <tr>
                                <th>ISIN</th>
                                <th>Company Name</th>
                                <th>NSE Symbol</th>
                                <th>Series</th>
                                <th>BSE Code</th>
                                <th>Status</th>
                                <th>Last Updated</th>
                                <th>Source</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedData.map((item) => (
                                <tr
                                    key={
                                        item.ROWID ||
                                        item.ISIN
                                    }
                                >
                                    <td className="isin-cell">
                                        {item.ISIN || "-"}
                                    </td>

                                    <td>
                                        {item.Company_Name || "-"}
                                    </td>

                                    <td className="symbol-cell">
                                        {item.NSE_Symbol || "-"}
                                    </td>

                                    <td>
                                        {item.NSE_Series || "-"}
                                    </td>

                                    <td>
                                        {item.BSE_Code || "-"}
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
                                        {formatDate(
                                            item.Last_Updated
                                        )}
                                    </td>

                                    <td>
                                        {item.Last_Update_Source || "-"}
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

export default ScripMaster;