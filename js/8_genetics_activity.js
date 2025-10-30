window.init_8_genetics_activity = function() {
    console.log('Initializing 8_genetics_activity.js...');
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

    // Pedigree Analysis Interaction
    const prevBtn = document.getElementById('prev-step');
    const nextBtn = document.getElementById('next-step');
    const stepContainer = document.getElementById('step-container');
    const steps = stepContainer.querySelectorAll('.analysis-step');
    const stepIndicator = document.getElementById('step-indicator');
    const genotypeTexts = {
        c2: document.getElementById('c2-geno'),
        p1: document.getElementById('p1-geno'),
        p2: document.getElementById('p2-geno'),
        c1: document.getElementById('c1-geno'),
        c3: document.getElementById('c3-geno')
    };
    const genotypeValues = { c2: 'ee', p1: 'Ee', p2: 'Ee', c1: 'E?', c3: 'E?' };

    let currentStep = 1;
    const totalSteps = steps.length;

    function updateStepView() {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index + 1 === currentStep);
        });

        Object.values(genotypeTexts).forEach(textEl => textEl.style.opacity = '0');

        if (currentStep >= 2) {
            genotypeTexts.c2.textContent = genotypeValues.c2;
            genotypeTexts.c2.style.opacity = '1';
        }
        if (currentStep >= 3) {
            genotypeTexts.p1.textContent = genotypeValues.p1;
            genotypeTexts.p2.textContent = genotypeValues.p2;
            genotypeTexts.c1.textContent = genotypeValues.c1;
            genotypeTexts.c3.textContent = genotypeValues.c3;
            genotypeTexts.p1.style.opacity = '1';
            genotypeTexts.p2.style.opacity = '1';
            genotypeTexts.c1.style.opacity = '1';
            genotypeTexts.c3.style.opacity = '1';
        }

        stepIndicator.textContent = `${currentStep} / ${totalSteps}`;
        prevBtn.classList.toggle('disabled', currentStep === 1);
        nextBtn.classList.toggle('disabled', currentStep === totalSteps);
    }

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateStepView();
        }
    });
    nextBtn.addEventListener('click', () => {
        if (currentStep < totalSteps) {
            currentStep++;
            updateStepView();
        }
    });
    updateStepView(); 


    // Coin Toss Simulation
    const tossButton = document.getElementById('toss-button');
    const [motherCoin1, motherCoin2, fatherCoin1, fatherCoin2] = ['mother-coin1', 'mother-coin2', 'father-coin1', 'father-coin2'].map(id => document.getElementById(id));
    const motherResult = document.getElementById('mother-result');
    const fatherResult = document.getElementById('father-result');
    const childGenotypeEl = document.getElementById('child-genotype');
    const childPhenotypeEl = document.getElementById('child-phenotype');

    tossButton.addEventListener('click', () => {
        if(tossButton.disabled) return;
        
        const coins = [motherCoin1, motherCoin2, fatherCoin1, fatherCoin2];
        coins.forEach(c => c.parentElement?.classList.add('flipping'));
        tossButton.disabled = true;
        tossButton.textContent = "던지는 중...";

        setTimeout(() => {
            const mAllele1 = Math.random() < 0.5 ? 'A' : 'a';
            const mAllele2 = Math.random() < 0.5 ? 'B' : 'b';
            const fAllele1 = Math.random() < 0.5 ? 'A' : 'a';
            const fAllele2 = Math.random() < 0.5 ? 'B' : 'b';

            motherCoin1.textContent = mAllele1;
            motherCoin2.textContent = mAllele2;
            fatherCoin1.textContent = fAllele1;
            fatherCoin2.textContent = fAllele2;

            motherResult.textContent = `난자: ${mAllele1}${mAllele2}`;
            fatherResult.textContent = `정자: ${fAllele1}${fAllele2}`;
            
            const sortAlleles = (a1, a2) => (a1.toUpperCase() === a2.toLowerCase()) ? [a1.toUpperCase(), a2.toLowerCase()].join('') : [a1,a2].sort().reverse().join('');
            
            const finalAllele1 = sortAlleles(mAllele1, fAllele1);
            const finalAllele2 = sortAlleles(mAllele2, fAllele2);

            childGenotypeEl.textContent = `${finalAllele1} ${finalAllele2}`;

            let phenotype1 = finalAllele1.includes('A') ? "보조개 있음" : "보조개 없음";
            let phenotype2 = finalAllele2.includes('B') ? "분리형 귓불" : "부착형 귓불";
            childPhenotypeEl.textContent = `[ 표현형: ${phenotype1}, ${phenotype2} ]`;

            coins.forEach(c => c.parentElement?.classList.remove('flipping'));
            tossButton.disabled = false;
            tossButton.textContent = "다시 던지기";
        }, 1000);
    });

    // Quiz Logic
    const quizContainers = document.querySelectorAll('.quiz-container');
    quizContainers.forEach(container => {
        const options = container.querySelectorAll('.quiz-option');
        const feedback = container.querySelector('.quiz-feedback');
        options.forEach(option => {
            option.addEventListener('click', () => {
                if (option.parentElement.dataset.answered) return;
                option.parentElement.dataset.answered = 'true';
                
                option.classList.add('selected');
                if (option.dataset.correct === 'true') {
                    option.classList.add('correct');
                    feedback.textContent = "정답입니다! 👍";
                    feedback.style.color = '#10b981';
                } else {
                    option.classList.add('incorrect');
                    feedback.textContent = "아쉽네요. 정답을 확인해 보세요.";
                    feedback.style.color = '#ef4444';
                    container.querySelector('[data-correct="true"]').classList.add('correct');
                }
            });
        });
    });
}
