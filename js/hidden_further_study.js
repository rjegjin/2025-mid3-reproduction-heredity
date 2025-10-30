window.init_hidden_further_study = function() {
    console.log('Initializing hidden_further_study.js...');
    if (window.gsap) {
        const sections = document.querySelectorAll('#content-hub section');
        const progressNav = document.getElementById('progress-nav');
        
        if (progressNav) {
            progressNav.innerHTML = ''; // Clear previous nav
            sections.forEach((section, index) => {
                const link = document.createElement('a');
                link.href = `#${section.id}`;
                link.setAttribute('data-index', index);
                progressNav.appendChild(link);
            });
        }
        const progressNavLinks = document.querySelectorAll('#progress-nav a');

        function updateNav(index) {
            progressNavLinks.forEach((link, i) => {
                link.classList.toggle('active', i === index);
            });
        }

        gsap.registerPlugin(ScrollTrigger);
        sections.forEach((section, index) => {
            gsap.to(section, {
                autoAlpha: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top center+=100',
                    end: 'bottom center-=100',
                    onEnter: () => updateNav(index),
                    onEnterBack: () => updateNav(index),
                }
            });
        });
    }
}
