import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserCheck } from 'lucide-react';

interface Person {
  name: string;
  email: string;
  phone?: string;
}

interface JoinedParticipantsProps {
  participantLink: string | null;
  joinedParticipants: Person[];
  selectJoinedParticipant: (participant: Person, index: number) => void;
}

export function JoinedParticipants({ participantLink, joinedParticipants, selectJoinedParticipant }: JoinedParticipantsProps) {
  if (!participantLink || joinedParticipants.length === 0) return null;

  return (
    <div className="lg:col-span-1">
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 sticky top-6">
        <CardContent className="p-0">
          <div className="border-b border-gray-100 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <UserCheck className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
              <h3 className="text-sm font-normal text-gray-900 dark:text-white">Joined Participants</h3>
              <span className="ml-2 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full">
                {joinedParticipants.length}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Select participants to add them to your event</p>
          </div>
          <div className="p-4 max-h-96 overflow-y-auto">
            <div className="space-y-3">
              {joinedParticipants.map((participant, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors bg-white dark:bg-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-1">
                        <div className="w-6 h-6 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mr-2">
                          <span className="text-green-600 dark:text-green-400 text-xs font-normal">
                            {participant.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm font-normal text-gray-900 dark:text-white truncate">{participant.name}</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-1">{participant.email}</p>
                      {participant.phone && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{participant.phone}</p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => selectJoinedParticipant(participant, index)}
                      className="ml-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 dark:from-green-400 dark:to-green-500 dark:hover:from-green-500 dark:hover:to-green-600 text-white text-xs px-3 py-1 h-7 shadow-lg transition-all duration-200"
                    >
                      <ArrowLeft className="h-3 w-3 mr-1" />
                      Select
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default JoinedParticipants;
