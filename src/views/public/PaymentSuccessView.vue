<template>
  <section class="payment-success">
    <div class="card">
      <div class="badge">Payment successful</div>
      <h1>Thanks - your payment went through.</h1>
      

      <div class="summary">
        <div>
          <span class="label">Link</span>
          <span class="value">{{ linkId }}</span>
        </div>
        <div>
          <span class="label">Reference</span>
          <span class="value">{{ refId }}</span>
        </div>
        <div>
          <span class="label">Test Mode</span>
          <span class="value">{{ isTest - "Yes" : "No" }}</span>
        </div>
      </div>

      <div class="actions">
        <RouterLink class="ghost-btn" to="/links">Back to links</RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const linkId = computed(() => String(route.query.link || "-"));
const refId = computed(() => String(route.query.ref || "-"));
const isTest = computed(() => {
  const value = String(route.query.test_checkout || "").toLowerCase();
  return value === "1" || value === "true";
});
</script>

<style scoped>
.payment-success {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px 16px;
  background: radial-gradient(circle at top, rgba(16, 185, 129, 0.12), transparent 55%),
    linear-gradient(135deg, rgba(15, 23, 42, 0.04), rgba(15, 23, 42, 0.01));
}

.card {
  width: min(520px, 100%);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-lg, 0 20px 40px rgba(15, 23, 42, 0.12));
  padding: 28px;
  display: grid;
  gap: 16px;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  border-radius: 999px;
  background: var(--success-bg);
  color: var(--success-text);
  font-size: 12px;
  font-weight: 700;
  width: fit-content;
}

h1 {
  margin: 0;
  font-size: 22px;
}

.muted {
  color: var(--muted);
  margin: 0;
}

.summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  background: var(--surface-2);
  border-radius: 16px;
  padding: 14px;
  border: 1px solid var(--border);
}

.label {
  display: block;
  font-size: 12px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 4px;
}

.value {
  font-weight: 600;
  word-break: break-all;
}

.actions {
  display: flex;
  justify-content: flex-end;
}

.ghost-btn {
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  padding: 10px 16px;
  border-radius: 999px;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 640px) {
  .summary {
    grid-template-columns: 1fr;
  }
}
</style>
