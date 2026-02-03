<template>
  <section class="public-link">
    <div class="card">
      <div class="brand">
        <div class="logo" v-if="brandLogo">
          <img :src="brandLogo" :alt="brandName" />
        </div>
        <div>
          <p class="eyebrow">Powered by Quicklink</p>
          <h1>{{ heading }}</h1>
          <p class="muted">{{ subheading }}</p>
        </div>
      </div>

      <div v-if="loading" class="state">
        <p>Preparing your secure checkout...</p>
      </div>

      <div v-else-if="error" class="state">
        <p>{{ error }}</p>
        <RouterLink class="ghost-btn" to="/">Back to home</RouterLink>
      </div>

      <div v-else class="state">
        <div class="summary">
          <div>
            <span class="label">Amount</span>
            <span class="value">{{ formattedAmount }}</span>
          </div>
          <div>
            <span class="label">Provider</span>
            <span class="value">{{ providerLabel }}</span>
          </div>
        </div>
        <div class="redirecting">
          <span class="spinner" aria-hidden="true"></span>
          <span>Redirecting you to payment...</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { getPublicPaymentLink, markPaymentLinkPending } from "@/services/paymentLinksApi";

const route = useRoute();
const loading = ref(true);
const error = ref("");
const copyState = ref("");
const redirectUrl = ref("");
const provider = ref("");
const amount = ref(0);
const brandName = ref("Quicklink");
const brandLogo = ref("");
const linkName = ref("Payment link");

const heading = computed(() => linkName.value || "Payment link");
const subheading = computed(() => `You will be redirected to ${providerLabel.value}.`);

const formattedAmount = computed(() => {
  if (!amount.value) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount.value);
});

const providerLabel = computed(() => {
  const value = (provider.value || "").toLowerCase();
  if (value === "adyen") return "Adyen";
  if (value === "stripe") return "Stripe";
  return "payment provider";
});

const applyResponse = (data) => {
  const safe = data || {};
  redirectUrl.value =
    safe.redirectUrl ||
    safe.hppUrl ||
    safe.url ||
    safe.checkoutUrl ||
    safe.paymentUrl ||
    safe.paymentLinkUrl ||
    safe.linkUrl ||
    safe.quicklinkUrl ||
    "";
  provider.value = safe.provider || safe.psp || "";
  amount.value = Number(safe.amount || 0);
  brandName.value = safe.merchantName || safe.brandName || safe.merchant?.name || "Quicklink";
  brandLogo.value = safe.merchantLogo || safe.brandLogo || safe.merchant?.logo || "";
  linkName.value = safe.linkName || safe.name || "Payment link";
};

const goToPayment = () => {
  if (!redirectUrl.value) return;
  window.location.href = redirectUrl.value;
};

onMounted(async () => {
  const slug = route.params.slug;
  if (!slug) {
    error.value = "Invalid payment link.";
    loading.value = false;
    return;
  }

  const response = await getPublicPaymentLink(String(slug));
  if (response?.error) {
    error.value = response.error;
    loading.value = false;
    return;
  }

  const data = response?.data || response;
  applyResponse(data);
  loading.value = false;

  const linkId = data?.id || data?.linkId || data?._id || data?.link_id;
  if (linkId) {
    await markPaymentLinkPending(linkId);
  }

  if (redirectUrl.value) {
    window.setTimeout(() => {
      goToPayment();
    }, 1500);
  } else {
    error.value = "Payment link is missing a redirect URL.";
  }
});
</script>

<style scoped>
.public-link {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px 16px;
  background: radial-gradient(circle at top, rgba(14, 116, 144, 0.08), transparent 55%),
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
  gap: 20px;
}

.brand {
  display: flex;
  gap: 16px;
  align-items: center;
}

.logo {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: var(--surface-2);
  display: grid;
  place-items: center;
  overflow: hidden;
}

.logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.eyebrow {
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.2em;
  color: var(--muted);
  margin: 0 0 6px;
}

.muted {
  color: var(--muted);
}

.state {
  display: grid;
  gap: 16px;
}

.summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
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
}

.redirecting {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--muted);
}

.spinner {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid var(--border);
  border-top-color: var(--accent-500);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .brand {
    flex-direction: column;
    align-items: flex-start;
  }

  .summary {
    grid-template-columns: 1fr;
  }
}
</style>
