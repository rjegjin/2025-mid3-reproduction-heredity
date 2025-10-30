window.init_4_fert_egg = function() {
    console.log('Initializing 4_fert_egg.js...');
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

    let currentSlideIndex = 0;

    function updateNav(index) {
        const sectionId = slides[index].id;
        progressNavLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(slides).indexOf(entry.target);
                currentSlideIndex = index;
                updateNav(index);
            }
        });
    }, { threshold: 0.6 });

    slides.forEach(slide => observer.observe(slide));
    updateNav(0);

    if (window.gsap) {
        gsap.registerPlugin(ScrollTrigger);
        slides.forEach(section => {
            gsap.fromTo(section.children[0], 
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });
    }
    
    const revealBtn = document.getElementById('reveal-btn');
    const chickEmbryoImg = document.getElementById('chick-embryo');
    if(revealBtn) {
        revealBtn.addEventListener('click', () => {
            chickEmbryoImg.classList.toggle('hidden');
        });
    }

    // Quiz Logic
    const quizOptions = document.querySelectorAll('.quiz-option');
    const quizFeedback = document.getElementById('quiz-feedback');
    const correctAnswer = "난할";

    quizOptions.forEach(option => {
        option.addEventListener('click', () => {
            quizOptions.forEach(opt => {
                opt.classList.remove('selected', 'correct', 'incorrect');
                opt.disabled = true;
            });
            
            option.classList.add('selected');
            
            if (option.dataset.answer === correctAnswer) {
                option.classList.add('correct');
                quizFeedback.textContent = "정답입니다! 👍 난할은 세포 성장이 거의 없이 분열만 빠르게 반복하는 과정입니다.";
                quizFeedback.style.color = '#10b981';
            } else {
                option.classList.add('incorrect');
                quizFeedback.textContent = "아쉽네요. 다시 생각해 보세요. 🤔";
                quizFeedback.style.color = '#ef4444';
                document.querySelector(`[data-answer="${correctAnswer}"]`).classList.add('correct');
            }
        });
    });
}
