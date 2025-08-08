import { Button } from '@/components/ui/button';
import type { Dispatch, SetStateAction } from 'react';

interface Person {
  name: string;
  email: string;
}

interface RestrictionModalProps {
  persons: Person[];
  restrictionIndex: number;
  tempRestrictions: number[];
  setTempRestrictions: Dispatch<SetStateAction<number[]>>;
  onSave: (selected: number[]) => void;
  onClose: () => void;
}

export function RestrictionModal({
  persons,
  restrictionIndex,
  tempRestrictions,
  setTempRestrictions,
  onSave,
  onClose,
}: RestrictionModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
        <h2 className="font-normal text-lg text-gray-900 mb-4">
          {persons[restrictionIndex].name || `Person ${restrictionIndex + 1}`} can't match with
        </h2>
        <div className="space-y-3 mb-6">
          {persons.map((p, idx) =>
            idx === restrictionIndex ? null : (
              <label key={idx} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={tempRestrictions.includes(idx)}
                  onChange={e => {
                    setTempRestrictions(prev =>
                      e.target.checked ? [...prev, idx] : prev.filter(i => i !== idx),
                    );
                  }}
                  className="w-4 h-4 text-purple-600 border-purple-300 rounded focus:ring-purple-500"
                />
                <span className="text-gray-700">{p.name || `Person ${idx + 1}`}</span>
              </label>
            ),
          )}
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="border-purple-300 text-purple-700 hover:bg-purple-50">
            Cancel
          </Button>
          <Button onClick={() => onSave(tempRestrictions)} className="bg-purple-600 hover:bg-purple-700 text-white">
            Save Restrictions
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RestrictionModal;
