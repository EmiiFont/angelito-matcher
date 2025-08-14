import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventsAPI, type CreateEventRequest } from '../events';
import { Matching } from '../../lib/matching';

// Mock the matching module
vi.mock('../../lib/matching', () => ({
  Matching: {
    matchParticipants: vi.fn()
  }
}));

// Mock database implementation
class MockDatabase {
  private events: any[] = [];
  private participants: any[] = [];
  private userParticipants: any[] = [];
  private eventParticipantMatches: any[] = [];
  private participantRestrictions: any[] = [];
  private participantMatchViews: any[] = [];

  constructor() {
    this.reset();
  }

  reset() {
    this.events = [];
    this.participants = [];
    this.userParticipants = [];
    this.eventParticipantMatches = [];
    this.participantRestrictions = [];
    this.participantMatchViews = [];
  }

  // Mock drizzle query builder pattern
  select(fields?: any) {
    return {
      from: (table: any) => ({
        where: (condition: any) => ({
          limit: (count: number) => this.mockSelect(table, condition, count),
          execute: () => this.mockSelect(table, condition)
        }),
        execute: () => this.mockSelect(table)
      })
    };
  }

  insert(table: any) {
    return {
      values: (data: any) => ({
        returning: () => this.mockInsert(table, data)
      }),
      execute: () => this.mockInsert(table)
    };
  }

  update(table: any) {
    return {
      set: (data: any) => ({
        where: (condition: any) => ({
          returning: () => this.mockUpdate(table, data, condition)
        })
      })
    };
  }

  private mockSelect(table: any, condition?: any, limit?: number) {
    const tableName = this.getTableName(table);
    let data = this.getTableData(tableName);
    
    if (condition) {
      // Simple mock filtering - in real tests you'd implement proper condition matching
      data = data.filter(() => false); // Simplified - returns empty for unknown conditions
    }
    
    if (limit) {
      data = data.slice(0, limit);
    }
    
    return Promise.resolve(data);
  }

  private mockInsert(table: any, data?: any) {
    const tableName = this.getTableName(table);
    const tableData = this.getTableData(tableName);
    
    if (data) {
      if (Array.isArray(data)) {
        tableData.push(...data);
        return Promise.resolve(data);
      } else {
        tableData.push(data);
        return Promise.resolve([data]);
      }
    }
    
    return Promise.resolve([]);
  }

  private mockUpdate(table: any, data: any, condition: any) {
    // Simplified update mock
    return Promise.resolve([data]);
  }

  private getTableName(table: any): string {
    // This would need to be adapted based on your actual table objects
    if (table === 'events') return 'events';
    if (table === 'participants') return 'participants';
    if (table === 'userParticipants') return 'userParticipants';
    if (table === 'eventParticipantMatches') return 'eventParticipantMatches';
    if (table === 'participantRestrictions') return 'participantRestrictions';
    if (table === 'participantMatchViews') return 'participantMatchViews';
    return 'unknown';
  }

  private getTableData(tableName: string): any[] {
    switch (tableName) {
      case 'events': return this.events;
      case 'participants': return this.participants;
      case 'userParticipants': return this.userParticipants;
      case 'eventParticipantMatches': return this.eventParticipantMatches;
      case 'participantRestrictions': return this.participantRestrictions;
      case 'participantMatchViews': return this.participantMatchViews;
      default: return [];
    }
  }

  // Mock transaction method
  async transaction<T>(callback: (tx: any) => Promise<T>): Promise<T> {
    // For testing purposes, we'll just pass this mock instance as the transaction
    // In a real transaction, all operations would be atomic
    return await callback(this);
  }
}

