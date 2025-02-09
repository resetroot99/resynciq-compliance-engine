interface Props {
  selected: string[];
  onChange: (selected: string[]) => void;
}

const statuses = [
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'FAILED', label: 'Failed' },
];

export function StatusFilter({ selected, onChange }: Props) {
  const handleChange = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(s => s !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map(status => (
        <button
          key={status.value}
          onClick={() => handleChange(status.value)}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            selected.includes(status.value)
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          {status.label}
        </button>
      ))}
    </div>
  );
} 