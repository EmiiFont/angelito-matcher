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
                                    className="w-4 h-4 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-gray-500 rounded focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700"
                                />
                                <span className="text-gray-700 dark:text-gray-300">{p.name || `Person ${idx + 1}`}</span>
                            </label>
                        ),
                    )}
                </div>
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="border border-blue-300 dark:border-blue-500 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 bg-white dark:bg-gray-700 px-4 py-2 rounded-lg font-medium">
                        Cancel
                    </button>
                    <button onClick={() => onSave(tempRestrictions)} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-400 dark:to-blue-500 dark:hover:from-blue-500 dark:hover:to-blue-600 text-white shadow-lg transition-all duration-200 px-4 py-2 rounded-lg font-medium">
                        Save Restrictions
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RestrictionModal;
