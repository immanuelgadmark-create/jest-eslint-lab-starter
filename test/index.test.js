const { capitalizeWords, filterActiveUsers, logAction } = require('../index');

describe('capitalizeWords', () => {
    test('capitalizes the first letter of each word', () => {
        expect(capitalizeWords('hello world')).toBe('Hello World');
    });

    test('capitalizes a single word', () => {
        expect(capitalizeWords('hello')).toBe('Hello');
    });

    test('returns an empty string for an empty string', () => {
        expect(capitalizeWords('')).toBe('');
    });

    test('leaves already capitalized words unchanged', () => {
        expect(capitalizeWords('Hello World')).toBe('Hello World');
    });

    test('does not lowercase the rest of each word', () => {
        expect(capitalizeWords('hELLO wORLD')).toBe('HELLO WORLD');
    });

    test('preserves multiple spaces between words', () => {
        expect(capitalizeWords('hello   world')).toBe('Hello   World');
    });

    test('capitalizes words separated by hyphens', () => {
        expect(capitalizeWords('hello-world')).toBe('Hello-World');
    });

    test('handles words that start with a digit', () => {
        expect(capitalizeWords('3rd place')).toBe('3rd Place');
    });

    test('throws a TypeError for non-string input', () => {
        expect(() => capitalizeWords(null)).toThrow(TypeError);
        expect(() => capitalizeWords(undefined)).toThrow(TypeError);
        expect(() => capitalizeWords(42)).toThrow(TypeError);
    });
});

describe('filterActiveUsers', () => {
    test('returns only active users', () => {
        const users = [
            { name: 'Alice', isActive: true },
            { name: 'Bob', isActive: false }
        ];
        expect(filterActiveUsers(users)).toEqual([{ name: 'Alice', isActive: true }]);
    });

    test('returns all users when all are active', () => {
        const users = [
            { name: 'Alice', isActive: true },
            { name: 'Bob', isActive: true }
        ];
        expect(filterActiveUsers(users)).toEqual(users);
    });

    test('returns an empty array when no users are active', () => {
        const users = [
            { name: 'Alice', isActive: false },
            { name: 'Bob', isActive: false }
        ];
        expect(filterActiveUsers(users)).toEqual([]);
    });

    test('returns an empty array for an empty array', () => {
        expect(filterActiveUsers([])).toEqual([]);
    });

    test('excludes users without an isActive property', () => {
        const users = [{ name: 'Alice' }, { name: 'Bob', isActive: true }];
        expect(filterActiveUsers(users)).toEqual([{ name: 'Bob', isActive: true }]);
    });

    test('does not mutate the original array', () => {
        const users = [
            { name: 'Alice', isActive: true },
            { name: 'Bob', isActive: false }
        ];
        const copy = JSON.parse(JSON.stringify(users));
        filterActiveUsers(users);
        expect(users).toEqual(copy);
    });

    test('throws a TypeError for non-array input', () => {
        expect(() => filterActiveUsers(null)).toThrow(TypeError);
        expect(() => filterActiveUsers(undefined)).toThrow(TypeError);
    });
});

describe('logAction', () => {
    afterEach(() => {
        jest.useRealTimers();
    });

    test('returns a message with the user, action and exact timestamp', () => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2024-11-27T12:00:00Z'));
        expect(logAction('login', 'Alice')).toBe(
            'User Alice performed login at 2024-11-27T12:00:00.000Z'
        );
    });

    test('includes an ISO 8601 timestamp', () => {
        expect(logAction('logout', 'Bob')).toMatch(
            /^User Bob performed logout at \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
        );
    });

    test('uses the given username and action', () => {
        const message = logAction('upload', 'Carol');
        expect(message).toContain('Carol');
        expect(message).toContain('upload');
    });
});
