export class Matching {
    // match participants randomly to other participants respecting
    // the restrictions passed.

    /**
     * Shuffles an array using Fisher-Yates algorithm
     */
    private static shuffle<T>(array: T[]): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Checks if a participant can be matched with another based on restrictions
     */
    private static canMatch(
        giver: string,
        receiver: string,
        restrictions: Record<string, string[]>
    ): boolean {
        if (giver === receiver) return false;

        // Check if giver is restricted from giving to receiver
        if (restrictions[giver]?.includes(receiver)) return false;

        // Check if receiver is restricted from receiving from giver (bidirectional check)
        if (restrictions[receiver]?.includes(giver)) return false;

        return true;
    }

    /**
     * Creates a complete circular matching where each participant gives to exactly one person
     * and receives from exactly one person (Secret Santa style)
     */
    private static createCircularMatching(
        participants: string[],
        restrictions: Record<string, string[]>
    ): [string, string][] | null {
        const maxAttempts = 1000;
        
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            // Create a random permutation for circular matching
            const shuffledParticipants = this.shuffle([...participants]);
            const matches: [string, string][] = [];
            let valid = true;
            
            // Create circular matches: person i gives to person (i+1) % length
            for (let i = 0; i < shuffledParticipants.length; i++) {
                const giver = shuffledParticipants[i];
                const receiver = shuffledParticipants[(i + 1) % shuffledParticipants.length];
                
                // Check if this match is valid based on restrictions
                if (!this.canMatch(giver, receiver, restrictions)) {
                    valid = false;
                    break;
                }
                
                matches.push([giver, receiver]);
            }
            
            if (valid) {
                return matches;
            }
        }
        
        return null; // Could not find valid circular matching
    }

    /**
     * Attempts to find a valid complete matching using random permutation
     * Each person gives to exactly one person and receives from exactly one person
     */
    private static findCompleteMatching(
        participants: string[],
        restrictions: Record<string, string[]>
    ): [string, string][] | null {
        const maxAttempts = 1000;
        
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            // Create a random permutation of receivers
            const receivers = this.shuffle([...participants]);
            const matches: [string, string][] = [];
            let valid = true;
            
            // Try to match each giver with the corresponding receiver in the permutation
            for (let i = 0; i < participants.length; i++) {
                const giver = participants[i];
                const receiver = receivers[i];
                
                // Check if this creates a valid match (no self-matching and respects restrictions)
                if (!this.canMatch(giver, receiver, restrictions)) {
                    valid = false;
                    break;
                }
                
                matches.push([giver, receiver]);
            }
            
            if (valid) {
                return matches;
            }
        }
        
        return null;
    }

    /**
     * Matches participants randomly while respecting restrictions
     * Returns array of tuples [giver, receiver] where each participant gives to exactly one person
     * and receives from exactly one person (complete Secret Santa matching)
     */
    static matchParticipants(
        participants: string[],
        restrictions: Record<string, string[]> = {}
    ): [string, string][] {
        if (participants.length < 2) {
            return [];
        }

        // Try circular matching first (often works well for Secret Santa)
        const circularMatch = this.createCircularMatching(participants, restrictions);
        if (circularMatch !== null) {
            return circularMatch;
        }

        // Try complete random permutation matching
        const completeMatch = this.findCompleteMatching(participants, restrictions);
        if (completeMatch !== null) {
            return completeMatch;
        }

        // If no complete matching possible, create best-effort matching
        return this.createBestEffortMatching(participants, restrictions);
    }

    /**
     * Creates a best-effort complete matching when perfect circular matching isn't possible
     * Attempts to ensure everyone gives to exactly one person and receives from exactly one person
     */
    private static createBestEffortMatching(
        participants: string[],
        restrictions: Record<string, string[]>
    ): [string, string][] {
        const maxAttempts = 1000;
        
        // First try to create a complete matching similar to findCompleteMatching
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const receivers = this.shuffle([...participants]);
            const matches: [string, string][] = [];
            let validMatches = 0;
            
            // Try to match each participant with a receiver from shuffled list
            for (let i = 0; i < participants.length; i++) {
                const giver = participants[i];
                const receiver = receivers[i];
                
                if (this.canMatch(giver, receiver, restrictions)) {
                    matches.push([giver, receiver]);
                    validMatches++;
                }
            }
            
            // If we got a complete matching, return it
            if (validMatches === participants.length) {
                return matches;
            }
        }
        
        // If complete matching fails, fall back to partial matching
        // but still try to maximize the number of matches
        const matches: [string, string][] = [];
        const usedAsGiver = new Set<string>();
        const usedAsReceiver = new Set<string>();
        const shuffledParticipants = this.shuffle(participants);

        for (const giver of shuffledParticipants) {
            if (usedAsGiver.has(giver)) continue;

            // Find best available receiver (not used as receiver yet)
            const availableReceivers = participants.filter(p =>
                !usedAsReceiver.has(p) &&
                giver !== p &&
                this.canMatch(giver, p, restrictions)
            );

            if (availableReceivers.length > 0) {
                const receiver = availableReceivers[Math.floor(Math.random() * availableReceivers.length)];
                matches.push([giver, receiver]);
                usedAsGiver.add(giver);
                usedAsReceiver.add(receiver);
            }
        }

        return matches;
    }

    /**
     * Legacy method for backward compatibility
     * @deprecated Use matchParticipants instead
     */
    static matchParticipantsLegacy(
        participants: string[],
        restrictions: Record<string, string[]>
    ): Record<string, string | null> {
        const tuples = this.matchParticipants(participants, restrictions);
        const result: Record<string, string | null> = {};

        // Initialize all participants with null
        participants.forEach(p => result[p] = null);

        // Fill in the matches
        tuples.forEach(([giver, receiver]) => {
            result[giver] = receiver;
        });

        return result;
    }
}
