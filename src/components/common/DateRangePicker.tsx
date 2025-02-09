import { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Props {
  startDate: Date;
  endDate: Date;
  onChange: (dates: [Date, Date]) => void;
}

export function DateRangePicker({ startDate, endDate, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <ReactDatePicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={(dates) => {
          onChange([dates[0] || startDate, dates[1] || endDate]);
          if (dates[1]) setIsOpen(false);
        }}
        open={isOpen}
        onInputClick={() => setIsOpen(true)}
        onClickOutside={() => setIsOpen(false)}
        className="form-input w-full"
        dateFormat="MMM d, yyyy"
      />
    </div>
  );
} 