describe('EventsAPI', () => {
  let eventsAPI: EventsAPI;
  let mockDb: MockDatabase;
  
  beforeEach(() => {
    mockDb = new MockDatabase();
    eventsAPI = new EventsAPI(mockDb as any);
    
    // Reset mocks
    vi.clearAllMocks();
    
    // Setup default mock for matching algorithm
    (Matching.matchParticipants as any).mockReturnValue([
      ['alice@test.com', 'bob@test.com'],
      ['bob@test.com', 'alice@test.com']
    ]);
  });

  describe('create function', () => {
    const validEventData: CreateEventRequest = {
      name: 'Test Event',
      date: '2024-12-25',
      budget: 50,
      location: 'Test Location',
      userId: 'user-123',
      participants: [
        {
          name: 'Alice',
          email: 'alice@test.com',
          phoneNumber: '+1234567890'
        },
        {
          name: 'Bob', 
          email: 'bob@test.com',
          phoneNumber: '+1234567891'
        }
      ]
    };

    it('should create an event successfully with valid data', async () => {
      const result = await eventsAPI.create(validEventData);

      expect(result).toBeDefined();
      expect(result.name).toBe('Test Event');
      expect(result.budget).toBe(50);
      expect(result.location).toBe('Test Location');
      expect(result.numberOfParticipants).toBe(2);
    });

    it('should generate unique event ID', async () => {
      const result1 = await eventsAPI.create(validEventData);
      const result2 = await eventsAPI.create({
        ...validEventData,
        name: 'Different Event'
      });

      expect(result1.id).toBeDefined();
      expect(result2.id).toBeDefined();
      expect(result1.id).not.toBe(result2.id);
    });

    it('should handle date conversion correctly', async () => {
      const dateString = '2024-12-25';
      const result = await eventsAPI.create({
        ...validEventData,
        date: dateString
      });

      expect(result.date).toBeInstanceOf(Date);
      expect(result.date.toISOString()).toContain('2024-12-25');
    });

    it('should set correct number of participants', async () => {
      const threeParticipants = {
        ...validEventData,
        participants: [
          ...validEventData.participants,
          {
            name: 'Charlie',
            email: 'charlie@test.com', 
            phoneNumber: '+1234567892'
          }
        ]
      };

      const result = await eventsAPI.create(threeParticipants);
      expect(result.numberOfParticipants).toBe(3);
    });

    it('should call matching algorithm with correct parameters', async () => {
      await eventsAPI.create(validEventData);

      expect(Matching.matchParticipants).toHaveBeenCalledWith(
        ['alice@test.com', 'bob@test.com'],
        {}
      );
    });

    it('should handle participants with restrictions', async () => {
      const eventWithRestrictions = {
        ...validEventData,
        participants: [
          {
            name: 'Alice',
            email: 'alice@test.com',
            phoneNumber: '+1234567890',
            restrictions: ['bob@test.com']
          },
          {
            name: 'Bob',
            email: 'bob@test.com', 
            phoneNumber: '+1234567891'
          }
        ]
      };

      await eventsAPI.create(eventWithRestrictions);

      expect(Matching.matchParticipants).toHaveBeenCalledWith(
        ['alice@test.com', 'bob@test.com'],
        {
          'alice@test.com': ['bob@test.com']
        }
      );
    });

    it('should handle empty restrictions array', async () => {
      const eventWithEmptyRestrictions = {
        ...validEventData,
        participants: [
          {
            name: 'Alice',
            email: 'alice@test.com',
            phoneNumber: '+1234567890',
            restrictions: []
          },
          {
            name: 'Bob',
            email: 'bob@test.com',
            phoneNumber: '+1234567891'
          }
        ]
      };

      await eventsAPI.create(eventWithEmptyRestrictions);

      expect(Matching.matchParticipants).toHaveBeenCalledWith(
        ['alice@test.com', 'bob@test.com'],
        {}
      );
    });

    it('should handle participants without userId', async () => {
      const eventWithoutUserId = {
        ...validEventData,
        userId: undefined
      };

      const result = await eventsAPI.create(eventWithoutUserId);
      expect(result).toBeDefined();
      expect(result.name).toBe('Test Event');
    });

    it('should handle complex restriction scenarios', async () => {
      const complexEvent = {
        ...validEventData,
        participants: [
          {
            name: 'Alice',
            email: 'alice@test.com',
            phoneNumber: '+1234567890',
            restrictions: ['bob@test.com', 'charlie@test.com']
          },
          {
            name: 'Bob',
            email: 'bob@test.com',
            phoneNumber: '+1234567891',
            restrictions: ['alice@test.com']
          },
          {
            name: 'Charlie',
            email: 'charlie@test.com',
            phoneNumber: '+1234567892'
          }
        ]
      };

      await eventsAPI.create(complexEvent);

      expect(Matching.matchParticipants).toHaveBeenCalledWith(
        ['alice@test.com', 'bob@test.com', 'charlie@test.com'],
        {
          'alice@test.com': ['bob@test.com', 'charlie@test.com'],
          'bob@test.com': ['alice@test.com']
        }
      );
    });

    it('should filter out invalid restriction emails', async () => {
      const eventWithInvalidRestrictions = {
        ...validEventData,
        participants: [
          {
            name: 'Alice',
            email: 'alice@test.com',
            phoneNumber: '+1234567890',
            restrictions: ['bob@test.com', 'nonexistent@test.com'] // nonexistent participant
          },
          {
            name: 'Bob',
            email: 'bob@test.com',
            phoneNumber: '+1234567891'
          }
        ]
      };

      await eventsAPI.create(eventWithInvalidRestrictions);

      // Should only include restrictions for participants that actually exist
      expect(Matching.matchParticipants).toHaveBeenCalledWith(
        ['alice@test.com', 'bob@test.com'],
        {
          'alice@test.com': ['bob@test.com'] // nonexistent@test.com should be filtered out
        }
      );
    });

    it('should handle large participant lists', async () => {
      const largeParticipantList = {
        ...validEventData,
        participants: Array.from({ length: 10 }, (_, i) => ({
          name: `Participant ${i + 1}`,
          email: `participant${i + 1}@test.com`,
          phoneNumber: `+123456789${i}`
        }))
      };

      const result = await eventsAPI.create(largeParticipantList);
      expect(result.numberOfParticipants).toBe(10);
      
      const expectedEmails = largeParticipantList.participants.map(p => p.email);
      expect(Matching.matchParticipants).toHaveBeenCalledWith(expectedEmails, {});
    });

    it('should set createdAt and updatedAt timestamps', async () => {
      const beforeCreate = new Date();
      const result = await eventsAPI.create(validEventData);
      const afterCreate = new Date();

      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
      expect(result.createdAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
      expect(result.updatedAt).toEqual(result.createdAt);
    });
  });

  describe('create function error scenarios', () => {
    it('should handle database insertion errors', async () => {
      // Mock database to throw error
      const failingDb = {
        insert: () => ({
          values: () => ({
            returning: () => Promise.reject(new Error('Database error'))
          })
        })
      };

      const failingAPI = new EventsAPI(failingDb as any);

      await expect(failingAPI.create({
        name: 'Test Event',
        date: '2024-12-25',
        budget: 50,
        location: 'Test Location',
        participants: [
          {
            name: 'Alice',
            email: 'alice@test.com',
            phoneNumber: '+1234567890'
          }
        ]
      })).rejects.toThrow('Failed to create event');
    });

    it('should handle matching algorithm errors', async () => {
      // Mock matching algorithm to throw error
      (Matching.matchParticipants as any).mockImplementation(() => {
        throw new Error('Matching failed');
      });

      await expect(eventsAPI.create({
        name: 'Test Event',
        date: '2024-12-25',
        budget: 50,
        location: 'Test Location',
        participants: [
          {
            name: 'Alice',
            email: 'alice@test.com',
            phoneNumber: '+1234567890'
          },
          {
            name: 'Bob',
            email: 'bob@test.com',
            phoneNumber: '+1234567891'
          }
        ]
      })).rejects.toThrow('Failed to create event');
    });

    it('should handle invalid date formats gracefully', async () => {
      const invalidDateEvent = {
        name: 'Test Event',
        date: 'invalid-date',
        budget: 50,
        location: 'Test Location',
        participants: [
          {
            name: 'Alice',
            email: 'alice@test.com',
            phoneNumber: '+1234567890'
          }
        ]
      };

      // Should create Date object even with invalid string
      const result = await eventsAPI.create(invalidDateEvent);
      expect(result.date).toBeInstanceOf(Date);
    });
  });
});