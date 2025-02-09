import { useStore } from '../../store';
import { DateRangePicker } from '../common/DateRangePicker';
import { SearchInput } from '../common/SearchInput';
import { StatusFilter } from '../common/StatusFilter';

export function EstimateFilters() {
  const { filters, updateFilters } = useStore();

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <DateRangePicker
          startDate={filters.dateRange[0]}
          endDate={filters.dateRange[1]}
          onChange={(dates) => updateFilters({ dateRange: dates })}
        />
        <SearchInput
          value={filters.searchTerm}
          onChange={(value) => updateFilters({ searchTerm: value })}
          placeholder="Search estimates..."
        />
        <StatusFilter
          selected={filters.status}
          onChange={(status) => updateFilters({ status })}
        />
      </div>
    </div>
  );
} 