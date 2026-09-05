(() => {
    const THEME_KEY = "gorka-theme";
    const pad = (n) => String(n).padStart(2, "0");

    document.querySelectorAll("[data-count]").forEach((el) => {
        const block = el.closest(".block");
        const n = block ? block.querySelectorAll(":scope > .links > li > .row").length : 0;
        el.textContent = pad(n);
    });

    document.querySelectorAll("[data-more-discounts]").forEach((wrap) => {
        const toggle = wrap.querySelector("[data-more-toggle]");
        const panel = wrap.querySelector("[data-more-panel]");
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener("click", () => {
            const open = toggle.getAttribute("aria-expanded") === "true";
            toggle.setAttribute("aria-expanded", String(!open));
            panel.hidden = open;
        });
    });

    const yearEl = document.querySelector("[data-year]");
    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }

    const systemDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;
    const storedTheme = () => {
        try {
            const value = localStorage.getItem(THEME_KEY);
            return value === "light" || value === "dark" ? value : null;
        } catch (e) {
            return null;
        }
    };
    const resolvedTheme = () => storedTheme() || (systemDark() ? "dark" : "light");

    const setThemeColor = (theme) => {
        const color = theme === "dark" ? "#0D1013" : "#F7F8FA";
        document.querySelectorAll("meta[name='theme-color']").forEach((meta) => {
            meta.setAttribute("content", color);
        });
    };

    const syncToggle = (theme) => {
        const toggle = document.querySelector("[data-theme-toggle]");
        if (!toggle) {
            return;
        }
        const next = theme === "dark" ? "claro" : "oscuro";
        toggle.setAttribute("data-mode", theme);
        toggle.setAttribute("aria-label", "Cambiar a tema " + next);
        toggle.setAttribute("title", "Cambiar a tema " + next);
    };

    const applyTheme = (theme, persist) => {
        if (persist) {
            try {
                localStorage.setItem(THEME_KEY, theme);
            } catch (e) {}
            document.documentElement.setAttribute("data-theme", theme);
        }
        setThemeColor(theme);
        syncToggle(theme);
    };

    applyTheme(resolvedTheme(), Boolean(storedTheme()));

    const toggle = document.querySelector("[data-theme-toggle]");
    if (toggle) {
        toggle.addEventListener("click", () => {
            applyTheme(resolvedTheme() === "dark" ? "light" : "dark", true);
        });
    }

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
        if (!storedTheme()) {
            applyTheme(resolvedTheme(), false);
        }
    });

    document.documentElement.classList.add("is-ready");
})();
