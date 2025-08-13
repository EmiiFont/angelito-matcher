# Unit Tests for EventsAPI

This directory contains comprehensive unit tests for the `EventsAPI.create()` function, allowing you to test the core functionality without running the full project.

## 🚀 Quick Test Run

**Option 1: Simulation (No dependencies required)**
```bash
node run-tests.js
```

**Option 2: Full Vitest Suite (Requires installation)**
```bash
# Install dependencies
npm install

# Run tests
npm run test:run
```

## 📁 Test Structure

```
worker/
├── api/
│   ├── events.ts                 # Main EventsAPI implementation
│   └── __tests__/
│       └── events.test.ts        # Comprehensive unit tests
├── lib/
│   ├── matching.ts              # Matching algorithm
│   └── __tests__/
│       └── matching.test.ts     # Matching algorithm tests
└── run-tests.js                 # Standalone test runner
```

## 🧪 Test Coverage

### EventsAPI.create() Function Tests

**✅ Success Scenarios:**
- ✨ Event creation with valid data
- 🆔 Unique ID generation
- 📅 Date conversion handling  
- 👥 Participant count validation
- 🚫 Restriction processing
- ⏰ Timestamp generation
- 🔄 User-participant associations
- 🎯 Matching algorithm integration

**❌ Error Scenarios:**
- 📝 Missing required fields
- 👤 Insufficient participants  
- 💾 Database insertion errors
- 🎲 Matching algorithm failures
- 📅 Invalid date formats

### Matching Algorithm Tests

**✅ Core Functionality:**
- 🎯 Basic participant matching
- 🚫 Restriction compliance
- 🔄 Bidirectional restrictions
- 🎲 Randomness verification
- 🔧 Edge case handling

## 📋 Test Scenarios Covered

### 1. Basic Event Creation
```typescript
const eventData = {
  name: 'Christmas Party 2024',
  date: '2024-12-25',
  budget: 50,
  location: 'Office',
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
```

### 2. Participants with Restrictions
```typescript
const participantsWithRestrictions = [
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
  }
];
```

### 3. Database Operations Tested
- ✅ Event insertion
- ✅ Participant creation/updating
- ✅ User-participant associations
- ✅ Restriction storage
- ✅ Match generation and storage

## 🛠 Mock Database Implementation

The tests use a comprehensive mock database that simulates:

- **Drizzle ORM query patterns**
- **Table relationships** 
- **Unique constraints**
- **Data persistence**
- **Error scenarios**

## 🎯 Key Test Benefits

1. **No Project Startup Required**: Tests run independently
2. **Fast Execution**: Mock database for instant feedback
3. **Comprehensive Coverage**: All code paths tested
4. **Error Simulation**: Database and algorithm failures
5. **Edge Case Validation**: Empty data, invalid inputs
6. **Randomness Testing**: Algorithm variation verification

## 📊 Running Specific Test Categories

```bash
# Run all tests
npm run test

# Run only EventsAPI tests  
npm run test events.test.ts

# Run only Matching tests
npm run test matching.test.ts

# Run tests with UI
npm run test:ui

# Run tests in watch mode
npm run test
```

## 🔍 Test Output Example

```
📁 EventsAPI create function
  ✅ should create an event successfully with valid data
  ✅ should generate unique event IDs
  ✅ should handle date conversion correctly
  ✅ should set correct number of participants
  ✅ should handle participants with restrictions
  ✅ should set timestamps correctly

📁 EventsAPI error scenarios  
  ✅ should throw error for missing event name
  ✅ should throw error for insufficient participants

📊 Test Results:
   Total: 8
   ✅ Passed: 8  
   ❌ Failed: 0
   📈 Success Rate: 100%
```

## 🚨 Common Test Scenarios

**✅ Valid Event Creation:**
- All required fields present
- Multiple participants with/without restrictions
- Proper data type conversions
- Successful database operations

**❌ Error Conditions:**
- Missing event name/location
- Insufficient participants (< 2)
- Database connection failures
- Matching algorithm errors

**🎯 Business Logic:**
- Restriction validation and filtering
- Match generation compliance
- User association handling
- Timestamp accuracy

## 💡 Extending Tests

To add new test cases:

1. **Add to events.test.ts** for API functionality
2. **Add to matching.test.ts** for algorithm logic
3. **Update mock database** for new table operations
4. **Run tests** to verify new scenarios

This test suite ensures the `EventsAPI.create()` function works correctly across all scenarios without requiring the full application to be running.