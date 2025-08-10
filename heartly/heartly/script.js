// Minimal interactivity: mobile menu toggle and gentle cloud drift
(function () {
    const btn = document.querySelector('.hamburger');
    const menu = document.querySelector('.menu');
    if (btn) {
        btn.addEventListener('click', () => {
            const open = menu.style.display === 'flex';
            menu.style.display = open ? 'none' : 'flex';
            btn.setAttribute('aria-expanded', String(!open));
        });
    }

    // Parallax drift for clouds
    const drift = () => {
        const t = Date.now() / 10000;
        document.querySelectorAll('.cloud').forEach((c, i) => {
            const x = Math.sin(t + i) * 8;
            const y = Math.cos(t * 1.3 + i) * 4;
            c.style.transform = `translate(${x}px, ${y}px)` + (c.classList.contains('cloud-b') ? ' scaleX(-1)' : '');
        });
        requestAnimationFrame(drift);
    };
    requestAnimationFrame(drift);

    // Hide header when scrolled down, show at top
    const header = document.querySelector('.site-header');
    let lastY = 0;
    let rafId = 0;
    const onScroll = () => {
        if (rafId) return; // throttle with rAF
        rafId = requestAnimationFrame(() => {
            const y = window.scrollY || window.pageYOffset;
            if (!header) return;
            if (y > 40) {
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
            }
            lastY = y;
            rafId = 0;
        });
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Scene-driven animations: reveal on scroll using IntersectionObserver
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced && 'IntersectionObserver' in window) {
        const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .fade-in, .pop');
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const el = entry.target;
                if (entry.isIntersecting) {
                    const delay = parseInt(el.getAttribute('data-delay') || '0', 10);
                    if (delay) el.style.animationDelay = `${delay}ms`;
                    el.classList.add('in-view');
                    io.unobserve(el);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
        revealEls.forEach((el) => io.observe(el));
    } else {
        // If reduced motion, just show elements
        document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .fade-in, .pop').forEach((el) => {
            el.classList.add('in-view');
        });
    }

    // Count-up animation for 25%
    const countEl = document.getElementById('count-25');
    if (countEl) {
        const target = parseInt(countEl.getAttribute('data-count') || '25', 10);
        let started = false;
        const startCount = () => {
            if (started) return;
            started = true;
            const duration = 900;
            const t0 = performance.now();
            const tick = (now) => {
                const p = Math.min(1, (now - t0) / duration);
                const eased = 1 - Math.pow(1 - p, 3);
                const val = Math.round(eased * target);
                countEl.textContent = `${val}%`;
                if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        };
        // Trigger when visible
        if ('IntersectionObserver' in window) {
            const io2 = new IntersectionObserver((entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        startCount();
                        io2.disconnect();
                    }
                });
            }, { threshold: 0.3 });
            io2.observe(countEl);
        } else {
            startCount();
        }
    }

    // Gentle parallax for the hero island based on scroll
    const island = document.querySelector('.island');
    if (island) {
        let rafP = 0;
        const onScrollParallax = () => {
            if (rafP) return;
            rafP = requestAnimationFrame(() => {
                const y = (window.scrollY || 0);
                const shift = Math.min(40, y * 0.06);
                island.style.transform = `translateY(${shift}px)`;
                rafP = 0;
            });
        };
        window.addEventListener('scroll', onScrollParallax, { passive: true });
    }
})();
