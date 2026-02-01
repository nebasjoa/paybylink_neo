<template>
  <section class="cancel">
    <div class="card">
      <div class="icon">!</div>
      <h1>Payment canceled</h1>
      <p class="muted">
        Your payment was canceled. You can retry the payment link or return to the merchant.
      </p>

      <div class="summary" v-if="linkId">
        <div>
          <span class="label">Link reference</span>
          <span class="value">{{ linkId }}</span>
        </div>
      </div>

      <div class="actions">
        <RouterLink class="primary-btn" :to="retryTarget">
          Retry payment
        </RouterLink>
        <RouterLink class="ghost-btn" to="/">
          Back to home
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const linkId = computed(() => String(route.query.link || ""));
const retryTarget = computed(() => {
  if (!linkId.value) return { name: "Home" };
  return { name: "PublicPaymentLink", params: { slug: linkId.value } };
});
</script>

<style scoped>
.cancel {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px 16px;
  background: radial-gradient(circle at top, rgba(248, 113, 113, 0.12), transparent 60%),
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
  text-align: center;
}

.icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: var(--danger);
  color: #fff;
  font-weight: 700;
  font-size: 28px;
  display: grid;
  place-items: center;
  margin: 0 auto;
}

.muted {
  color: var(--muted);
}

.summary {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 12px;
}

.label {
  display: block;
  font-size: 12px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.value {
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.primary-btn {
  background: var(--accent-600);
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
}

.ghost-btn {
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  padding: 10px 16px;
  border-radius: 999px;
  cursor: pointer;
  text-decoration: none;
}

@media (max-width: 640px) {
  .card {
    text-align: left;
  }
}
</style>
