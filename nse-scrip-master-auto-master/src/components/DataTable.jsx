function DataTable({
  columns,
  data,
  renderCell
}) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr key={row.id || row.ISIN || index}>
                {columns.map((column) => (
                  <td key={column.key}>
                    {renderCell
                      ? renderCell(row, column)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="empty-state"
              >
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;