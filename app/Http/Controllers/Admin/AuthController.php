<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Actions\Admin\RecordAdminAuditLogAction;
use App\Http\Requests\Admin\AdminLoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

final class AuthController
{
    public function __construct(
        private readonly RecordAdminAuditLogAction $auditLog,
    ) {}

    public function showLogin(Request $request): Response|RedirectResponse
    {
        if ($request->user()?->is_owner === true) {
            return redirect()->route('admin.dashboard');
        }

        return Inertia::render('Admin/Login');
    }

    public function login(AdminLoginRequest $request): RedirectResponse
    {
        $credentials = $request->only('email', 'password');
        $remember = (bool) $request->boolean('remember');

        if (! Auth::attempt($credentials, $remember)) {
            $this->auditLog->execute(
                request: $request,
                action: 'login_failed',
                metadata: ['email_hash' => hash('sha256', strtolower((string) $request->input('email')))],
            );

            return back()
                ->withErrors(['email' => 'Invalid credentials.'])
                ->onlyInput('email');
        }

        if ($request->user()?->is_owner !== true) {
            $this->auditLog->execute(
                request: $request,
                action: 'login_denied_non_owner',
            );

            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return back()
                ->withErrors(['email' => 'Owner privileges are required to sign in.'])
                ->onlyInput('email');
        }

        $request->session()->regenerate();
        $this->auditLog->execute(request: $request, action: 'login_success');

        return redirect()->intended(route('admin.dashboard'));
    }

    public function logout(Request $request): RedirectResponse
    {
        $this->auditLog->execute(request: $request, action: 'logout');

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }
}
