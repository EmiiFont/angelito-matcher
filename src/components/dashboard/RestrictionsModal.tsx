import { useState, useEffect } from 'react';
import { X, UserX } from 'lucide-react';

interface Person {
    name: string;
    email: string;
    phone?: string;
}

interface RestrictionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentParticipant: Person;
    currentParticipantIndex: number;
    allParticipants: Person[];
    currentRestrictions: number[];
    onSaveRestrictions: (participantIndex: number, restrictedIndices: number[]) => void;
}

export function RestrictionsModal({
    isOpen,
    onClose,
    currentParticipant,
    currentParticipantIndex,
    allParticipants,
    currentRestrictions,
    onSaveRestrictions
}: RestrictionsModalProps) {
    const [selectedRestrictions, setSelectedRestrictions] = useState<number[]>([]);

    // Update selected restrictions when modal opens or current restrictions change
    useEffect(() => {
        setSelectedRestrictions(currentRestrictions);
    }, [currentRestrictions, isOpen]);

    const handleCheckboxChange = (participantIndex: number, isChecked: boolean) => {
        setSelectedRestrictions(prev => {
            if (isChecked) {
                return [...prev, participantIndex];
            } else {
                return prev.filter(index => index !== participantIndex);
            }
        });
    };

    const handleSave = () => {
        onSaveRestrictions(currentParticipantIndex, selectedRestrictions);
        onClose();
    };

    const handleCancel = () => {
        setSelectedRestrictions(currentRestrictions); // Reset to original state
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg mr-3">
                            <UserX className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Set Restrictions
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                for {currentParticipant.name}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleCancel}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                            Select participants that <strong>{currentParticipant.name}</strong> should <strong>not</strong> be matched with:
                        </p>
                    </div>

                    {/* Participants List */}
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                        {allParticipants.map((participant, index) => {
                            // Skip the current participant
                            if (index === currentParticipantIndex) return null;

                            const isSelected = selectedRestrictions.includes(index);
                            const hasName = participant.name.trim();
                            const hasEmail = participant.email.trim();

                            return (
                                <label
                                    key={index}
                                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                                        isSelected 
                                            ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20' 
                                            : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                                    } ${
                                        !hasName || !hasEmail
                                            ? 'opacity-50 cursor-not-allowed'
                                            : ''
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        disabled={!hasName || !hasEmail}
                                        onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                                        className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 focus:ring-2 disabled:opacity-50"
                                    />
                                    <div className="ml-3 flex-1">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {hasName ? participant.name : `Participant ${index + 1}`}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {hasEmail ? participant.email : 'Email not set'}
                                                </p>
                                                {!hasName || !hasEmail ? (
                                                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                                        Complete participant info to enable restrictions
                                                    </p>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </label>
                            );
                        })}
                    </div>

                    {allParticipants.filter((_, index) => index !== currentParticipantIndex).length === 0 && (
                        <div className="text-center py-6">
                            <UserX className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                No other participants available for restrictions
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    >
                        Save Restrictions
                    </button>
                </div>
            </div>
        </div>
    );
}