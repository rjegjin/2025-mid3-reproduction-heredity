document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-hub');
    const mainHeader = document.querySelector('header');
    const originalContent = contentArea.innerHTML;
    let currentChapter = null; // To keep track of loaded chapter resources

    // Function to clean up chapter-specific resources
    const cleanupChapter = () => {
        if (currentChapter) {
            const { name } = currentChapter;
            // Remove CSS
            const cssLink = document.getElementById(`chapter-css-${name}`);
            if (cssLink) {
                cssLink.remove();
            }
            currentChapter = null;
        }
        const oldScript = document.getElementById('chapter-script');
        if(oldScript) oldScript.remove();
    };

    // Function to load chapter content, styles, and scripts
    const loadChapter = async (url) => {
        cleanupChapter(); // Clean up previous chapter first

        const chapterName = url.split('.')[0];
        currentChapter = { name: chapterName };

        try {
            contentArea.innerHTML = '<div class="text-center p-12"><p class="text-xl text-slate-500">로딩 중...</p></div>';

            // 1. Load HTML content
            const response = await fetch(url);
            if (!response.ok) throw new Error('콘텐츠를 불러오는 데 실패했습니다.');
            const content = await response.text();
            
            if(mainHeader) mainHeader.classList.add('hidden');
            contentArea.innerHTML = content;

            const chapterHeader = contentArea.querySelector('#chapter-header');
            if(chapterHeader) chapterHeader.style.display = 'none';

            // 2. Load CSS
            const cssUrl = `css/${chapterName}.css`;
            const cssLink = document.createElement('link');
            cssLink.id = `chapter-css-${chapterName}`;
            cssLink.rel = 'stylesheet';
            cssLink.href = cssUrl;
            document.head.appendChild(cssLink);

            // 3. Load and execute JS
            const jsUrl = `js/${chapterName}.js`;
            const script = document.createElement('script');
            script.id = 'chapter-script';
            script.src = jsUrl;
            script.onload = () => {
                const initFunctionName = `init_${chapterName}`;
                if (typeof window[initFunctionName] === 'function') {
                    window[initFunctionName]();
                } else {
                    console.warn(`Initialization function ${initFunctionName} not found.`);
                }
            };
            document.body.appendChild(script);


            // Add a 'back to home' button
            const backButton = document.createElement('button');
            backButton.innerHTML = '&larr; 전체 목차로 돌아가기';
            backButton.className = 'mb-8 bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors';
            backButton.onclick = showHub;
            contentArea.prepend(backButton);

            // Update progress
            let progress = JSON.parse(localStorage.getItem('learningProgress')) || {};
            progress[chapterName] = true;
            localStorage.setItem('learningProgress', JSON.stringify(progress));

        } catch (error) {
            console.error(error);
            contentArea.innerHTML = `<div class="text-center p-12"><p class="text-xl text-red-500">오류: ${error.message}</p></div>`;
        }
    };

    const showHub = () => {
        cleanupChapter();
        if(mainHeader) mainHeader.classList.remove('hidden');
        contentArea.innerHTML = originalContent;
        attachHubEventListeners();
        updateProgressUI();
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
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const url = card.getAttribute('href');
                if (url && url !== '#') {
                    loadChapter(url);
                }
            });
        });

        const showButton = document.getElementById('showCardBtn');
        if (showButton) {
            showButton.addEventListener('click', (e) => {
                e.stopPropagation();
                document.getElementById('learningCard').classList.toggle('hidden');
            });
        }

        const resetButton = document.getElementById('reset-progress');
        if(resetButton) {
            resetButton.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm('모든 학습 기록을 초기화하시겠습니까?')) {
                    localStorage.removeItem('learningProgress');
                    updateProgressUI();
                }
            });
        }
    };

    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const enterIcon = document.getElementById('fullscreen-enter-icon');
    const exitIcon = document.getElementById('fullscreen-exit-icon');

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                alert(`전체 화면 모드를 시작할 수 없습니다: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    function updateFullscreenIcon() {
        if (document.fullscreenElement) {
            enterIcon.classList.add('hidden');
            exitIcon.classList.remove('hidden');
        } else {
            enterIcon.classList.remove('hidden');
            exitIcon.classList.add('hidden');
        }
    }

    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullScreen);
        document.addEventListener('fullscreenchange', updateFullscreenIcon);
    }

    attachHubEventListeners();
    updateProgressUI();
});
