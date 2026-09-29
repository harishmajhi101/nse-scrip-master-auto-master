function StatusBadge({ status }) {
  return (
    <span
      className={`status-badge ${status
        .toLowerCase()
        .replace(/\s+/g, "-")}`}
    >
      {status}
    </span>
  );
}

export function ConfidenceBadge({ confidence }) {
  return (
    <span
      className={`confidence-badge ${confidence.toLowerCase()}`}
    >
      {confidence}
    </span>
  );
}

export default StatusBadge;