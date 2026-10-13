import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

/**
 * JavaScript reference model mirroring the PostgreSQL sanitize_audit_payload PL/pgSQL function.
 * Validates the recursive redaction policy against test cases.
 */
function sanitizeAuditPayloadModel(data) {
    if (data === null || data === undefined) {
        return null;
    }

    if (typeof data !== 'object') {
        return data;
    }

    if (Array.isArray(data)) {
        return data.map(item => sanitizeAuditPayloadModel(item));
    }

    const clean = {};
    const secretPattern = /(password|passwd|secret|token|api_?key|auth_?code|credentials|private_?key|access_?token|refresh_?token|bearer|passcode|otp|aadhaar|ssn|national_?id)/i;
    const phonePattern = /(phone|mobile|cell|contact_phone|emergency_phone|telephone)/i;

    for (const [key, val] of Object.entries(data)) {
        const lowerKey = key.toLowerCase();

        // 1. Exclude sensitive secret / credential keys entirely
        if (secretPattern.test(lowerKey)) {
            continue;
        }

        // 2. Personal contact / phone numbers: mask digits
        if (phonePattern.test(lowerKey) && (typeof val === 'string' || typeof val === 'number')) {
            const valStr = String(val);
            const digits = valStr.replace(/\D/g, '');
            if (digits.length >= 4) {
                const masked = 'X'.repeat(Math.max(digits.length - 4, 2)) + digits.slice(-4);
                clean[key] = masked;
            } else if (digits.length > 0) {
                clean[key] = 'X'.repeat(digits.length);
            } else {
                clean[key] = valStr;
            }
            continue;
        }

        // 3. Recursive traversal for nested objects and arrays
        if (val !== null && typeof val === 'object') {
            clean[key] = sanitizeAuditPayloadModel(val);
        } else {
            clean[key] = val;
        }
    }

    return clean;
}

test('Audit trail SQL definition includes recursive sanitization policy in migration and schema.sql', () => {
    const migrationPath = path.join(rootDir, 'supabase', 'migrations', '20261010000000_create_administrative_audit_trail.sql');
    const schemaPath = path.join(rootDir, 'database', 'schema.sql');

    assert.ok(fs.existsSync(migrationPath), 'Migration file must exist');
    assert.ok(fs.existsSync(schemaPath), 'schema.sql must exist');

    const migrationContent = fs.readFileSync(migrationPath, 'utf-8');
    const schemaContent = fs.readFileSync(schemaPath, 'utf-8');

    // Verify presence of recursive array and object handling
    for (const [name, content] of [['migration', migrationContent], ['schema.sql', schemaContent]]) {
        assert.ok(
            content.includes('public.sanitize_audit_payload(elem)'),
            `${name} must include recursive array sanitization`
        );
        assert.ok(
            content.includes('public.sanitize_audit_payload(v_val)'),
            `${name} must include recursive object sanitization`
        );
        assert.ok(
            content.includes('jsonb_array_elements('),
            `${name} must parse array elements with jsonb_array_elements`
        );
        assert.ok(
            content.includes('jsonb_each('),
            `${name} must iterate key-value pairs with jsonb_each`
        );
        assert.ok(
            content.includes('aadhaar'),
            `${name} must include national identity and Aadhaar redaction`
        );
        assert.ok(
            content.includes('access_?token'),
            `${name} must redact access tokens and refresh tokens`
        );
    }
});

