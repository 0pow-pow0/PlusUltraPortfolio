/**
 *
 */

// Language Switcher - Slider Positioning Only
(function () {
    'use strict';

    const LangSwitcher = {
        init() {
            this.positionSlider();
            window.addEventListener('resize', () => this.positionSlider());
            window.addEventListener('load', () => this.positionSlider());
            // Re-position after fonts load
            document.fonts?.ready?.then(() => this.positionSlider());
            setTimeout(() => this.positionSlider(), 50);
            setTimeout(() => this.positionSlider(), 200);
        },

        positionSlider() {
            const toggle = document.querySelector('.lang-toggle');
            const activeBtn = document.querySelector('.lang-btn.active');
            const slider = document.querySelector('.lang-slider');

            if (!toggle || !activeBtn || !slider) return;

            const toggleRect = toggle.getBoundingClientRect();
            const btnRect = activeBtn.getBoundingClientRect();

            // Toggle has padding: 3px, slider is positioned at left: 3px (content-box)
            const togglePadding = 3;
            const left = btnRect.left - toggleRect.left - togglePadding;
            const width = Math.max(btnRect.width, 28);

            slider.style.width = `${width}px`;
            slider.style.transform = `translateX(${left}px)`;
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => LangSwitcher.init());
    } else {
        LangSwitcher.init();
    }

    window.LangSwitcher = LangSwitcher;
})();