<template>
  <div class="auth-page">
    <div class="container container--public">
      <div class="auth-shell">
        <section class="auth-info hide-mobile">
          <div class="info-card">
            <div class="eyebrow">Start taking payments</div>
            <h1>Create your account</h1>
            <p class="info-copy">
              Launch in minutes. Build a secure payment link and share it with
              customers instantly.
            </p>
            <ul class="info-list">
              <li>Branded payment links</li>
              <li>Instant email receipts</li>
              <li>Bank-level security</li>
            </ul>
          </div>
        </section>

        <section class="auth-card">
          <div class="card-header">
            <h2>Register</h2>
            <p class="muted">Create your PayByLink workspace.</p>
          </div>

          <button class="oauth-btn">
            <span class="google-mark"></span>
            Continue with Google
          </button>

          <div class="divider">
            <span>or</span>
          </div>

          <form class="auth-form">
            <label class="field">
              <span>Business name</span>
              <input type="text" placeholder="Nova Studio LLC" />
            </label>
            <label class="field">
              <span>Email</span>
              <input type="email" placeholder="you@company.com" />
            </label>
            <label class="field">
              <span>Password</span>
              <input type="password" placeholder="Create a password" />
            </label>
            <button class="primary-btn" type="button">Create account</button>
          </form>

          <p class="switch">
            Already have an account?
            <RouterLink to="/login">Sign in</RouterLink>
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>

<style scoped>
.auth-page {
  background: var(--bg);
  min-height: calc(100vh - 120px);
  padding-block: 40px;
}

.auth-shell {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 32px;
  align-items: stretch;
}

.auth-info {
  background: linear-gradient(135deg, var(--accent-50), #ffffff);
  border-radius: var(--r-lg);
  padding: 28px;
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
}

.info-card h1 {
  margin: 10px 0 12px;
}

.eyebrow {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent-600);
  font-weight: 700;
}

.info-copy {
  color: var(--muted);
  margin-bottom: 18px;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 8px;
  color: var(--text-2);
}

.info-list li::before {
  content: "• ";
  color: var(--accent-600);
}

.auth-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  padding: 24px;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-header h2 {
  margin: 0 0 6px;
}

.oauth-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px solid var(--border);
  background: #fff;
  color: var(--text);
  padding: 10px 12px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
}

.google-mark {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  background:
    conic-gradient(
      #ea4335 0deg 90deg,
      #fbbc05 90deg 180deg,
      #34a853 180deg 270deg,
      #4285f4 270deg 360deg
    );
}

.divider {
  position: relative;
  text-align: center;
  color: var(--muted-2);
  font-size: 12px;
}

.divider::before,
.divider::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 42%;
  height: 1px;
  background: var(--border);
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.auth-form {
  display: grid;
  gap: 12px;
}

.field {
  display: grid;
  gap: 6px;
  font-size: 13px;
  color: var(--text-2);
}

.field input {
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--input-border);
  background: var(--input-bg);
  font-size: 14px;
}

.field input:focus {
  border-color: var(--accent-400);
  box-shadow: 0 0 0 3px var(--focus);
}

.primary-btn {
  background: var(--accent-600);
  color: #fff;
  border: none;
  padding: 11px 12px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
}

.switch {
  font-size: 13px;
  color: var(--muted);
}

.switch a {
  color: var(--accent-600);
  text-decoration: none;
  font-weight: 600;
}

.muted {
  color: var(--muted);
}

@media (max-width: 900px) {
  .auth-shell {
    grid-template-columns: 1fr;
  }

  .auth-info {
    display: none;
  }
}
</style>
