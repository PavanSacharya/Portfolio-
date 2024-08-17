
document.addEventListener('DOMContentLoaded', () => {
    const image = document.querySelector('.intro-imagess');
    let isDragging = false;
    let startX = 0;

    image.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX;
        image.style.cursor = 'grabbing';
        e.preventDefault();
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        image.style.cursor = 'grab';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const x = e.pageX;
            const rotation = (x - startX) * 0.1; // Adjust rotation sensitivity
            image.style.transform = `rotateY(${rotation}deg)`;
        }
    });

    const imageTilt = document.querySelector('.intro-imagess');

    imageTilt.addEventListener('mousemove', (e) => {
        const rect = imageTilt.getBoundingClientRect();
        const x = e.clientX - rect.left; // X coordinate relative to the image
        const y = e.clientY - rect.top; // Y coordinate relative to the image
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -30; // Increase the -10 value to -30 for more tilt
        const rotateY = (x - centerX) / centerX * 30; // Increase the 10 value to 30 for more tilt

        imageTilt.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    imageTilt.addEventListener('mouseleave', () => {
        imageTilt.style.transform = 'rotateX(0) rotateY(0)'; // Reset to initial state
    });
});
// 3 section
var swiper = new Swiper('.swiper-containers', {
    pagination: '.swiper-paginations',
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    coverflow: {
        rotate: 20,
        stretch: 0,
        depth: 200,
        modifier: 1,
        slideShadows: true,
    },
    loop: true,
});


document.addEventListener('DOMContentLoaded', function() {
    const gif = document.getElementById('intro-gif');
    
    // Function to swap the GIF source
    function swapGif() {
        gif.src = 'assets/square-reverse.gif'; // Swap to reversed GIF
    }

    // Assuming you know the duration of the GIF in milliseconds
    const gifDuration = 9000; // Adjust this value to match the duration of your GIF

    // Start playing the GIF
    gif.addEventListener('load', function() {
        // Set a timeout to wait until the GIF has likely ended
        setTimeout(swapGif, gifDuration);
    });
});

