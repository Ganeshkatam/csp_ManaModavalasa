import test from 'node:test';
import assert from 'node:assert/strict';
import { authService } from './auth.js';
import { supabase } from './supabase.js';

test('authService.signIn preserves passwords with leading, trailing, and internal spaces', async () => {
    const originalSignIn = supabase.auth.signInWithPassword;
    const capturedArgs = [];

    supabase.auth.signInWithPassword = async (credentials) => {
        capturedArgs.push(credentials);
        return {
            data: { user: { id: 'admin-uuid', email: credentials.email }, session: { access_token: 'fake-token' } },
            error: null
        };
    };

    try {
        // 1. Password with leading spaces
        const leadingPassword = '   leadingSpacePass123!';
        await authService.signIn('admin@manamodavalasa.org', leadingPassword);
        assert.strictEqual(capturedArgs[0].password, leadingPassword);
        assert.strictEqual(capturedArgs[0].email, 'admin@manamodavalasa.org');

        // 2. Password with trailing spaces
        const trailingPassword = 'trailingSpacePass123!   ';
        await authService.signIn('admin@manamodavalasa.org', trailingPassword);
        assert.strictEqual(capturedArgs[1].password, trailingPassword);

        // 3. Password with both leading and trailing spaces
        const bothEndsPassword = '   pass with spaces around and inside   ';
        await authService.signIn('  admin@manamodavalasa.org  ', bothEndsPassword);
        assert.strictEqual(capturedArgs[2].password, bothEndsPassword);
        assert.strictEqual(capturedArgs[2].email, 'admin@manamodavalasa.org');
    } finally {
        supabase.auth.signInWithPassword = originalSignIn;
    }
});

test('authService.signIn trims and validates the email address', async () => {
    const originalSignIn = supabase.auth.signInWithPassword;
    let invoked = false;

    supabase.auth.signInWithPassword = async () => {
        invoked = true;
        return { data: {}, error: null };
    };

    try {
        // Invalid email format rejects before network call
        await assert.rejects(
            () => authService.signIn('not-an-email', 'valid-password'),
            /Please enter a valid email address/
        );
        assert.strictEqual(invoked, false);

        await assert.rejects(
            () => authService.signIn('', 'valid-password'),
            /Please enter a valid email address/
        );
        assert.strictEqual(invoked, false);

        await assert.rejects(
            () => authService.signIn(null, 'valid-password'),
            /Please enter a valid email address/
        );
        assert.strictEqual(invoked, false);
    } finally {
        supabase.auth.signInWithPassword = originalSignIn;
    }
});

test('authService.signIn rejects empty or missing passwords', async () => {
    await assert.rejects(
        () => authService.signIn('admin@manamodavalasa.org', ''),
        /Password is required/
    );

    await assert.rejects(
        () => authService.signIn('admin@manamodavalasa.org', null),
        /Password is required/
    );

    await assert.rejects(
        () => authService.signIn('admin@manamodavalasa.org', undefined),
        /Password is required/
    );
});
