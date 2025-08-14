import { describe, it, expect } from 'vitest';
import { Matching } from '../matching';

describe('Matching Algorithm', () => {
    describe('matchParticipants', () => {
        it('should match participants without restrictions (complete matching)', () => {
            const participants = ['alice@test.com', 'bob@test.com', 'a@bbb.com',
                'shihi@gma.com', 'hhhhh@kkk.com', 'tyoaoa@huhuh.com'];
            const matches = Matching.matchParticipants(participants);

            console.log('Matches:', matches);
            // Should create complete matching - each participant gives to exactly one person
            expect(matches).toHaveLength(6);
            
            // Ensure no self-matching
            matches.forEach(([giver, receiver]) => {
                expect(giver).not.toBe(receiver);
                expect(participants).toContain(giver);
                expect(participants).toContain(receiver);
            });
            
            // Verify each participant appears exactly once as giver
            const givers = matches.map(match => match[0]);
            expect(new Set(givers).size).toBe(6);
            participants.forEach(participant => {
                expect(givers).toContain(participant);
            });
            
            // Verify each participant appears exactly once as receiver
            const receivers = matches.map(match => match[1]);
            expect(new Set(receivers).size).toBe(6);
            participants.forEach(participant => {
                expect(receivers).toContain(participant);
            });
        });

        it('should handle 4 participants with complete matching', () => {
            const participants = ['a@test.com', 'b@test.com', 'c@test.com', 'd@test.com'];
            const matches = Matching.matchParticipants(participants);

            // Should create complete matching - 4 participants = 4 matches
            expect(matches).toHaveLength(4);

            // Check no self-matching
            matches.forEach(([giver, receiver]) => {
                expect(giver).not.toBe(receiver);
            });

            // Verify each participant appears exactly once as giver
            const givers = matches.map(match => match[0]);
            expect(new Set(givers).size).toBe(4);
            participants.forEach(participant => {
                expect(givers).toContain(participant);
            });
            
            // Verify each participant appears exactly once as receiver
            const receivers = matches.map(match => match[1]);
            expect(new Set(receivers).size).toBe(4);
            participants.forEach(participant => {
                expect(receivers).toContain(participant);
            });
        });

        it('should respect restrictions', () => {
            const participants = ['alice@test.com', 'bob@test.com', 'charlie@test.com'];
            const restrictions = {
                'alice@test.com': ['bob@test.com']
            };

            const matches = Matching.matchParticipants(participants, restrictions);

            // Alice should not be matched with Bob
            const aliceMatch = matches.find(([giver]) => giver === 'alice@test.com');
            if (aliceMatch) {
                expect(aliceMatch[1]).not.toBe('bob@test.com');
            }
        });

        it('should handle bidirectional restrictions', () => {
            const participants = ['alice@test.com', 'bob@test.com', 'charlie@test.com'];
            const restrictions = {
                'alice@test.com': ['bob@test.com'],
                'bob@test.com': ['alice@test.com']
            };

            const matches = Matching.matchParticipants(participants, restrictions);

            // Neither Alice nor Bob should be matched with each other
            matches.forEach(([giver, receiver]) => {
                if (giver === 'alice@test.com') {
                    expect(receiver).not.toBe('bob@test.com');
                }
                if (giver === 'bob@test.com') {
                    expect(receiver).not.toBe('alice@test.com');
                }
            });
        });

        it('should handle empty participant list', () => {
            const matches = Matching.matchParticipants([]);
            expect(matches).toHaveLength(0);
        });

        it('should handle single participant', () => {
            const matches = Matching.matchParticipants(['alice@test.com']);
            expect(matches).toHaveLength(0);
        });

        it('should handle complex restriction scenarios', () => {
            const participants = ['a@test.com', 'b@test.com', 'c@test.com', 'd@test.com'];
            const restrictions = {
                'a@test.com': ['b@test.com', 'c@test.com'],
                'b@test.com': ['a@test.com']
            };

            const matches = Matching.matchParticipants(participants, restrictions);

            // Verify restrictions are respected
            matches.forEach(([giver, receiver]) => {
                const giverRestrictions = restrictions[giver] || [];
                expect(giverRestrictions).not.toContain(receiver);

                const receiverRestrictions = restrictions[receiver] || [];
                expect(receiverRestrictions).not.toContain(giver);
            });
        });

        it('should produce different results on multiple runs (randomness)', () => {
            const participants = ['a@test.com', 'b@test.com', 'c@test.com', 'd@test.com'];

            const results = [];
            for (let i = 0; i < 10; i++) {
                const matches = Matching.matchParticipants(participants);
                // Sort matches to normalize comparison
                const sortedMatches = matches.sort((a, b) => a[0].localeCompare(b[0]));
                results.push(JSON.stringify(sortedMatches));
            }

            // With 4 participants, there should be some variation in results
            const uniqueResults = new Set(results);
            expect(uniqueResults.size).toBeGreaterThan(1);
            
            // Verify all results have complete matching
            for (let i = 0; i < 10; i++) {
                const matches = Matching.matchParticipants(participants);
                expect(matches).toHaveLength(4);
            }
        });

        it('should handle impossible matching scenarios gracefully', () => {
            const participants = ['alice@test.com', 'bob@test.com'];
            const restrictions = {
                'alice@test.com': ['bob@test.com'],
                'bob@test.com': ['alice@test.com']
            };

            // Both participants restrict each other - should still try to create best effort matching
            const matches = Matching.matchParticipants(participants, restrictions);

            // Should return empty array when no valid matching is possible
            expect(matches).toHaveLength(0);
        });

        it('should validate all participants exist before matching', () => {
            const participants = ['alice@test.com', 'bob@test.com'];
            const restrictionsWithNonExistent = {
                'alice@test.com': ['nonexistent@test.com', 'bob@test.com']
            };

            // Should not crash and should handle gracefully
            expect(() => {
                Matching.matchParticipants(participants, restrictionsWithNonExistent);
            }).not.toThrow();
        });

        it('should create exactly 6 matching pairs for 6 people (user requirement)', () => {
            const participants = [
                'person1@test.com', 'person2@test.com', 'person3@test.com',
                'person4@test.com', 'person5@test.com', 'person6@test.com'
            ];
            const matches = Matching.matchParticipants(participants);

            // Exactly 6 people should result in exactly 6 matching pairs
            expect(matches).toHaveLength(6);

            // Verify complete Secret Santa matching
            const givers = new Set(matches.map(match => match[0]));
            const receivers = new Set(matches.map(match => match[1]));

            // All participants should give exactly once
            expect(givers.size).toBe(6);
            participants.forEach(participant => {
                expect(givers.has(participant)).toBe(true);
            });

            // All participants should receive exactly once
            expect(receivers.size).toBe(6);
            participants.forEach(participant => {
                expect(receivers.has(participant)).toBe(true);
            });

            // No self-matching
            matches.forEach(([giver, receiver]) => {
                expect(giver).not.toBe(receiver);
            });
        });
    });

    describe('legacy compatibility', () => {
        it('should maintain backward compatibility with legacy method', () => {
            const participants = ['alice@test.com', 'bob@test.com'];
            const legacyResult = Matching.matchParticipantsLegacy(participants, {});

            expect(legacyResult).toHaveProperty('alice@test.com');
            expect(legacyResult).toHaveProperty('bob@test.com');

            // Check that at least one participant has a match
            const hasMatches = Object.values(legacyResult).some(match => match !== null);
            expect(hasMatches).toBe(true);
        });

        it('should convert tuples to legacy format correctly', () => {
            const participants = ['alice@test.com', 'bob@test.com'];
            const legacyResult = Matching.matchParticipantsLegacy(participants, {});

            // All participants should be keys in the result
            participants.forEach(participant => {
                expect(legacyResult).toHaveProperty(participant);
            });

            // Values should be either null or valid participant emails
            Object.values(legacyResult).forEach(match => {
                if (match !== null) {
                    expect(participants).toContain(match);
                }
            });
        });
    });
});
