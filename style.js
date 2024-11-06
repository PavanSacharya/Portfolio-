document.addEventListener('DOMContentLoaded', () => {
    class ImageInteraction {
        constructor(selector) {
            this.image = document.querySelector(selector);
            if (!this.image) return;
            
            this.isDragging = false;
            this.startX = 0;
            this.bindEvents();
        }

        bindEvents() {
            // Use bound methods to maintain context
            this.handleMouseDown = this.handleMouseDown.bind(this);
            this.handleMouseUp = this.handleMouseUp.bind(this);
            this.handleMouseMove = this.handleMouseMove.bind(this);
            this.handleTiltEffect = this.handleTiltEffect.bind(this);
            this.handleMouseLeave = this.handleMouseLeave.bind(this);

            // Add event listeners
            this.image.addEventListener('mousedown', this.handleMouseDown);
            document.addEventListener('mouseup', this.handleMouseUp);
            document.addEventListener('mousemove', this.handleMouseMove);
            this.image.addEventListener('mousemove', this.handleTiltEffect);
            this.image.addEventListener('mouseleave', this.handleMouseLeave);
        }

        handleMouseDown(e) {
            this.isDragging = true;
            this.startX = e.pageX;
            this.image.style.cursor = 'grabbing';
            e.preventDefault();
        }

        handleMouseUp() {
            this.isDragging = false;
            this.image.style.cursor = 'grab';
        }

        handleMouseMove(e) {
            if (!this.isDragging) return;
            
            const rotation = (e.pageX - this.startX) * 0.1;
            this.applyTransform(rotation);
        }

        handleTiltEffect(e) {
            const rect = this.image.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -30;
            const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 30;
            
            this.applyTransform(rotateY, rotateX);
        }

        handleMouseLeave() {
            this.applyTransform(0, 0);
        }

        applyTransform(rotateY, rotateX = 0) {
            // Use requestAnimationFrame for smooth animations
            requestAnimationFrame(() => {
                this.image.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
        }

        destroy() {
            this.image.removeEventListener('mousedown', this.handleMouseDown);
            document.removeEventListener('mouseup', this.handleMouseUp);
            document.removeEventListener('mousemove', this.handleMouseMove);
            this.image.removeEventListener('mousemove', this.handleTiltEffect);
            this.image.removeEventListener('mouseleave', this.handleMouseLeave);
        }
    }

    class GifHandler {
        constructor(gifId, duration = 9000) {
            this.gif = document.getElementById(gifId);
            this.duration = duration;
            if (this.gif) this.init();
        }

        init() {
            this.gif.addEventListener('load', () => {
                setTimeout(() => {
                    this.gif.src = 'assets/square-reverse.gif';
                }, this.duration);
            });
        }
    }

    class SwiperManager {
        constructor(containerSelector) {
            this.containerSelector = containerSelector;
            this.swiper = null;
            this.resizeTimer = null;
            this.isMobile = window.innerWidth <= 768;
            
            this.init();
            this.handleResize();
        }

        get swiperBaseOptions() {
            return {
                effect: 'coverflow',
                grabCursor: true,
                centeredSlides: true,
                loop: true,
                speed: 600,
                coverflowEffect: {
                    rotate: this.isMobile ? 10 : 30,
                    stretch: 0,
                    depth: this.isMobile ? 100 : 200,
                    modifier: 1,
                    slideShadows: !this.isMobile
                },
                on: {
                    slideChange: () => this.updateSlideVisibility(),
                    init: () => this.updateSlideVisibility()
                }
            };
        }

        get mobileOptions() {
            return {
                slidesPerView: 1.8,
                spaceBetween: 10,
                breakpoints: {
                    320: { slidesPerView: 1.6 },
                    480: { slidesPerView: 1.8 }
                }
            };
        }

        get desktopOptions() {
            return {
                slidesPerView: 'auto',
                spaceBetween: 30
            };
        }

        init() {
            const options = {
                ...this.swiperBaseOptions,
                ...(this.isMobile ? this.mobileOptions : this.desktopOptions)
            };

            this.swiper = new Swiper(this.containerSelector, options);
        }

        updateSlideVisibility() {
            if (!this.swiper || !this.swiper.slides) return;  // Guard clause to avoid undefined errors
        
            const { slides, activeIndex } = this.swiper;
            
            slides.forEach((slide, index) => {
                const isActive = index === activeIndex;
                const isAdjacent = Math.abs(index - activeIndex) === 1;
        
                Object.assign(slide.style, {
                    opacity: isActive ? '1' : isAdjacent ? '0.6' : '0.4',
                    transform: isActive ? 'scale(1)' : 'scale(0.85)',
                    transition: 'all 0.3s ease'
                });
            });
        }
        

        handleResize() {
            const debouncedResize = () => {
                clearTimeout(this.resizeTimer);
                this.resizeTimer = setTimeout(() => {
                    this.isMobile = window.innerWidth <= 768;
                    if (this.swiper) {
                        this.swiper.destroy(true, true);
                    }
                    this.init();
                }, 250);
            };

            window.addEventListener('resize', debouncedResize);
        }
    }

    // Initialize components
    const imageInteraction = new ImageInteraction('.intro-imagess');
    const gifHandler = new GifHandler('intro-gif');
    const swiperManager = new SwiperManager('.swiper-containers');

    // Handle touch events for mobile
    if ('ontouchstart' in window) {
        document.addEventListener('touchmove', (e) => {
            if (imageInteraction.isDragging) {
                e.preventDefault();
            }
        }, { passive: false });
    }
});