test('Audit payload redaction strips top-level and deeply nested authentication secrets', () => {
    const input = {
        id: '11111111-1111-1111-1111-111111111111',
        name: 'Modavalasa Village Panchayat',
        password: 'PlainTextPassword123',
        token: 'auth-jwt-token-value',
        api_key: 'sk_live_123456789',
        nested_auth: {
            refresh_token: 'secret-refresh-token',
            client_secret: 'oauth-client-secret',
            private_key: '-----BEGIN PRIVATE KEY-----',
            inner_config: {
                otp: '849201',
                passcode: '9988',
                aadhaar_number: '1234-5678-9012'
            }
        }
    };

    const sanitized = sanitizeAuditPayloadModel(input);

    // Verify top-level secrets stripped
    assert.strictEqual(sanitized.password, undefined);
    assert.strictEqual(sanitized.token, undefined);
    assert.strictEqual(sanitized.api_key, undefined);

    // Verify nested secrets stripped
    assert.strictEqual(sanitized.nested_auth.refresh_token, undefined);
    assert.strictEqual(sanitized.nested_auth.client_secret, undefined);
    assert.strictEqual(sanitized.nested_auth.private_key, undefined);

    // Verify deeply nested secrets stripped
    assert.strictEqual(sanitized.nested_auth.inner_config.otp, undefined);
    assert.strictEqual(sanitized.nested_auth.inner_config.passcode, undefined);
    assert.strictEqual(sanitized.nested_auth.inner_config.aadhaar_number, undefined);

    // Verify non-sensitive fields preserved
    assert.strictEqual(sanitized.id, '11111111-1111-1111-1111-111111111111');
    assert.strictEqual(sanitized.name, 'Modavalasa Village Panchayat');
});

test('Audit payload redaction sanitizes arrays of objects recursively', () => {
    const input = {
        title: 'Community Survey Batch',
        volunteers: [
            { name: 'Student A', phone: '9848011223', token: 'temp-volunteer-token' },
            { name: 'Student B', mobile: '08922-245678', password_hash: 'sha256$hashed' }
        ]
    };

    const sanitized = sanitizeAuditPayloadModel(input);

    assert.strictEqual(sanitized.title, 'Community Survey Batch');
    assert.strictEqual(sanitized.volunteers.length, 2);

    // Volunteer 1
    assert.strictEqual(sanitized.volunteers[0].name, 'Student A');
    assert.strictEqual(sanitized.volunteers[0].token, undefined);
    assert.strictEqual(sanitized.volunteers[0].phone, 'XXXXXX1223');

    // Volunteer 2 (11 digits: 7 masked + 4 visible)
    assert.strictEqual(sanitized.volunteers[1].name, 'Student B');
    assert.strictEqual(sanitized.volunteers[1].password_hash, undefined);
    assert.strictEqual(sanitized.volunteers[1].mobile, 'XXXXXXX5678');
});

test('Audit payload redaction masks alternate personal phone fields at any depth', () => {
    const input = {
        institution: 'Primary Health Centre',
        contact_phone: '9848099887',
        metadata: {
            emergency_phone: '108',
            supervisor: {
                telephone: '9440012345',
                office_phone: '08922234567'
            }
        }
    };

    const sanitized = sanitizeAuditPayloadModel(input);

    assert.strictEqual(sanitized.institution, 'Primary Health Centre');
    assert.strictEqual(sanitized.contact_phone, 'XXXXXX9887');
    assert.strictEqual(sanitized.metadata.emergency_phone, 'XXX');
    assert.strictEqual(sanitized.metadata.supervisor.telephone, 'XXXXXX2345');
    assert.strictEqual(sanitized.metadata.supervisor.office_phone, 'XXXXXXX4567');
});

test('Audit payload redaction handles null and primitives gracefully', () => {
    assert.strictEqual(sanitizeAuditPayloadModel(null), null);
    assert.strictEqual(sanitizeAuditPayloadModel(undefined), null);
    assert.strictEqual(sanitizeAuditPayloadModel('simple text'), 'simple text');
    assert.strictEqual(sanitizeAuditPayloadModel(42), 42);
    assert.strictEqual(sanitizeAuditPayloadModel(true), true);
    assert.deepStrictEqual(sanitizeAuditPayloadModel([]), []);
    assert.deepStrictEqual(sanitizeAuditPayloadModel({}), {});
});
