const API_BASE_URL =
    "https://nse-scrip-master-auto-60087256467.development.catalystserverless.in";

export async function getScripMaster() {
    const response = await fetch(
        `${API_BASE_URL}/api/scrip-master`
    );

    console.log("API status:", response.status);

    if (!response.ok) {
        throw new Error(
            `API request failed: ${response.status}`
        );
    }

    const result = await response.json();

    console.log("API response:", result);

    if (!result.success) {
        throw new Error(
            result.message || "Failed to fetch scrip master"
        );
    }

    return result.data || [];
}
export async function getChangeHistory() {
    const response = await fetch(
        `${API_BASE_URL}/api/change-history`
    );

    if (!response.ok) {
        throw new Error(
            `Change history API failed: ${response.status}`
        );
    }

    const result = await response.json();

    if (!result.success) {
        throw new Error(
            result.message || "Failed to fetch change history"
        );
    }

    return result.data || [];
}
// RunHistory function to trigger the run-history API
export async function getRunHistory() {
    const response = await fetch(
        `${API_BASE_URL}/api/run-history`
    );

    if (!response.ok) {
        throw new Error(
            `Run history API failed: ${response.status}`
        );
    }

    const result = await response.json();

    if (!result.success) {
        throw new Error(
            result.message || "Failed to fetch run history"
        );
    }

    return result.data || [];
}

// Dashboard function to trigger the dashboard API
export async function getDashboard() {
    const response = await fetch(
        `${API_BASE_URL}/api/dashboard`
    );

    if (!response.ok) {
        throw new Error(
            `Dashboard API failed: ${response.status}`
        );
    }

    const result = await response.json();

    if (!result.success) {
        throw new Error(
            result.message || "Failed to fetch dashboard"
        );
    }

    return result.data;
}

//approve function to trigger the approve API
export async function getApprovalQueue() {
    const response = await fetch(
        `${API_BASE_URL}/api/approval-queue`
    );

    if (!response.ok) {
        throw new Error(
            `Approval queue API failed: ${response.status}`
        );
    }

    const result = await response.json();

    if (!result.success) {
        throw new Error(
            result.message ||
            "Failed to fetch approval queue"
        );
    }

    return result.data || [];
}