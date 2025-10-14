/* ====================================
   Adi — Portfolio (Sidebar) — JS
   ==================================== */

/* ---------- Elements ---------- */
const root = document.documentElement;
const vnav = document.getElementById('vnav');
const menuBtn = document.querySelector('.menu-toggle');
const themeBtn = document.getElementById('theme-toggle');
const yearEl = document.getElementById('year');
const form = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

/* ---------- Footer year ---------- */
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- Theme: init + toggle (localStorage + system pref) ---------- */
(function initTheme() {
    const saved = localStorage.getItem('theme'); // 'light' | 'dark' | null
    const systemPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    const initial = saved || (systemPrefersLight ? 'light' : 'dark');
    setTheme(initial);

    // React to system changes if user hasn't chosen manually
    if (!saved && window.matchMedia) {
        const mq = window.matchMedia('(prefers-color-scheme: light)');
        if (mq.addEventListener) {
            mq.addEventListener('change', e => setTheme(e.matches ? 'light' : 'dark'));
        } else if (mq.addListener) {
            mq.addListener(e => setTheme(e.matches ? 'light' : 'dark'));
        }
    }
})();

if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        const current = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        setTheme(current);
        localStorage.setItem('theme', current);
    });
}

function setTheme(mode) {
    root.setAttribute('data-theme', mode);
    if (!themeBtn) return;
    const icon = themeBtn.querySelector('.icon');
    const label = themeBtn.querySelector('.label');
    const isLight = mode === 'light';
    themeBtn.setAttribute('aria-pressed', String(!isLight ? true : false)); // pressed when dark (icon moon)
    if (icon) icon.textContent = isLight ? '☀️' : '🌙';
    if (label) label.textContent = isLight ? 'Light' : 'Dark';
}

/* ---------- Mobile menu (sidebar collapses under 920px) ---------- */
if (menuBtn && vnav) {
    menuBtn.addEventListener('click', () => {
        const isOpen = vnav.classList.toggle('open');
        menuBtn.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when clicking a link (mobile UX)
    vnav.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            if (vnav.classList.contains('open')) {
                vnav.classList.remove('open');
                menuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

/* ---------- Active link highlighting on scroll ---------- */
const sections = Array.from(document.querySelectorAll('main .section[id]'));
const navLinks = vnav ? Array.from(vnav.querySelectorAll('a[href^="#"]')) : [];

function setActiveLink() {
    const scrollY = window.scrollY + 120; // offset for comfort
    let currentId = null;

    for (const sec of sections) {
        const rect = sec.getBoundingClientRect();
        const top = window.scrollY + rect.top;
        if (scrollY >= top) currentId = sec.id;
    }

    navLinks.forEach(link => {
        const href = link.getAttribute('href').slice(1);
        if (href === currentId) link.classList.add('active');
        else link.classList.remove('active');
    });
}
window.addEventListener('scroll', setActiveLink);
window.addEventListener('load', setActiveLink);

/* ---------- Smooth scroll focus management (a11y nicety) ---------- */
navLinks.forEach(link => {
    link.addEventListener('click', e => {
        const id = link.getAttribute('href');
        if (!id || !id.startsWith('#')) return;
        const target = document.querySelector(id);
        if (!target) return;
        // native smooth via CSS; ensure focus after scroll
        setTimeout(() => target.setAttribute('tabindex', '-1'), 0);
        setTimeout(() => target.focus({ preventScroll: true }), 400);
    });
});

/* ---------- Form handling (client-only demo; Netlify-friendly) ---------- */
if (form) {
    form.addEventListener('submit', (e) => {
        const usesNetlify = form.hasAttribute('data-netlify') || form.getAttribute('data-netlify') === 'true';
        if (!form.checkValidity()) {
            e.preventDefault();
            if (formStatus) formStatus.textContent = 'Please complete all fields correctly.';
            form.reportValidity?.();
            return;
        }
        if (!usesNetlify) {
            e.preventDefault();
            if (formStatus) formStatus.textContent = 'Thanks — I’ll reply within 24–48 hours.';
            form.reset();
            setTimeout(() => formStatus && (formStatus.textContent = ''), 5000);
        }
        // If Netlify is enabled, allow normal submit.
    });
}
