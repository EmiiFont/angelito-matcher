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
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-h-96 overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700">
        <h2 className="font-normal text-lg text-gray-900 dark:text-white mb-4">
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
                  className="w-4 h-4 text-purple-600 dark:text-purple-400 border-purple-300 dark:border-gray-500 rounded focus:ring-purple-500 dark:focus:ring-purple-400 bg-white dark:bg-gray-700"
                />
                <span className="text-gray-700 dark:text-gray-300">{p.name || `Person ${idx + 1}`}</span>
              </label>
            ),
          )}
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="border-purple-300 dark:border-purple-500 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 bg-white dark:bg-gray-700">
            Cancel
          </Button>
          <Button onClick={() => onSave(tempRestrictions)} className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 dark:from-purple-400 dark:to-purple-500 dark:hover:from-purple-500 dark:hover:to-purple-600 text-white shadow-lg transition-all duration-200">
            Save Restrictions
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RestrictionModal;
