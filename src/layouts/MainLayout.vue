<template>
    <div class="app app-shell">
        <aside class="sidebar" :class="{ 'is-open': sidebarOpen }">
            <div class="sidebar-inner">
                <div class="brand">
                    <span class="brand-mark">PB</span>
                    <div class="brand-text">
                        <div class="brand-name">PayByLink</div>
                        <div class="brand-sub">Payments dashboard</div>
                    </div>
                </div>

                <nav class="nav">
                    <RouterLink class="nav-link" to="/">Overview</RouterLink>
                    <RouterLink class="nav-link" to="/links">Payment links</RouterLink>
                    <RouterLink class="nav-link" to="/transactions">Transactions</RouterLink>
                    <RouterLink class="nav-link" to="/settings">Settings</RouterLink>
                </nav>

                <div class="sidebar-card">
                    <div class="card-title">Quick tip</div>
                    <div class="card-text">
                        Share a link to get paid faster without invoices.
                    </div>
                </div>
            </div>
        </aside>

        <div class="app-main">
            <header class="topbar">
                <div class="container topbar-inner">
                    <button class="icon-btn menu-btn" @click="sidebarOpen = true">
                        <span class="sr-only">Open menu</span>
                        <span class="menu-bars"></span>
                    </button>

                    <div class="topbar-title">Dashboard</div>

                    <div class="topbar-actions">
                        <button class="ghost-btn" @click="routeTo('CreateLink')">Create link</button>
                        <div class="avatar">NS</div>
                    </div>
                </div>
            </header>

            <main class="container content">
                <RouterView />
            </main>

            <footer class="container footer">
                <span>© 2026 PayByLink</span>
                <span class="muted">Secure checkout powered by PayByLink</span>
            </footer>
        </div>
    </div>

    <button v-if="sidebarOpen" class="overlay" @click="sidebarOpen = false" aria-label="Close menu"></button>
</template>

<script>
export default {
    name: "MainLayout",
    data() {
        return {
            sidebarOpen: false,
        };
    },
    methods: {
        routeTo(name) {
            this.$router.push({ name: name })
        }
    }
};
</script>

<style scoped>
.app-shell {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 280px 1fr;
    background: var(--bg);
    color: var(--text);
}

.app-main {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.sidebar {
    background: var(--surface);
    border-right: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
}

.sidebar-inner {
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
    gap: 28px;
}

.brand {
    display: flex;
    align-items: center;
    gap: 12px;
}

.brand-mark {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    font-weight: 700;
    background: var(--accent-500);
    color: #fff;
    box-shadow: var(--shadow-sm);
}

.brand-name {
    font-weight: 700;
}

.brand-sub {
    font-size: 12px;
    color: var(--muted);
}

.nav {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.nav-link {
    padding: 10px 12px;
    border-radius: 10px;
    color: var(--text-2);
    text-decoration: none;
    background: transparent;
    transition: background 0.15s ease, color 0.15s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
    background: var(--accent-50);
    color: var(--accent-700);
}

.sidebar-card {
    margin-top: auto;
    padding: 14px;
    border-radius: var(--r-md);
    background: var(--surface-2);
    border: 1px solid var(--border);
}

.card-title {
    font-weight: 600;
    margin-bottom: 6px;
}

.card-text {
    font-size: 13px;
    color: var(--muted);
    line-height: 1.4;
}

.topbar {
    position: sticky;
    top: 0;
    z-index: 10;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
}

.topbar-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-block: 16px;
}

.topbar-title {
    font-weight: 700;
    font-size: 18px;
}

.topbar-actions {
    display: flex;
    align-items: center;
    gap: 12px;
}

.ghost-btn {
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text);
    padding: 8px 12px;
    border-radius: 999px;
    cursor: pointer;
}

.ghost-btn:hover {
    border-color: var(--border-2);
}

.avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--accent-100);
    color: var(--accent-800);
    display: grid;
    place-items: center;
    font-weight: 700;
    font-size: 12px;
}

.content {
    flex: 1;
    padding-block: 24px;
}

.footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-block: 20px 30px;
    color: var(--muted);
    font-size: 13px;
}

.muted {
    color: var(--muted-2);
}

.menu-btn {
    display: none;
}

.icon-btn {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: var(--surface);
    display: grid;
    place-items: center;
    cursor: pointer;
}

.menu-bars,
.menu-bars::before,
.menu-bars::after {
    content: "";
    display: block;
    width: 16px;
    height: 2px;
    background: var(--text);
    border-radius: 999px;
    position: relative;
}

.menu-bars::before {
    position: absolute;
    top: -5px;
}

.menu-bars::after {
    position: absolute;
    top: 5px;
}

.overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.35);
    border: none;
}

.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
}

@media (max-width: 1023px) {
    .app-shell {
        grid-template-columns: 220px 1fr;
    }
}

@media (max-width: 900px) {
    .app-shell {
        grid-template-columns: 1fr;
    }

    .menu-btn {
        display: grid;
    }

    .topbar-inner {
        gap: 10px;
    }
}

@media (max-width: 767px) {
    .footer {
        flex-direction: column;
        gap: 6px;
        align-items: flex-start;
    }
}
</style>
