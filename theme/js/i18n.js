/**
 *
 */

// Language Switcher Module
(function () {
    'use strict';

    const LanguageSwitcher = {
        currentLang: 'en',
        supportedLangs: ['en', 'it'],
        defaultLang: 'en',

        init() {
            this.currentLang = this.getInitialLang();
            this.applyLanguage(this.currentLang);
            this.bindEvents();
            this.updateActiveButton();
            // Initialize page transition
            requestAnimationFrame(() => {
                document.body.classList.add('lang-page-transition', 'loaded');
            });
            // Handle resize to keep slider aligned
            window.addEventListener('resize', () => this.updateSliderPosition());
            // Ensure slider positioned after fonts/layout settle
            setTimeout(() => this.updateSliderPosition(), 50);
            setTimeout(() => this.updateSliderPosition(), 200);
            setTimeout(() => this.updateSliderPosition(), 500);
        },

        getInitialLang() {
            // 1. Check URL parameter (?lang=it)
            const urlParams = new URLSearchParams(window.location.search);
            const urlLang = urlParams.get('lang');
            if (urlLang && this.supportedLangs.includes(urlLang)) {
                return urlLang;
            }

            // 2. Check localStorage
            const savedLang = localStorage.getItem('portfolio-lang');
            if (savedLang && this.supportedLangs.includes(savedLang)) {
                return savedLang;
            }

            // 3. Check browser language
            const browserLang = navigator.language.split('-')[0];
            if (this.supportedLangs.includes(browserLang)) {
                return browserLang;
            }

            // 4. Default
            return this.defaultLang;
        },

        setLanguage(lang) {
            if (!this.supportedLangs.includes(lang)) return;
            if (lang === this.currentLang) return;

            const toggle = document.querySelector('.lang-toggle');
            if (toggle) {
                toggle.classList.add('lang-switching');
            }

            // Page transition: fade out
            document.body.classList.add('lang-page-transition');
            document.body.classList.remove('loaded');

            this.currentLang = lang;
            localStorage.setItem('portfolio-lang', lang);
            this.applyLanguage(lang);
            this.updateActiveButton();
            this.updateUrlLang(lang);

            // Update slider position after DOM updates
            requestAnimationFrame(() => {
                this.updateSliderPosition();
                document.body.classList.add('loaded');
                if (toggle) {
                    setTimeout(() => toggle.classList.remove('lang-switching'), 400);
                }
            });
        },

        applyLanguage(lang) {
            document.documentElement.lang = lang;

            // Translate elements with data-i18n attribute
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                const translation = this.getTranslation(key, lang);
                if (translation) {
                    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                        el.placeholder = translation;
                    } else {
                        el.innerHTML = translation;
                    }
                }
            });

            // Translate elements with data-i18n-attr (for attributes like title, alt)
            document.querySelectorAll('[data-i18n-attr]').forEach(el => {
                const attrMap = JSON.parse(el.getAttribute('data-i18n-attr'));
                Object.entries(attrMap).forEach(([attr, key]) => {
                    const translation = this.getTranslation(key, lang);
                    if (translation) el.setAttribute(attr, translation);
                });
            });

            // Dispatch event for other scripts
            window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
        },

        getTranslation(key, lang) {
            const translations = this.getTranslations();
            return translations[lang]?.[key] || translations[this.defaultLang]?.[key] || key;
        },

        getTranslations() {
            return {
                en: {
                    'nav.home': 'Home',
                    'nav.projects': 'Projects',
                    'nav.resume': 'Resume',
                    'hero.title': 'I am',
                    'hero.subtitle': 'Raffaele Castania.',
                    'hero.roles': ['a Gameplay Programmer.', 'a Dreamer.'],
                    'hero.description': 'I provide incredible interactive experiences through structured systems :D.',
                    'portfolio.title': 'My Projects',
                    'portfolio.filter.all': 'All Projects',
                    'portfolio.filter.unity': 'Unity',
                    'portfolio.filter.unreal': 'Unreal Engine',
                    'portfolio.filter.other': 'Other',
                    'project.open': 'Open Project',
                    'project.year': 'Year',
                    'project.engine': 'Engine',
                    'project.duration': 'Duration',
                    'project.team': 'Team Size',
                    'project.github': 'GitHub',
                    'project.youtube': 'YouTube',
                    'project.view': 'View Project',
                    'project.synopsis': 'Synopsis',
                    'project.description': 'Description',
                    'project.systems': 'Systems Implemented',
                    'project.challenges': 'Challenges Faced',
                    'project.prev': 'Previous Work',
                    'project.next': 'Next Work',
                    'footer.rights': 'All rights reserved.',
                    'footer.made': 'Made with',
                    'skills.title': 'My Skills',
                    'about.experience': 'Work Experience',
                    'contact.title': 'Contact Me',
                    'contact.name': 'Name',
                    'contact.email': 'Email',
                    'contact.subject': 'Subject',
                    'contact.message': 'Message',
                    'contact.send': 'Send Message',
                    // Portfolio Cards - Rumble Smash
                    'card.rumble-smash.title': 'Rumble Smash',
                    'card.rumble-smash.duration.full': '3 Months',
                    'card.rumble-smash.duration.short': '3M',
                    'card.rumble-smash.engine': 'Unity',
                    'card.rumble-smash.team': '1',
                    'card.rumble-smash.role': 'SOLO DEV',
                    'card.rumble-smash.desc': '1v1 Casual game where scoring is your only option!',
                    // Portfolio Cards - PuyoTetris
                    'card.puyotetris.title': 'PuyoTetris',
                    'card.puyotetris.duration.full': '5 Days',
                    'card.puyotetris.duration.short': '5D',
                    'card.puyotetris.engine': 'Unity',
                    'card.puyotetris.team': '1',
                    'card.puyotetris.role': 'SOLO DEV',
                    'card.puyotetris.desc': 'Classic Puyo Puyo / Tetris clone developed in 5 days.',
                    // Portfolio Cards - Toyorun
                    'card.toyorun.title': 'Toyorun',
                    'card.toyorun.duration.full': '3 Months',
                    'card.toyorun.duration.short': '3M',
                    'card.toyorun.engine': 'Unity',
                    'card.toyorun.team': '1',
                    'card.toyorun.role': 'SOLO DEV',
                    'card.toyorun.desc': '2D endless runner developed solo with Unity.',
                    // Portfolio Cards - Project Take Your Time
                    'card.project-take-your-time.title': 'Project Take Your Time',
                    'card.project-take-your-time.duration.full': '1 Week',
                    'card.project-take-your-time.duration.short': '1W',
                    'card.project-take-your-time.engine': 'Unity',
                    'card.project-take-your-time.team': '1',
                    'card.project-take-your-time.role': 'SOLO DEV',
                    'card.project-take-your-time.desc': 'Prototype developed in one week for game design exercise.',
                    // Portfolio Cards - Identity Seeker
                    'card.identity-seeker.title': 'Identity Seeker',
                    'card.identity-seeker.duration.full': '1 Week',
                    'card.identity-seeker.duration.short': '1W',
                    'card.identity-seeker.engine': 'Unity',
                    'card.identity-seeker.team': '10',
                    'card.identity-seeker.role': '',
                    'card.identity-seeker.desc': 'Global Game Jam project - Team of 10 people.',
                    // Portfolio Cards - Chicken Revenge
                    'card.chicken-revenge.title': 'Chicken Revenge',
                    'card.chicken-revenge.duration.full': '1 Month',
                    'card.chicken-revenge.duration.short': '1M',
                    'card.chicken-revenge.engine': 'Unity',
                    'card.chicken-revenge.team': '2',
                    'card.chicken-revenge.role': 'Lead Programmer',
                    'card.chicken-revenge.desc': 'Project with Lead Programmer role in 2-person team.',
                    // Portfolio Cards - SSGRP
                    'card.ssgrp.title': 'SSGRP',
                    'card.ssgrp.duration.full': '1 Week',
                    'card.ssgrp.duration.short': '1W',
                    'card.ssgrp.engine': 'Unity',
                    'card.ssgrp.team': '1',
                    'card.ssgrp.role': 'SOLO DEV',
                    'card.ssgrp.desc': 'Experimental project developed in one week.',
                    // Portfolio Cards - Axioverse
                    'card.axioverse.title': 'Axioverse',
                    'card.axioverse.duration.full': '1 Week',
                    'card.axioverse.duration.short': '1W',
                    'card.axioverse.engine': 'Unity',
                    'card.axioverse.team': '1',
                    'card.axioverse.role': 'SOLO DEV',
                    'card.axioverse.desc': 'Solo dev project - world building and systems.',
                    // Portfolio Cards - The Oppressive Bubble
                    'card.the-oppressive-bubble.title': 'The Oppressive Bubble',
                    'card.the-oppressive-bubble.duration.full': '1 Week',
                    'card.the-oppressive-bubble.duration.short': '1W',
                    'card.the-oppressive-bubble.engine': 'Unity',
                    'card.the-oppressive-bubble.team': '1',
                    'card.the-oppressive-bubble.role': 'SOLO DEV',
                    'card.the-oppressive-bubble.desc': 'Atmospheric puzzle/platformer for Global Game Jam.',
                },
                it: {
                    'nav.home': 'Home',
                    'nav.projects': 'Progetti',
                    'nav.resume': 'Curriculum',
                    'hero.title': 'Sono',
                    'hero.subtitle': 'Raffaele Castania.',
                    'hero.roles': ['un Gameplay Programmer.', 'un Sognatore.'],
                    'hero.description': 'Offro esperienze interattive incredibili attraverso sistemi strutturati :D.',
                    'portfolio.title': 'I Miei Progetti',
                    'portfolio.filter.all': 'Tutti i Progetti',
                    'portfolio.filter.unity': 'Unity',
                    'portfolio.filter.unreal': 'Unreal Engine',
                    'portfolio.filter.other': 'Altro',
                    'project.open': 'Apri Progetto',
                    'project.year': 'Anno',
                    'project.engine': 'Engine',
                    'project.duration': 'Durata',
                    'project.team': 'Team',
                    'project.github': 'GitHub',
                    'project.youtube': 'YouTube',
                    'project.view': 'Vedi Progetto',
                    'project.synopsis': 'Sinossi',
                    'project.description': 'Descrizione',
                    'project.systems': 'Sistemi Implementati',
                    'project.challenges': 'Sfide Affrontate',
                    'project.prev': 'Progetto Precedente',
                    'project.next': 'Prossimo Progetto',
                    'footer.rights': 'Tutti i diritti riservati.',
                    'footer.made': 'Realizzato con',
                    'skills.title': 'Le Mie Competenze',
                    'about.experience': 'Esperienze Lavorative',
                    'contact.title': 'Contattami',
                    'contact.name': 'Nome',
                    'contact.email': 'Email',
                    'contact.subject': 'Oggetto',
                    'contact.message': 'Messaggio',
                    'contact.send': 'Invia Messaggio',
                    // Portfolio Cards - Rumble Smash
                    'card.rumble-smash.title': 'Rumble Smash',
                    'card.rumble-smash.duration.full': '3 Mesi',
                    'card.rumble-smash.duration.short': '3M',
                    'card.rumble-smash.engine': 'Unity',
                    'card.rumble-smash.team': '1',
                    'card.rumble-smash.role': 'SOLO DEV',
                    'card.rumble-smash.desc': 'Gioco casual 1v1 dove l\'unico obiettivo è segnare!',
                    // Portfolio Cards - PuyoTetris
                    'card.puyotetris.title': 'PuyoTetris',
                    'card.puyotetris.duration.full': '5 Giorni',
                    'card.puyotetris.duration.short': '5G',
                    'card.puyotetris.engine': 'Unity',
                    'card.puyotetris.team': '1',
                    'card.puyotetris.role': 'SOLO DEV',
                    'card.puyotetris.desc': 'Clone del classico Puyo Puyo / Tetris sviluppato in 5 giorni.',
                    // Portfolio Cards - Toyorun
                    'card.toyorun.title': 'Toyorun',
                    'card.toyorun.duration.full': '3 Mesi',
                    'card.toyorun.duration.short': '3M',
                    'card.toyorun.engine': 'Unity',
                    'card.toyorun.team': '1',
                    'card.toyorun.role': 'SOLO DEV',
                    'card.toyorun.desc': 'Endless runner 2D sviluppato in solitaria con Unity.',
                    // Portfolio Cards - Project Take Your Time
                    'card.project-take-your-time.title': 'Project Take Your Time',
                    'card.project-take-your-time.duration.full': '1 Settimana',
                    'card.project-take-your-time.duration.short': '1S',
                    'card.project-take-your-time.engine': 'Unity',
                    'card.project-take-your-time.team': '1',
                    'card.project-take-your-time.role': 'SOLO DEV',
                    'card.project-take-your-time.desc': 'Prototipo sviluppato in una settimana per game design.',
                    // Portfolio Cards - Identity Seeker
                    'card.identity-seeker.title': 'Identity Seeker',
                    'card.identity-seeker.duration.full': '1 Settimana',
                    'card.identity-seeker.duration.short': '1S',
                    'card.identity-seeker.engine': 'Unity',
                    'card.identity-seeker.team': '10',
                    'card.identity-seeker.role': '',
                    'card.identity-seeker.desc': 'Progetto Global Game Jam - Team di 10 persone.',
                    // Portfolio Cards - Chicken Revenge
                    'card.chicken-revenge.title': 'Chicken Revenge',
                    'card.chicken-revenge.duration.full': '1 Mese',
                    'card.chicken-revenge.duration.short': '1M',
                    'card.chicken-revenge.engine': 'Unity',
                    'card.chicken-revenge.team': '2',
                    'card.chicken-revenge.role': 'Lead Programmer',
                    'card.chicken-revenge.desc': 'Progetto con ruolo di Lead Programmer in team da 2.',
                    // Portfolio Cards - SSGRP
                    'card.ssgrp.title': 'SSGRP',
                    'card.ssgrp.duration.full': '1 Settimana',
                    'card.ssgrp.duration.short': '1S',
                    'card.ssgrp.engine': 'Unity',
                    'card.ssgrp.team': '1',
                    'card.ssgrp.role': 'SOLO DEV',
                    'card.ssgrp.desc': 'Progetto sperimentale sviluppato in una settimana.',
                    // Portfolio Cards - Axioverse
                    'card.axioverse.title': 'Axioverse',
                    'card.axioverse.duration.full': '1 Settimana',
                    'card.axioverse.duration.short': '1S',
                    'card.axioverse.engine': 'Unity',
                    'card.axioverse.team': '1',
                    'card.axioverse.role': 'SOLO DEV',
                    'card.axioverse.desc': 'Progetto solo dev - world building e sistemi.',
                    // Portfolio Cards - The Oppressive Bubble
                    'card.the-oppressive-bubble.title': 'The Oppressive Bubble',
                    'card.the-oppressive-bubble.duration.full': '1 Settimana',
                    'card.the-oppressive-bubble.duration.short': '1S',
                    'card.the-oppressive-bubble.engine': 'Unity',
                    'card.the-oppressive-bubble.team': '1',
                    'card.the-oppressive-bubble.role': 'SOLO DEV',
                    'card.the-oppressive-bubble.desc': 'Puzzle/platformer atmosferico per Global Game Jam.',
                }
            };
        },

        updateActiveButton() {
            document.querySelectorAll('.lang-btn').forEach(btn => {
                const isActive = btn.dataset.lang === this.currentLang;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-pressed', isActive);
            });
            this.updateSliderPosition();
        },

        updateSliderPosition() {
            const toggle = document.querySelector('.lang-toggle');
            const activeBtn = document.querySelector('.lang-btn.active');
            const slider = document.querySelector('.lang-slider');
            
            if (!toggle || !activeBtn || !slider) return;

            const toggleRect = toggle.getBoundingClientRect();
            const btnRect = activeBtn.getBoundingClientRect();

            // Toggle has padding: 3px, slider is positioned at left: 3px (content-box)
            // So slider origin in viewport = toggleRect.left + 3
            // Button left in viewport = btnRect.left
            // Distance from slider origin to button left = btnRect.left - (toggleRect.left + 3)
            const togglePadding = 3;  // matches .lang-toggle padding in SCSS
            const left = btnRect.left - toggleRect.left - togglePadding;
            const width = Math.max(btnRect.width, 28);  // minimum width fallback

            // Apply directly for instant sync, or with transition
            slider.style.width = `${width}px`;
            slider.style.transform = `translateX(${left}px)`;
        },

        updateUrlLang(lang) {
            const url = new URL(window.location.href);
            url.searchParams.set('lang', lang);
            window.history.replaceState({}, '', url);
        },

        bindEvents() {
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.setLanguage(btn.dataset.lang);
                });
            });
        }
    };

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => LanguageSwitcher.init());
    } else {
        LanguageSwitcher.init();
    }

    // Expose globally
    window.LanguageSwitcher = LanguageSwitcher;
})();