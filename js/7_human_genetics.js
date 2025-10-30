window.init_7_human_genetics = function() {
    console.log('Initializing 7_human_genetics.js...');
    if (window.gsap) {
        gsap.registerPlugin(ScrollTrigger);
        
        const sections = document.querySelectorAll('.content-section');
        const progressNav = document.getElementById('progress-nav');
        let currentSectionIndex = 0;
        
        if (progressNav) {
            progressNav.innerHTML = ''; // Clear previous nav
            sections.forEach((section, index) => {
                const link = document.createElement('a');
                link.href = `#${section.id}`;
                progressNav.appendChild(link);

                ScrollTrigger.create({
                    trigger: section,
                    start: 'top center',
                    end: 'bottom center',
                    onToggle: self => {
                        if (self.isActive) {
                            currentSectionIndex = index;
                            progressNav.querySelectorAll('a').forEach((navLink, navIndex) => {
                                navLink.classList.toggle('active', navIndex === index);
                            });
                        }
                    }
                });
            });
        }

        sections.forEach(section => {
            gsap.fromTo(section.querySelector('.reveal'), 
                { opacity: 0, y: 40 }, 
                {
                    opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
                    scrollTrigger: { trigger: section, start: 'top 85%', toggleActions: 'play none none none' }
                }
            );
        });
    }

    // Quiz and Modal Logic
    const quizContainers = document.querySelectorAll('.quiz-container');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalOkBtn = document.getElementById('modal-ok-btn');

    const explanations = {
        quiz1: {
            title: "퀴즈 1: ABO식 혈액형 해설",
            body: `
                <p>A형(AO) 아버지와 B형(BO) 어머니 사이의 유전자 조합을 살펴보겠습니다.</p>
                <ul class='list-disc list-inside mt-2'>
                    <li>아버지(A) + 어머니(B) &rarr; <strong>AB형</strong></li>
                    <li>아버지(A) + 어머니(O) &rarr; <strong>A형</strong></li>
                    <li>아버지(O) + 어머니(B) &rarr; <strong>B형</strong></li>
                    <li>아버지(O) + 어머니(O) &rarr; <strong>O형</strong></li>
                </ul>
                <p class='mt-4 font-bold'>따라서 A형, B형, AB형, O형이 모두 태어날 수 있습니다.</p>
            `
        },
        quiz2: {
            title: "퀴즈 2: 반성 유전 해설",
            body: `
                <p>가계도를 분석하여 4번과 5번의 유전자형을 먼저 확정해야 합니다.</p>
                <ol class='list-decimal list-inside mt-2 space-y-2'>
                    <li><strong>2번 여성의 유전자형:</strong> 아들 3번(X'Y)이 색맹이므로, 어머니인 2번은 반드시 색맹 유전자(X')를 가진 보인자(<strong>XX'</strong>)입니다.</li>
                    <li><strong>4번 여성의 유전자형:</strong> 4번은 2번의 딸입니다. 그런데 4번이 낳은 아들 6번(X'Y)이 색맹입니다. 아들은 어머니에게 X염색체를 받으므로, 4번 역시 보인자(<strong>XX'</strong>)임을 확신할 수 있습니다.</li>
                    <li><strong>5번 남성의 유전자형:</strong> 정상 남성이므로 <strong>XY</strong>입니다.</li>
                    <li><strong>확률 계산:</strong> 보인자 어머니(XX')와 정상 아버지(XY) 사이에서 자손이 태어날 때 각 유전자형의 확률은 1/4입니다.<br>
                        (XX: 정상 딸, XX': 보인자 딸, XY: 정상 아들, X'Y: 색맹 아들)</li>
                </ol>
                <p class='mt-4 font-bold'>문제는 '정상 딸'이 태어날 확률을 묻고 있습니다. 정상 딸의 유전자형은 XX이므로, 확률은 <strong>1/4 (25%)</strong>입니다.</p>
            `
        }
    };

    function showModal(quizKey) {
        const data = explanations[quizKey];
        modalTitle.textContent = data.title;
        modalBody.innerHTML = data.body;
        
        modalOverlay.classList.remove('hidden');
        setTimeout(() => {
            modalOverlay.classList.remove('opacity-0');
            modalContent.classList.remove('opacity-0', 'scale-95');
        }, 10);
    }

    function closeModal() {
        modalOverlay.classList.add('opacity-0');
        modalContent.classList.add('opacity-0', 'scale-95');
        setTimeout(() => modalOverlay.classList.add('hidden'), 300);
    }

    modalOverlay.addEventListener('click', closeModal);
    modalCloseBtn.addEventListener('click', closeModal);
    modalOkBtn.addEventListener('click', closeModal);
    modalContent.addEventListener('click', (e) => e.stopPropagation());

    quizContainers.forEach(container => {
        const options = container.querySelectorAll('.quiz-option');
        const feedback = container.querySelector('.quiz-feedback');
        const quizKey = container.querySelector('svg') ? 'quiz2' : 'quiz1';

        options.forEach(option => {
            option.addEventListener('click', () => {
                if (option.parentElement.dataset.answered) return;
                option.parentElement.dataset.answered = 'true';
                
                option.classList.add('selected');
                const isCorrect = option.dataset.correct === 'true';
                option.classList.add(isCorrect ? 'correct' : 'incorrect');
                feedback.textContent = isCorrect ? "정답입니다! 👍" : "아쉽네요. 해설을 확인해 보세요.";
                feedback.style.color = isCorrect ? '#10b981' : '#ef4444';
                
                if (!isCorrect) container.querySelector('[data-correct="true"]').classList.add('correct');
                
                setTimeout(() => showModal(quizKey), 1000);
            });
        });
    });
}
