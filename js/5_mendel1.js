window.init_5_mendel1 = function() {
    console.log('Initializing 5_mendel1.js...');
    const sections = document.querySelectorAll('#content-hub section');
    const progressNav = document.getElementById('progress-nav');
    if (progressNav) {
        progressNav.innerHTML = ''; // Clear previous nav
        sections.forEach((section, index) => {
            const link = document.createElement('a');
            link.href = `#${section.id}`;
            link.title = `슬라이드 ${index + 1}`;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                scrollToSection(index);
            });
            progressNav.appendChild(link);
        });
    }
    const progressNavLinks = document.querySelectorAll('#progress-nav a');
    let currentSectionIndex = 0;

    function updateNav(index) {
        progressNavLinks.forEach((link, i) => {
            link.classList.toggle('active', i === index);
        });
    }
    
    function scrollToSection(index) {
        if (index < 0 || index >= sections.length) return;
        currentSectionIndex = index;
        sections[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    if (window.gsap) {
        gsap.registerPlugin(ScrollTrigger);
        sections.forEach((section, index) => {
            gsap.to(section, {
                autoAlpha: 1, // opacity: 1, visibility: 'visible'
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%', // viewport의 80% 지점에 트리거 상단이 닿으면
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse',
                    onEnter: () => {
                        currentSectionIndex = index;
                        updateNav(index);
                    },
                    onEnterBack: () => {
                        currentSectionIndex = index;
                        updateNav(index);
                    }
                }
            });
        });
    }

    function setupQuiz(quizId) {
        const options = document.querySelectorAll(`#${quizId}-options .quiz-option`);
        const feedback = document.getElementById(`${quizId}-feedback`);
        
        options.forEach(option => {
            option.addEventListener('click', () => {
                options.forEach(opt => {
                    opt.disabled = true; 
                });
                
                option.classList.add('selected');
                
                if (option.dataset.correct) {
                    option.classList.add('correct');
                    feedback.textContent = "정답입니다! 👍";
                    feedback.style.color = '#10b981';
                } else {
                    option.classList.add('incorrect');
                    feedback.textContent = "아쉽네요. 정답을 확인해보세요. 🤔";
                    feedback.style.color = '#ef4444';
                    document.querySelector(`#${quizId}-options .quiz-option[data-correct="true"]`).classList.add('correct');
                }
            });
        });
    }
    setupQuiz('quiz1');
    setupQuiz('quiz2');
    setupQuiz('quiz3');

    updateNav(0); // 초기 로드 시 첫번째 네비게이션 활성화
}
