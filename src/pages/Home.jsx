import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

/* ─── count-up hook ────────────────────────────────────────────────────────── */
const useCountUp = (target, duration = 1600, start = false) => {
    const [val, setVal] = useState(0);
    useEffect(() => {
        if (!start) return;
        let raf, t0;
        const tick = (now) => {
            if (!t0) t0 = now;
            const p = Math.min((now - t0) / duration, 1);
            setVal(Math.floor(p * target));
            if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [start, target, duration]);
    return val;
};

const Stat = ({ value, suffix, label, delay, started }) => {
    const num = useCountUp(value, 1600, started);
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={started ? { opacity: 1, y: 0 } : {}}
            transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
        >
            <span className="stat-number">{num.toLocaleString()}{suffix}</span>
            <span className="stat-label">{label}</span>
        </motion.div>
    );
};

const FeatureCard = ({ icon, title, desc, href, delay, accent }) => (
    <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="feature-card"
        style={{ '--accent': accent }}
    >
        <Link to={href} className="block h-full">
            <div className="feature-icon-wrap">
                <span className="feature-icon">{icon}</span>
            </div>
            <h3 className="feature-title">{title}</h3>
            <p className="feature-desc">{desc}</p>
            <span className="feature-link">Explore →</span>
        </Link>
    </motion.div>
);

/* ════════════════════════════════════════════════════════════════════════════ */
const Home = () => {
    const { language, setLanguage } = useLanguage();
    const heroRef = useRef(null);
    const statsRef = useRef(null);
    const [statsVisible, setStatsVisible] = useState(false);

    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
    const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setStatsVisible(true); },
            { threshold: 0.25 }
        );
        if (statsRef.current) obs.observe(statsRef.current);
        return () => obs.disconnect();
    }, []);

    const LANGS = [
        { code: 'en', label: 'EN' },
        { code: 'hi', label: 'हि' },
        { code: 'te', label: 'తె' },
    ];

    const features = [
        { icon: '🌿', title: 'Crop Health AI',      desc: 'Upload a leaf photo — detect disease in seconds across 38 crop types with confidence scores.',                               href: '/crop-health',  accent: '#22c55e', delay: 0    },
        { icon: '🧪', title: 'Soil Report Reader',   desc: 'Photograph your KVK soil card. AI reads NPK & pH and gives a personalised fertiliser plan.',                              href: '/soil-report',  accent: '#f59e0b', delay: 0.07 },
        { icon: '🌦️', title: 'Digital Twin Farm',    desc: 'Simulate your entire season before planting — yield, profit, risk — visualised in 3D.',                                 href: '/digital-twin', accent: '#38bdf8', delay: 0.14 },
        { icon: '📈', title: 'Market Prices',        desc: 'Live mandi prices, MSP comparison, and demand trends for 20+ crops.',                                                     href: '/market',       accent: '#a78bfa', delay: 0.21 },
        { icon: '🌱', title: 'Soil Advisor',         desc: 'Enter N-P-K values manually and get crop recommendations with a full fertiliser schedule.',                               href: '/soil-advisor', accent: '#fb923c', delay: 0.28 },
        { icon: '🛡️', title: 'Safety Guardrails',   desc: "Every recommendation is checked against India's banned pesticide list and government MSP.",                               href: '/crop-health',  accent: '#f43f5e', delay: 0.35 },
    ];

    return (
        <div className="home-root">

            {/* ════ HERO ════════════════════════════════════════════════════ */}
            <section ref={heroRef} className="hero-section">

                {/* parallax farm image */}
                <motion.div className="hero-bg" style={{ y: bgY }} />

                {/* layered overlay — crisp image + readable text */}
                {/* layer 1: very subtle white vignette at edges only */}
                <div className="hero-vignette" />
                {/* layer 2: light golden tint in centre-bottom for legibility */}
                <div className="hero-tint" />

                {/* ── top bar (single, belongs to hero only) ── */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="hero-topbar"
                >
                    {/* brand */}
                    <Link to="/" className="hero-brand">
                        <span className="hero-brand-icon">🌾</span>
                        <span className="hero-brand-name">KisanMaithri</span>
                        <span className="hero-brand-badge">v3</span>
                    </Link>

                    {/* nav links — desktop */}
                    <nav className="hero-nav-links">
                        {[
                            { to: '/crop-health',  label: '🌿 Crop Health' },
                            { to: '/soil-report-upload',  label: '📄 Soil Report' },
                            { to: '/digital-twin', label: '🌾 Digital Twin' },
                            { to: '/market',       label: '📈 Market' },
                            { to: '/soil-advisor', label: '🌱 Soil Advisor' },
                        ].map(l => (
                            <Link key={l.to} to={l.to} className="hero-nav-link">{l.label}</Link>
                        ))}
                    </nav>

                    {/* language switcher */}
                    <div className="lang-switcher">
                        {LANGS.map(l => (
                            <button
                                key={l.code}
                                onClick={() => setLanguage(l.code)}
                                className={`lang-btn ${language === l.code ? 'lang-btn-active' : ''}`}
                            >
                                {l.label}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* ── hero text content ── */}
                <motion.div
                    style={{ y: contentY, opacity: heroOpacity }}
                    className="hero-content"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.25, type: 'spring', stiffness: 260 }}
                        className="hero-pill"
                    >
                        <span className="hero-pill-dot" />
                        AI-powered precision farming
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                        className="hero-title"
                    >
                        Smart Farming<br />
                        <span className="hero-title-accent">Starts Here</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.48, duration: 0.65 }}
                        className="hero-subtitle"
                    >
                        Check crop Health · Detect crop disease · Read soil reports<br />
                        Get advice in your Language — even offline.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.55 }}
                        className="hero-cta-row"
                    >
                        <Link to="/crop-health">
                            <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }} className="cta-primary">
                                🌿 Scan My Crop
                            </motion.button>
                        </Link>
                        <Link to="/digital-twin">
                            <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }} className="cta-secondary">
                                ▶ Watch 3D Farm
                            </motion.button>
                        </Link>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.78 }}
                        className="hero-trust"
                    >
                        🔒 Free · Works offline · No login required
                    </motion.p>
                </motion.div>

                {/* scroll cue */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    className="scroll-cue"
                >
                    <motion.div
                        animate={{ y: [0, 7, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="scroll-cue-mouse"
                    >
                        <div className="scroll-cue-wheel" />
                    </motion.div>
                </motion.div>
            </section>

            {/* ════ STATS ═══════════════════════════════════════════════════ */}
            <section ref={statsRef} className="stats-section">
                <div className="stats-glass">
                    <Stat value={10000} suffix="+"  label="Farmers Helped"        delay={0}    started={statsVisible} />
                    <div className="stats-div" />
                    <Stat value={95}    suffix="%"  label="Yield Accuracy"         delay={0.1}  started={statsVisible} />
                    <div className="stats-div" />
                    <Stat value={40}    suffix="%"  label="Water Saved"            delay={0.2}  started={statsVisible} />
                    <div className="stats-div" />
                    <Stat value={38}    suffix=""   label="Diseases Detected"      delay={0.3}  started={statsVisible} />
                </div>
            </section>

            {/* ════ FEATURES ════════════════════════════════════════════════ */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="section-header"
            >
                <span className="eyebrow">What KisanMaithri Does</span>
                <h2 className="section-title">
                    Every tool a farmer needs,<br />
                    <span className="section-accent">in one place</span>
                </h2>
            </motion.div>

            <section className="features-section">
                <div className="features-grid">
                    {features.map(f => <FeatureCard key={f.title} {...f} />)}
                </div>
            </section>

            {/* ════ HOW IT WORKS ════════════════════════════════════════════ */}
            <section className="how-section">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="how-card"
                >
                    <span className="eyebrow" style={{ display: 'block', textAlign: 'center' }}>How It Works</span>
                    <h2 className="section-title" style={{ textAlign: 'center', marginTop: 10 }}>Three steps to smarter farming</h2>
                    <div className="how-steps">
                        {[
                            { n: '01', icon: '📸', title: 'Upload or Speak',  desc: 'Take a photo of your crop leaf or soil report. Or speak in Telugu, Hindi, or English.' },
                            { n: '02', icon: '🤖', title: 'AI Analyses',      desc: 'Multi-agent system runs disease detection, soil analysis, weather check, and compliance guardrails.' },
                            { n: '03', icon: '✅', title: 'Get Your Plan',    desc: 'Receive a personalised plan with safe pesticide choices, fertiliser schedule, and market price guidance.' },
                        ].map((s, i) => (
                            <motion.div
                                key={s.n}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.55 }}
                                className="how-step"
                            >
                                <div className="how-num">{s.n}</div>
                                <div className="how-icon">{s.icon}</div>
                                <h4 className="how-title">{s.title}</h4>
                                <p className="how-desc">{s.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* ════ FINAL CTA ═══════════════════════════════════════════════ */}
            <section className="cta-section">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="cta-card"
                >
                    <div className="cta-bg" />
                    <div className="cta-overlay" />
                    <div className="cta-content">
                        <h2 className="cta-title">Ready to grow smarter?</h2>
                        <p className="cta-sub">Join thousands of farmers using AI to protect crops, reduce costs, and maximise profit.</p>
                        <div className="cta-buttons">
                            <Link to="/crop-health">
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="cta-primary cta-lg">
                                    🌿 Scan My Crop Now
                                </motion.button>
                            </Link>
                            <Link to="/soil-report">
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="cta-ghost">
                                    📄 Read My Soil Report
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ════ FOOTER ══════════════════════════════════════════════════ */}
            <footer className="home-footer">
                <div className="footer-inner">
                    <div className="footer-brand-row">
                        <span>🌾</span>
                        <span className="footer-name">KisanMaithri</span>
                    </div>
                    <p className="footer-line">AI agricultural advisory · Free forever · Works offline</p>
                    <p className="footer-note">Advisory only. Consult your local Krishi Vigyan Kendra — toll-free 1800-180-1551</p>
                </div>
            </footer>

        </div>
    );
};

export default Home;