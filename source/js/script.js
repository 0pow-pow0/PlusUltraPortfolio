

(function ($) {
    'use strict';

    AOS.init({
        once: true
    });

    // -----------------------
    // Progress Bar
    // -----------------------
    $(window).on('load', function () {
        $('.progress-bar').each(function () {
            var width = $(this).data('percent');
            $(this).css({ 'transition': 'width 3s' });
            $(this).appear(function () {
                console.log('hello');
                $(this).css('width', width + '%');
                $(this).find('.count').countTo({
                    from: 0,
                    to: width,
                    speed: 3000,
                    refreshInterval: 50
                });
            });
        });
    });

    // -----------------------
    // Owl Carousel
    // -----------------------
    $('.owl-carousel').owlCarousel({
        items: 1,
        loop: true,
        autoplay: true,
        dots: false,
        autoplayTimeout: 8000
    });

    // -----------------------
    // Shuffle js filter and masonry
    // -----------------------
    var Shuffle = window.Shuffle;
    var shuffleWrapper = document.querySelector('.shuffle-wrapper');
    var myShuffle = null;

    if (Shuffle && shuffleWrapper) {
        myShuffle = new Shuffle(shuffleWrapper, {
            itemSelector: '.shuffle-item',
            buffer: 1
        });

        $('input[name="shuffle-filter"]').on('change', function (evt) {
            var input = evt.currentTarget;
            if (input.checked && myShuffle) {
                myShuffle.filter(input.value);
            }
        });
    }

    // -----------------------
    // Magnific Popup gallery
    // -----------------------
    $('.portfolio-gallery').each(function () {
        $(this).find('.popup-gallery').magnificPopup({
            type: 'image',
            gallery: {
                enabled: true
            }
        });
    });

    // -----------------------
    // Code foldable blocks
    // -----------------------
    (function initCodeFoldables() {
        function setup(foldable) {
            var header = foldable.querySelector('.code-foldable__header');
            var btn = foldable.querySelector('.code-foldable__toggle');
            var content = foldable.querySelector('.code-foldable__content');
            if (!header || !btn || !content) return;

            function toggle() {
                var isExpanded = btn.getAttribute('aria-expanded') === 'true';
                btn.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
                if (isExpanded) {
                    content.classList.add('hidden');
                } else {
                    content.classList.remove('hidden');
                }
            }

            var expanded = btn.getAttribute('aria-expanded') === 'true';
            if (!expanded) {
                content.classList.add('hidden');
                btn.setAttribute('aria-expanded', 'false');
            } else {
                content.classList.remove('hidden');
            }

            header.addEventListener('click', toggle);
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
            });
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function () {
                document.querySelectorAll('.code-foldable').forEach(setup);
            });
        } else {
            document.querySelectorAll('.code-foldable').forEach(setup);
        }
    })();

})(jQuery);
