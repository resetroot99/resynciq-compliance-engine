import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Props {
  onRangeChange: (range: { start: Date; end: Date }) => void;
}

export default function DateRangeSelector({ onRangeChange }: Props) {
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date());

  const handleDateChange = (dates: [Date, Date]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      onRangeChange({ start, end });
    }
  };

  const presetRanges = [
    { label: 'Last 7 Days', days: 7 },
    { label: 'Last 30 Days', days: 30 },
    { label: 'Last 90 Days', days: 90 },
    { label: 'Year to Date', days: 'ytd' }
  ];

  const handlePresetClick = (days: number | 'ytd') => {
    const end = new Date();
    let start;
    
    if (days === 'ytd') {
      start = new Date(end.getFullYear(), 0, 1);
    } else {
      start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
    }
    
    setStartDate(start);
    setEndDate(end);
    onRangeChange({ start, end });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 bg-white rounded-lg shadow p-4">
      <div className="flex gap-2">
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          className="form-input px-3 py-2 rounded border"
          dateFormat="MMM d, yyyy"
        />
      </div>
      <div className="flex gap-2">
        {presetRanges.map(({ label, days }) => (
          <button
            key={label}
            onClick={() => handlePresetClick(days)}
            className="px-3 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
} 