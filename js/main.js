document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-hub');
    const progressNav = document.getElementById('progress-nav');
    const originalContent = contentArea.innerHTML;

    const getMainHeader = () => document.querySelector('header');

    const cleanupChapter = () => {
        const oldScript = document.getElementById('chapter-script');
        if (oldScript) oldScript.remove();

        document.querySelectorAll('link[id^="chapter-css-"]').forEach(link => link.remove());

        if (progressNav) {
            progressNav.classList.add('hidden');
            progressNav.innerHTML = '';
        }
        
        // Remove GSAP markers if any
        if (window.ScrollTrigger) {
            ScrollTrigger.getAll().forEach(t => t.kill());
        }
    };

    const loadChapter = async (url, pushState = true) => {
        cleanupChapter();

        const chapterName = url.split('.')[0];
        
        try {
            contentArea.innerHTML = '<div class="text-center p-12"><p class="text-xl text-slate-500 italic">지식을 불러오는 중...</p></div>';

            const response = await fetch(url);
            if (!response.ok) throw new Error('콘텐츠를 불러오는 데 실패했습니다.');
            const content = await response.text();
            
            const header = getMainHeader();
            if (header) header.classList.add('hidden');

            contentArea.innerHTML = content;

            // Apply global aesthetic scale-up for emotional spacing
            contentArea.querySelectorAll('section').forEach(sec => {
                sec.classList.add('px-8', 'md:px-20', 'py-32', 'md:py-48');
            });

            // Intersection Observer for scroll animations
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    }
                });
            }, { threshold: 0.15 });
            contentArea.querySelectorAll('section').forEach(sec => observer.observe(sec));

            contentArea.querySelectorAll('h2').forEach(h => {
                if (!h.classList.contains('text-4xl')) h.classList.add('text-4xl', 'md:text-6xl', 'mb-16', 'font-black');
            });
            contentArea.querySelectorAll('p').forEach(p => {
                if (!p.classList.contains('text-xl')) p.classList.add('text-lg', 'md:text-2xl', 'font-light', 'text-slate-600');
            });

            // Load CSS before JS
            const cssLink = document.createElement('link');
            cssLink.id = `chapter-css-${chapterName}`;
            cssLink.rel = 'stylesheet';
            cssLink.href = `css/${chapterName}.css`;
            document.head.appendChild(cssLink);

            // Load and execute JS
            const script = document.createElement('script');
            script.id = 'chapter-script';
            script.src = `js/${chapterName}.js`;
            script.onload = () => {
                const initFunctionName = `init_${chapterName}`;
                if (typeof window[initFunctionName] === 'function') {
                    if (progressNav) progressNav.classList.remove('hidden');
                    window[initFunctionName]();
                    
                    // Refresh ScrollTrigger after content is initialized
                    setTimeout(() => {
                        if (window.ScrollTrigger) ScrollTrigger.refresh();
                    }, 100);
                }
            };
            document.body.appendChild(script);

            // Add 'back to home' button
            const backButton = document.createElement('button');
            backButton.innerHTML = '&larr; 전체 목차로 돌아가기';
            backButton.className = 'fixed top-4 left-4 z-50 bg-white/90 backdrop-blur shadow-md text-slate-700 font-bold py-2 px-4 rounded-lg hover:bg-white transition-all hover:scale-105';
            backButton.onclick = () => showHub(true);
            contentArea.prepend(backButton);

            let progress = JSON.parse(localStorage.getItem('learningProgress')) || {};
            progress[chapterName] = true;
            localStorage.setItem('learningProgress', JSON.stringify(progress));

            if (pushState) {
                history.pushState({ type: 'chapter', url: url }, '', `#${chapterName}`);
            }

            window.scrollTo(0, 0);

        } catch (error) {
            console.error(error);
            contentArea.innerHTML = `<div class="text-center p-12"><p class="text-xl text-red-500">오류: ${error.message}</p><button onclick="location.reload()" class="mt-4 text-sky-500 underline">새로고침</button></div>`;
        }
    };

    const showHub = (pushState = true) => {
        cleanupChapter();
        contentArea.innerHTML = originalContent;
        
        const header = getMainHeader();
        if (header) header.classList.remove('hidden');

        attachHubEventListeners();
        updateProgressUI();

        if (pushState) {
            history.pushState({ type: 'hub' }, '', window.location.pathname + window.location.search);
        }
        window.scrollTo(0, 0);
    };

    const updateProgressUI = () => {
        const progress = JSON.parse(localStorage.getItem('learningProgress')) || {};
        document.querySelectorAll('.chapter-card').forEach(card => {
            const chapterName = card.dataset.chapter;
            if (progress[chapterName]) {
                card.classList.add('completed');
            } else {
                card.classList.remove('completed');
            }
        });
    };

    const attachHubEventListeners = () => {
        document.querySelectorAll('.chapter-card').forEach(card => {
            card.onclick = (e) => {
                e.preventDefault();
                const url = card.getAttribute('href');
                if (url && url !== '#') {
                    loadChapter(url);
                }
            };
        });

        const showButton = document.getElementById('showCardBtn');
        if (showButton) {
            showButton.onclick = (e) => {
                e.stopPropagation();
                document.getElementById('learningCard').classList.toggle('hidden');
            };
        }

        const resetButton = document.getElementById('reset-progress');
        if (resetButton) {
            resetButton.onclick = (e) => {
                e.stopPropagation();
                if (confirm('모든 학습 기록을 초기화하시겠습니까?')) {
                    localStorage.removeItem('learningProgress');
                    updateProgressUI();
                }
            };
        }
    };

    const setupFullscreen = () => {
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        const enterIcon = document.getElementById('fullscreen-enter-icon');
        const exitIcon = document.getElementById('fullscreen-exit-icon');

        if (!fullscreenBtn) return;

        const toggleFullScreen = () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    alert(`전체 화면 모드를 시작할 수 없습니다: ${err.message}`);
                });
            } else {
                if (document.exitFullscreen) document.exitFullscreen();
            }
        };

        const updateFullscreenIcon = () => {
            if (document.fullscreenElement) {
                enterIcon.classList.add('hidden');
                exitIcon.classList.remove('hidden');
            } else {
                enterIcon.classList.remove('hidden');
                exitIcon.classList.add('hidden');
            }
        };

        fullscreenBtn.onclick = toggleFullScreen;
        document.addEventListener('fullscreenchange', updateFullscreenIcon);
    };

    window.onpopstate = (event) => {
        if (event.state && event.state.type === 'chapter') {
            loadChapter(event.state.url, false);
        } else {
            showHub(false);
        }
    };

    const hash = window.location.hash.substring(1);
    if (hash && hash !== '') {
        loadChapter(`${hash}.html`, false);
    } else {
        attachHubEventListeners();
        updateProgressUI();
    }

    setupFullscreen();
});
