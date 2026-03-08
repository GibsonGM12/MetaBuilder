import { RelationLookup } from "../../crud/RelationLookup";

interface LookupSectionProps {
  entityId: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  readonly?: boolean;
}

export function LookupSection({
  entityId,
  value,
  onChange,
  label,
  readonly = false,
}: LookupSectionProps) {
  return (
    <div>
      {label && (
        <span className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </span>
      )}
      {readonly ? (
        <input
          type="text"
          value={value}
          disabled
          className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-500"
        />
      ) : (
        <RelationLookup entityId={entityId} value={value} onChange={onChange} />
      )}
    </div>
  );
}
