export default function DataTable({
  headers,
  rows,
  loading = false,
  sortKey,
  direction,
  onSort,
  className = "catalog-table",
}) {
  return (
    <table className={className} aria-hidden={loading || undefined}>
      <thead>
        <tr>
          {headers.map(([title, key], i) => (
            <th
              key={i}
              scope="col"
              aria-sort={
                key
                  ? sortKey === key
                    ? direction === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                  : undefined
              }
            >
              {key ? (
                <button data-sort={key} onClick={() => onSort(key)}>
                  {title}
                  {sortKey === key && (
                    <span className="sort-caret">
                      {direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </button>
              ) : (
                title
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading
          ? Array.from({ length: 4 }, (_, i) => (
              <tr key={i} className="catalog-skeleton">
                {headers.map((_, j) => (
                  <td key={j}>
                    <span className="skeleton-bar" />
                  </td>
                ))}
              </tr>
            ))
          : rows.map(({ id, cells }) => (
              <tr key={id}>
                {cells.map((cell, i) => (
                  <td key={i} data-label={headers[i][0]}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
      </tbody>
    </table>
  );
}
