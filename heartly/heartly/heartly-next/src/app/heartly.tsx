/* eslint-disable @next/next/no-img-element */
"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import "./heartly.css";

export default function HeartlyPage() {
    useEffect(() => {
        // Mobile menu toggle
        const btn = document.querySelector<HTMLButtonElement>(".hamburger");
        const menu = document.querySelector<HTMLUListElement>(".menu");
        if (btn && menu) {
            const handler = () => {
                const open = getComputedStyle(menu).display === "flex";
                (menu as HTMLElement).style.display = open ? "none" : "flex";
                btn.setAttribute("aria-expanded", String(!open));
            };
            btn.addEventListener("click", handler);
            return () => btn.removeEventListener("click", handler);
        }
    }, []);

    useEffect(() => {
        // Cloud drift
        let raf = 0;
        const drift = () => {
            const t = Date.now() / 10000;
            document.querySelectorAll<HTMLElement>(".cloud").forEach((c, i) => {
                const x = Math.sin(t + i) * 8;
                const y = Math.cos(t * 1.3 + i) * 4;
                const flip = c.classList.contains("cloud-b") ? " scaleX(-1)" : "";
                c.style.transform = `translate(${x}px, ${y}px)` + flip;
            });
            raf = requestAnimationFrame(drift);
        };
        raf = requestAnimationFrame(drift);
        return () => cancelAnimationFrame(raf);
    }, []);

    useEffect(() => {
        // Hide header when scrolled down, show at top
        const header = document.querySelector<HTMLElement>(".site-header");
        let ticking = false;
        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const y = window.scrollY || window.pageYOffset;
                if (!header) return;
                if (y > 40) header.classList.add("hidden");
                else header.classList.remove("hidden");
                ticking = false;
            });
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        // Reveal-on-scroll
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) {
            document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .fade-in, .pop').forEach((el) => {
                el.classList.add('in-view');
            });
            return;
        }
        if ('IntersectionObserver' in window) {
            const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .fade-in, .pop');
            const io = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const el = entry.target as HTMLElement;
                        const delay = parseInt(el.getAttribute('data-delay') || '0', 10);
                        if (delay) el.style.animationDelay = `${delay}ms`;
                        el.classList.add('in-view');
                        io.unobserve(el);
                    }
                });
            }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
            els.forEach((el) => io.observe(el));
            return () => io.disconnect();
        }
    }, []);

    useEffect(() => {
        // Count-up for 25%
        const el = document.getElementById('count-25');
        if (!el) return;
        const target = parseInt(el.getAttribute('data-count') || '25', 10);
        let started = false;
        const start = () => {
            if (started) return; started = true;
            const t0 = performance.now();
            const dur = 900;
            const step = (now: number) => {
                const p = Math.min(1, (now - t0) / dur);
                const eased = 1 - Math.pow(1 - p, 3);
                const val = Math.round(eased * target);
                el.textContent = `${val}%`;
                if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        };
        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver((entries) => {
                entries.forEach((e) => { if (e.isIntersecting) { start(); io.disconnect(); } });
            }, { threshold: 0.3 });
            io.observe(el);
            return () => io.disconnect();
        } else start();
    }, []);

    useEffect(() => {
        // Parallax for hero island
        const island = document.querySelector<HTMLElement>('.island');
        if (!island) return;
        let rafP = 0;
        const onScroll = () => {
            if (rafP) return;
            rafP = requestAnimationFrame(() => {
                const y = window.scrollY || 0;
                const shift = Math.min(40, y * 0.06);
                island.style.transform = `translateY(${shift}px)`;
                rafP = 0;
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            {/* Floating clouds */}
            <Image src="/cloud.png" alt="" className="cloud cloud-a" width={180} height={110} />
            <Image src="/cloud.png" alt="" className="cloud cloud-b" width={220} height={120} />
            <Image src="/cloud.png" alt="" className="cloud cloud-c" width={140} height={90} />

            <header className="site-header">
                <div className="container nav">
                    <Link className="brand" href="#hero" aria-label="Heartly">
                        <img src="/logo_heartly-removebg-preview.png" alt="Heartly logo" />
                        <span></span>
                    </Link>
                    <nav>
                        <button className="hamburger" aria-label="Open menu" aria-expanded="false">☰</button>
                        <ul className="menu">
                            <li><a href="#overview">Overview</a></li>
                            <li><a href="#funds">Yield Pool</a></li>
                            <li><a href="#sustain">Sustainability</a></li>
                        </ul>
                    </nav>
                    <a className="btn cta" href="#join">Join Now</a>
                </div>
            </header>

            <main>
                {/* Hero */}
                <section id="hero" className="hero" role="region" aria-label="Distributed Capital">
                    <div className="container">
                        <p className="eyebrow fade-in">Delivering the Future of Wisdom Market</p>
                        <div className="hero-title">
                            <span className="card skew reveal-left" data-delay="80">Wisdom</span>
                            <span className="card block reveal-up" data-delay="160">Market</span>
                        </div>
                        <p className="lede reveal-up" data-delay="240">Creating returns for people &amp; organization across generations</p>
                        <div className="actions reveal-up" data-delay="320">
                            <a className="btn join" href="#join" aria-label="Join now">JOIN NOW<span className="dot"></span></a>
                            <a className="btn outline" href="#overview" aria-label="Explore">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                                    <path fill="currentColor" d="M2 21l20-9L2 3l5 7-5 4 5-2 5 9-5-7z" />
                                </svg>
                                <span>Explore</span>
                            </a>
                        </div>
                    </div>
                    <img src="/mountains.png" className="island" alt="floating landscape" />
                </section>

                {/* Up to 25% section */}
                <section id="overview" className="promo25" role="region" aria-label="Earn up to 25%">
                    <div className="container">
                        <h2 className="promo-eyebrow reveal-up">Earn up to</h2>
                        <div className="promo-grid">
                            <div className="promo-big reveal-left" id="count-25" data-count="25">0%</div>
                            <div className="promo-copy reveal-right" data-delay="120">
                                <p className="promo-lede">Enhance your portfolio returns by 25% through strategic diversification.</p>
                                <div className="promo-note">Invest in your financial well-being and future growth with our expert guidance</div>
                            </div>
                        </div>
                    </div>
                    {/* Decorative tree removed to avoid overlapping text */}
                </section>

                {/* Benefits */}
                <section id="benefits" className="benefits" role="region" aria-label="Customized Gains via Blockchain Funds">
                    <div className="container">
                        <div className="center">
                            <div className="mini-title"><span className="spark"></span> Customized Gains</div>
                            <h2>Selected Income Prospects via <span className="accent">Blockchain Funds</span></h2>
                            <p className="sub">Linking digital and traditional lenders to diverse income methods. For liquidity, risk management, or profit maximization. Trustworthy users gain initial access to current and future fund deployments</p>
                        </div>

                        <div className="cards3">
                            <article className="card-feature">
                                <h3><span className="kicker">Intelligent Plan</span> Enhanced Profile</h3>
                                <p>Deliberate methods for peak income and balanced risk across varied holdings</p>
                                {/* Illustration at bottom */}
                                <img src="/secure-removebg-preview.png" alt="Secure growth illustration" className="benefit-illustration" />
                            </article>
                            <article className="card-feature">
                                <h3><span className="kicker">Reliable Security</span> Safely Priority</h3>
                                <p>Professional level safety measures and risk control systems safeguard your funds.</p>
                                <img src="/growth-removebg-preview (1).png" alt="Growth priority illustration" className="benefit-illustration" />
                            </article>
                            <article className="card-feature">
                                <h3><span className="kicker">Transparent data</span> Visible Advancement</h3>
                                <p>Complete overview of outcome data and deployment approaches for knowledgeable choices.</p>
                                <img src="/scangrow-removebg-preview.png" alt="Scan and grow illustration" className="benefit-illustration" />
                            </article>
                        </div>
                    </div>
                </section>

                {/* Plans */}
                <section id="funds" className="plans" role="region" aria-label="Varied Income Funds">
                    <div className="container">
                        <div className="center">
                            <div className="mini-title"><span className="spark teal"></span> Reliable Development</div>
                            <h2>Our Risk-Free Approach: <span className="accent">Varied Income Funds</span></h2>
                            <p className="sub">Choose the investment that fits your comfort with risk and desired profits. Our set of three options promises stable, risk-managed gains across different types of investments.</p>
                        </div>

                        <div className="cards3 plan-cards">
                            <article className="plan">
                                <h3>Tangible Holding</h3>
                                <div className="apy"><strong>20–25 %</strong><span>APY</span></div>
                                <div className="base">– Base APY 15%</div>
                                <p>Our premier earnings fund centered on physical holdings with substantial expansion possibilities.</p>
                                <div className="chips"><span>Worldwide Shares</span><span>Digital Currency</span><span>Non Traditional Investment Instrument</span></div>
                                <a className="btn pill" href="#join">JOIN NOW <span className="arr">›</span></a>
                            </article>
                            <article className="plan">
                                <h3>Established Earnings</h3>
                                <div className="apy"><strong>Upto 10%</strong><span>APY</span></div>
                                <div className="base">– Base APY 5%</div>
                                <p>Moderate-risk fund with proven, dependable investment categories for consistent profits.</p>
                                <div className="chips"><span>loan Provision</span><span>Debt Security</span><span>US Government Noted (Coming soon)</span></div>
                                <a className="btn pill" href="#join">JOIN NOW <span className="arr">›</span></a>
                            </article>
                            <article className="plan">
                                <h3>Protected Holding</h3>
                                <div className="apy"><strong>Upto 8%</strong><span>APY</span></div>
                                <div className="base">– Base APY 5%</div>
                                <p>Our most secure fund concentrating on physical holdings for enduring value retention.</p>
                                <div className="chips"><span>Aurum</span><span>Argentum</span><span>Valuable Elements</span><span>Lightest Metal</span></div>
                                <a className="btn pill" href="#join">JOIN NOW <span className="arr">›</span></a>
                            </article>
                        </div>
                    </div>
                </section>

                {/* Sustainability */}
                <section id="sustain" className="eco" role="region" aria-label="Cultivating Woodlands with Your Capital">
                    {/* Background image for the 5th section */}
                    <Image src="/anime-style-clouds.jpg" alt="" className="eco-bg" fill priority sizes="100vw" />
                    <div className="container">
                        <div className="center">
                            <div className="mini-title eco-title">🌱 Socially Conscious Funding</div>
                            <h2>Cultivating Woodlands with <span className="accent">Your Capital</span></h2>
                            <p className="sub">We will plant a number of trees equivalent to the total assets committed</p>
                        </div>

                        <div className="green-banner">
                            Absent woodlands, we forfeit our foundations. <strong>The environment isn&#39;t merely scenery; it&#39;s our vital support. Essential to each inhalation</strong> every liquid, every meal, are the flora, earth, and ecological systems we rely upon.
                        </div>

                        <div className="grow-cta">
                            <div className="grow-top">Because when we grow with nature</div>
                            <div className="grow-yell">WE GROW</div>
                            <div className="grow-green">FOR REAL</div>
                        </div>
                    </div>

                    <div className="sky">
                        <img src="/cloud.png" alt="" className="cloud small a" />
                        <img src="/cloud.png" alt="" className="cloud small b" />
                    </div>
                </section>

                {/* Footer banner */}
                <section id="join" className="footer-hero" aria-label="Join Heartly">
                    <div className="grass"><div className="overlay"></div></div>
                    {/* Animated wave background behind content */}
                    <svg className="wave-bg" viewBox="0 0 1200 400" preserveAspectRatio="none" aria-hidden="true">
                        <defs>
                            <linearGradient id="waveGrad1" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#bfeaff" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#e7f4ff" stopOpacity="0.95" />
                            </linearGradient>
                            <linearGradient id="waveGrad2" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#a7e2ff" stopOpacity="0.7" />
                                <stop offset="100%" stopColor="#dff0ff" stopOpacity="0.9" />
                            </linearGradient>
                            <linearGradient id="waveGrad3" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#8fd6ff" stopOpacity="0.6" />
                                <stop offset="100%" stopColor="#cfe9ff" stopOpacity="0.85" />
                            </linearGradient>
                        </defs>
                        {/* back layer */}
                        <g className="wave wave1" fill="url(#waveGrad1)">
                            <path d="M0 40 C 200 0 400 80 600 40 C 800 0 1000 80 1200 40 V 200 H 0 Z" />
                            <path d="M0 40 C 200 0 400 80 600 40 C 800 0 1000 80 1200 40 V 200 H 0 Z" transform="translate(1200,0)" />
                        </g>
                        {/* middle layer */}
                        <g className="wave wave2" fill="url(#waveGrad2)">
                            <path d="M0 40 C 200 0 400 80 600 40 C 800 0 1000 80 1200 40 V 200 H 0 Z" />
                            <path d="M0 40 C 200 0 400 80 600 40 C 800 0 1000 80 1200 40 V 200 H 0 Z" transform="translate(1200,0)" />
                        </g>
                        {/* front layer */}
                        <g className="wave wave3" fill="url(#waveGrad3)">
                            <path d="M0 40 C 200 0 400 80 600 40 C 800 0 1000 80 1200 40 V 200 H 0 Z" />
                            <path d="M0 40 C 200 0 400 80 600 40 C 800 0 1000 80 1200 40 V 200 H 0 Z" transform="translate(1200,0)" />
                        </g>
                    </svg>
                    <div className="container footer-inner">
                        <div className="socials">
                            <a href="#" aria-label="X / Twitter" title="X / Twitter" className="icon x">𝕏</a>
                            <a href="#" aria-label="Discord" title="Discord" className="icon discord">🗨️</a>
                            <a href="#" aria-label="Facebook" title="Facebook" className="icon facebook">f</a>
                            <a href="#" aria-label="Instagram" title="Instagram" className="icon instagram">◎</a>
                            <a href="#" aria-label="GitHub" title="GitHub" className="icon github">{ }</a>
                            <a href="#" aria-label="LinkedIn" title="LinkedIn" className="icon linkedin">in</a>
                        </div>
                        <h2 className="wordmark"><img src="/logo_heartly-removebg-preview.png" alt="Heartly logo" /></h2>
                    </div>
                </section>
            </main>
        </>
    );
}
