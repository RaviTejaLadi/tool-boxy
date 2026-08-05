import { useEffect, useMemo } from 'react';
import { CSVViewerHeader, CSVViewerSidebar, PreviewPane } from './components';
import { filterRows, sortRows } from './helpers';
import { useCsvStore } from './stores';

export default function CSVViewer() {
  const data = useCsvStore((s) => s.data);
  const headers = useCsvStore((s) => s.headers);
  const searchTerm = useCsvStore((s) => s.searchTerm);
  const searchColumn = useCsvStore((s) => s.searchColumn);
  const filters = useCsvStore((s) => s.filters);
  const sortConfig = useCsvStore((s) => s.sortConfig);
  const currentPage = useCsvStore((s) => s.currentPage);
  const rowsPerPage = useCsvStore((s) => s.rowsPerPage);
  const setCurrentPage = useCsvStore((s) => s.setCurrentPage);

  const sortedData = useMemo(() => {
    const filtered = filterRows(data, searchTerm, searchColumn, filters);
    return sortRows(filtered, sortConfig);
  }, [data, searchTerm, searchColumn, filters, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / rowsPerPage) || 1);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages, setCurrentPage]);

  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * rowsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      <CSVViewerHeader />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <PreviewPane headers={headers} rows={paginatedData} hasData={data.length > 0} />
        <CSVViewerSidebar totalPages={totalPages} totalRows={sortedData.length} />
      </div>
    </div>
  );
}
