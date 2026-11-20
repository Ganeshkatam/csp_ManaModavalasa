import { test } from 'node:test';
import assert from 'node:assert';
import { contactService } from './contacts.js';

test('contactService.getEmergencyHelplines returns empty array when unconfigured without fake fallbacks', async () => {
    const result = await contactService.getEmergencyHelplines();
    assert.deepStrictEqual(result, []);
    const hasFakeHardcoded = result.some(item => item.id === '108' && item.verified_on === '2026-09-01' && item.source === 'AP Health Dept');
    assert.strictEqual(hasFakeHardcoded, false, 'Must not return fake hardcoded fallback emergency objects');
});

test('contactService.getEmergencyHelplines queries client and returns real database data', async () => {
    const mockHelplines = [
        { id: 'uuid-108', phone: '108', name: '108 Emergency Ambulance', status: 'published' },
        { id: 'uuid-100', phone: '100', name: '100 Police Emergency', status: 'published' }
    ];
    const mockClient = {
        from: (table) => {
            assert.strictEqual(table, 'contacts');
            return {
                select: () => ({
                    eq: () => ({
                        in: () => ({
                            order: async () => ({ data: mockHelplines, error: null })
                        })
                    })
                })
            };
        }
    };

    const res = await contactService.getEmergencyHelplines(mockClient);
    assert.deepStrictEqual(res, mockHelplines);
});

test('contactService.getEmergencyHelplines propagates database errors instead of swallowing and returning fake fallbacks', async () => {
    const mockClient = {
        from: () => ({
            select: () => ({
                eq: () => ({
                    in: () => ({
                        order: async () => ({ data: null, error: new Error('PostgreSQL connection timeout') })
                    })
                })
            })
        })
    };

    await assert.rejects(
        () => contactService.getEmergencyHelplines(mockClient),
        /PostgreSQL connection timeout/
    );
});

test('contactService.getContacts filters by category and search keyword correctly with mock client', async () => {
    const mockContacts = [
        { id: 'c1', name: 'Panchayat Secretary', designation: 'Secretary', category: 'Administration', phone: '9951871501' },
        { id: 'c2', name: 'Ambulance 108', designation: 'Driver', category: 'Emergency', phone: '108' }
    ];
    const builder = {
        eq: () => builder,
        order: () => builder,
        limit: () => builder,
        then: (resolve) => resolve({ data: mockContacts, error: null })
    };
    const mockClient = {
        from: (table) => {
            assert.strictEqual(table, 'contacts');
            return {
                select: () => builder
            };
        }
    };

    const res = await contactService.getContacts({ category: 'Emergency', search: '108' }, mockClient);
    assert.strictEqual(res.length, 1);
    assert.strictEqual(res[0].id, 'c2');
});
