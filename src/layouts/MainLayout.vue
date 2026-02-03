<template>
    <div class="app app-shell" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
        <aside class="sidebar" :class="{ 'is-open': sidebarOpen, 'is-collapsed': sidebarCollapsed }">
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
                    <RouterLink class="nav-link" to="/customers">Customers</RouterLink>
                    <RouterLink class="nav-link" to="/transactions">Transactions</RouterLink>
                    <RouterLink class="nav-link" to="/settings">Settings</RouterLink>
                </nav>

                <div class="sidebar-card">
                    <div class="card-title">Quick tip</div>
                    <div class="card-text">
                        Share a link to get paid faster without invoices.
                    </div>
                </div>

                <div class="sidebar-actions">
                    <button class="ghost-btn theme-btn" @click="toggleTheme">
                        <span class="theme-icon" aria-hidden="true">
                            <span v-if="theme === 'dark'" class="icon-sun"></span>
                            <span v-else class="icon-moon"></span>
                        </span>
                        {{ theme === "dark" ? "Light mode" : "Dark mode" }}
                    </button>
                    <RouterLink class="ghost-btn logout-btn" to="/logout">
                        <span class="logout-icon" aria-hidden="true"></span>
                        Logout
                    </RouterLink>
                </div>
            </div>
        </aside>

        <div class="app-main">
            <header class="topbar">
                <div class="container topbar-inner">
                    <div class="topbar-left">
                        <button class="icon-btn menu-btn" @click="toggleSidebar">
                            <span class="sr-only">Open menu</span>
                            <span class="menu-bars"></span>
                        </button>
                    </div>

                    <div class="topbar-title">Dashboard</div>

                    <div class="topbar-actions">
                        <button class="primary-cta" @click="routeTo('CreateLink')">Create link</button>
                        <div class="avatar" :title="userName || 'User'">{{ userInitials }}</div>
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

    <button v-if="isMobile && sidebarOpen" class="overlay" @click="sidebarOpen = false" aria-label="Close menu"></button>
</template>

<script>
import { getSettings } from "@/services/settingsApi";

