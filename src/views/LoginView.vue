<template>
  <div class="auth-page">
    <div class="container container--public">
      <div class="auth-shell">
        <section class="auth-info hide-mobile">
          <div class="info-card">
            <div class="eyebrow">Welcome back</div>
            <h1>Sign in to PayByLink</h1>
            <p class="info-copy">
              Manage your payment links, track conversions, and reconcile faster.
            </p>
          </div>
        </section>

        <section class="auth-card">
          <div class="card-header">
            <h2>Login</h2>
            <p class="muted">Use your account to continue.</p>
          </div>

          <form class="auth-form" @submit.prevent="handleLogin">
            <label class="field">
              <span>Email</span>
              <input v-model="form.email" type="email" placeholder="Enter your email" required />
            </label>
            <label class="field">
              <span>Password</span>
              <input v-model="form.password" type="password" placeholder="Enter your password" required />
            </label>
            <button class="primary-btn" type="submit" :disabled="isSubmitting">
              {{ isSubmitting ? "Signing in..." : "Sign in" }}
            </button>
            <p v-if="submitError" class="form-message error">{{ submitError }}</p>
          </form>

          <div class="aux-row">
            <label class="checkbox">
              <input type="checkbox" />
              Remember me
            </label>
            <RouterLink class="link" to="/reset">Forgot password?</RouterLink>
          </div>

          <p class="switch">
            New to PayByLink?
            <RouterLink to="/register">Create account</RouterLink>
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { login } from "@/services/authApi";

const router = useRouter();
const isSubmitting = ref(false);
const submitError = ref("");
const form = ref({
  email: "",
  password: "",
});

const handleLogin = async () => {
  isSubmitting.value = true;
  submitError.value = "";

  const payload = {
    email: form.value.email.trim(),
    password: form.value.password,
  };

  const response = await login(payload);
  if (response?.error) {
    submitError.value = response.error;
    isSubmitting.value = false;
    return;
  }

  router.push({ name: "Home" });
  isSubmitting.value = false;
};
</script>

<style scoped>
.auth-page {
  background: var(--bg);
  min-height: calc(100vh - 120px);
  padding-block: 40px;
}

.auth-shell {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 32px;
  align-items: stretch;
}

.auth-info {
  background: linear-gradient(135deg, #ffffff, var(--accent-50));
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

.primary-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.form-message {
  margin: 0;
  font-size: 12px;
}

.form-message.error {
  color: var(--danger);
}

.aux-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--muted);
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 6px;
}

.link {
  color: var(--accent-600);
  text-decoration: none;
  font-weight: 600;
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
