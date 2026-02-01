<template>
  <section class="logout">
    <div class="card">
      <div class="icon">✓</div>
      <h1>You're logged out</h1>
      <p class="muted">You have been signed out of your PayByLink dashboard.</p>
      <div class="actions">
        <RouterLink class="primary-btn" to="/login">Go to login</RouterLink>
        <RouterLink class="ghost-btn" to="/">Back to overview</RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style scoped>
.logout {
  min-height: 70vh;
  display: grid;
  place-items: center;
  padding: 32px 16px;
}

.card {
  width: min(520px, 100%);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-sm);
  padding: 28px;
  display: grid;
  gap: 16px;
  text-align: center;
}

.icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: var(--success);
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
</style>
