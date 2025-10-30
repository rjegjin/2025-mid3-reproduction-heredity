window.init_1_intro = function() {
    console.log('Initializing 1_intro.js...');
    const slides = document.querySelectorAll('#content-hub section');
    const progressNav = document.querySelector('#progress-nav');
    if (progressNav) {
        progressNav.innerHTML = ''; // Clear previous nav
        slides.forEach(slide => {
            const link = document.createElement('a');
            link.href = `#${slide.id}`;
            link.dataset.section = slide.id;
            link.className = 'w-3 h-3 bg-slate-300 rounded-full block';
            link.title = slide.querySelector('h2')?.textContent.trim().split('\n')[0] || slide.id;
            progressNav.appendChild(link);
        });
    }
    const progressNavLinks = document.querySelectorAll('#progress-nav a');

    function updateNav(index) {
        progressNavLinks.forEach((link, i) => {
            link.classList.toggle('active', i === index);
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(slides).indexOf(entry.target);
                updateNav(index);
            }
        });
    }, { threshold: 0.6 });

    slides.forEach(slide => observer.observe(slide));
    updateNav(0);

    // Ice cube question logic
    const iceChoices = document.querySelectorAll('#ice-choices .choice-btn');
    const iceFeedback = document.getElementById('ice-feedback');
    iceChoices.forEach(button => {
        button.addEventListener('click', () => {
            iceChoices.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            if (button.dataset.correct) {
                iceFeedback.textContent = '정답입니다! 👍';
                iceFeedback.className = 'text-center font-bold mb-6 h-6 text-green-600 text-lg';
            } else {
                iceFeedback.textContent = '다시 생각해 보세요. 🤔';
                iceFeedback.className = 'text-center font-bold mb-6 h-6 text-red-600 text-lg';
            }
        });
    });
    
    // Click-to-reveal logic
    function setupClickReveal(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const items = container.querySelectorAll('.reveal-item');
        let currentIndex = 0;

        function showNextItem() {
            if (currentIndex < items.length) {
                items[currentIndex].classList.add('visible');
                currentIndex++;
            }
            if (currentIndex >= items.length) {
                const instruction = container.querySelector('span');
                if(instruction) instruction.style.display = 'none';
            }
        }
        
        items.forEach(item => item.classList.remove('visible'));
        showNextItem();
        container.addEventListener('click', showNextItem);
    }

    setupClickReveal('necessity-reveal');
    setupClickReveal('exchange-reveal');
    setupClickReveal('efficiency-reveal');
    setupClickReveal('organism-reveal');
    setupClickReveal('summary-reveal');

    // GSAP Animations
    if (window.gsap) {
        gsap.registerPlugin(ScrollTrigger);
        slides.forEach(section => {
            gsap.fromTo(section.children[0], 
                { y: 50, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });
    }
}