export default {
    name: "MainLayout",
    data() {
        return {
            sidebarOpen: false,
            sidebarCollapsed: false,
            isMobile: false,
            mobileQuery: null,
            theme: "light",
            userName: "",
            userInitials: "NA",
        };
    },
    mounted() {
        if (typeof window === "undefined" || !window.matchMedia) return;
        this.initTheme();
        this.mobileQuery = window.matchMedia("(max-width: 900px)");
        this.handleMediaChange(this.mobileQuery);
        if (typeof this.mobileQuery.addEventListener === "function") {
            this.mobileQuery.addEventListener("change", this.handleMediaChange);
        } else if (typeof this.mobileQuery.addListener === "function") {
            this.mobileQuery.addListener(this.handleMediaChange);
        }
        this.loadSettings();
    },
    beforeUnmount() {
        if (!this.mobileQuery) return;
        if (typeof this.mobileQuery.removeEventListener === "function") {
            this.mobileQuery.removeEventListener("change", this.handleMediaChange);
        } else if (typeof this.mobileQuery.removeListener === "function") {
            this.mobileQuery.removeListener(this.handleMediaChange);
        }
    },
    methods: {
        initTheme() {
            const stored = typeof window !== "undefined" ? window.localStorage.getItem("paybylink-theme") : "";
            const prefersDark =
                typeof window !== "undefined" &&
                window.matchMedia &&
                window.matchMedia("(prefers-color-scheme: dark)").matches;
            const nextTheme = stored === "dark" || stored === "light" ? stored : prefersDark ? "dark" : "light";
            this.applyTheme(nextTheme);
        },
        applyTheme(value) {
            const next = value === "dark" ? "dark" : "light";
            this.theme = next;
            if (typeof document !== "undefined") {
                document.documentElement.setAttribute("data-theme", next);
            }
            if (typeof window !== "undefined") {
                window.localStorage.setItem("paybylink-theme", next);
            }
        },
        toggleTheme() {
            const next = this.theme === "dark" ? "light" : "dark";
            this.applyTheme(next);
        },
        handleMediaChange(event) {
            const matches = !!event.matches;
            this.isMobile = matches;
            if (matches) {
                this.sidebarOpen = false;
                this.sidebarCollapsed = false;
            }
        },
        toggleSidebar() {
            if (this.isMobile) {
                this.sidebarOpen = !this.sidebarOpen;
                return;
            }
            this.sidebarCollapsed = !this.sidebarCollapsed;
        },
        async loadSettings() {
            const response = await getSettings();
            if (response?.error) return;
            const safe = response?.data || response || {};
            const name =
                safe.profile?.fullName ||
                safe.profile?.name ||
                safe.profile?.email ||
                "";
            this.userName = name;
            this.userInitials = this.getInitials(name);
        },
        getInitials(value) {
            const text = String(value || "").trim();
            if (!text) return "NA";
            const cleaned = text.includes("@") ? text.split("@")[0] : text;
            const parts = cleaned.split(/\s+/).filter(Boolean);
            if (!parts.length) return "NA";
            const initials = parts
                .slice(0, 2)
                .map((part) => part[0])
                .join("")
                .toUpperCase();
            return initials || "NA";
        },
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

.sidebar.is-collapsed {
    width: 0;
    border-right: none;
    overflow: hidden;
}

.sidebar.is-collapsed .sidebar-inner {
    display: none;
}

.app-shell.sidebar-collapsed {
    grid-template-columns: 0 1fr;
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

.sidebar-actions {
    margin-top: auto;
    display: grid;
    gap: 10px;
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

.topbar-left {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
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

.primary-cta {
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: #fff;
    border: none;
    padding: 9px 16px;
    border-radius: 999px;
    font-weight: 700;
    letter-spacing: 0.01em;
    box-shadow: 0 10px 22px rgba(79, 70, 229, 0.32);
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.primary-cta:hover {
    transform: translateY(-1px);
    box-shadow: 0 14px 26px rgba(79, 70, 229, 0.38);
}

.primary-cta:active {
    transform: translateY(0);
}

.ghost-btn {
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text);
    padding: 8px 12px;
    border-radius: 999px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
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

.theme-btn {
    border-color: rgba(129, 140, 248, 0.4);
    background: var(--surface-2);
}

.theme-icon {
    width: 18px;
    height: 18px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.icon-sun,
.icon-moon {
    width: 16px;
    height: 16px;
    display: inline-block;
}

.icon-sun {
    border-radius: 999px;
    border: 2px solid #fbbf24;
    position: relative;
}

.icon-sun::before {
    content: "";
    position: absolute;
    inset: -4px;
    border-radius: 999px;
    border: 1px dashed rgba(251, 191, 36, 0.8);
}

.icon-moon {
    border-radius: 999px;
    border: 2px solid #94a3b8;
    position: relative;
}

.icon-moon::after {
    content: "";
    position: absolute;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--surface);
    top: 2px;
    left: 9px;
}

.logout-btn {
    border-color: rgba(239, 68, 68, 0.3);
    color: var(--danger-text);
    background: var(--surface);
    text-decoration: none;
}

.logout-btn:hover {
    border-color: rgba(239, 68, 68, 0.6);
}

.logout-icon {
    width: 16px;
    height: 16px;
    border: 2px solid currentColor;
    border-radius: 4px;
    position: relative;
    box-sizing: border-box;
}

.logout-icon::after {
    content: "";
    position: absolute;
    width: 7px;
    height: 2px;
    background: currentColor;
    right: -5px;
    top: 5px;
}

.logout-icon::before {
    content: "";
    position: absolute;
    width: 6px;
    height: 6px;
    border-top: 2px solid currentColor;
    border-right: 2px solid currentColor;
    right: -4px;
    top: 2px;
    transform: rotate(45deg);
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
