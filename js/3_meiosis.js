window.init_3_meiosis = function() {
    console.log('Initializing 3_meiosis.js...');
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
        const sectionId = slides[index].id;
        progressNavLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
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

    // YouTube Player Logic
    const phaseButtons = document.querySelectorAll('#meiosis-phases .phase-button');
    const phaseTitle = document.getElementById('phase-title');
    const phaseText = document.getElementById('phase-text');
    let player;
    let intervalId;

    function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
            height: '100%',
            width: '100%',
            videoId: 'EPBSsGqTC8I', 
            playerVars: { 'playsinline': 1, 'controls': 0, 'rel': 0 },
            events: {
                'onReady': (event) => {
                    event.target.setPlaybackRate(1.5);
                }
            }
        });
    }

    if (window.YT && window.YT.Player) {
        onYouTubeIframeAPIReady();
    } else {
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    }

    const timeSegments = {
        prophase1: { start: 1, end: 17 },
        metaphase1: { start: 18, end: 38 },
        anaphase1: { start: 47, end: 51 },
        telophase1: { start: 60, end: 69 },
        prophase2: { start: 80, end: 83 },
        metaphase2: { start: 85, end: 89 },
        anaphase2: { start: 90, end: 97 },
        telophase2: { start: 99, end: 105 }
    };
    
    const phaseData = {
        prophase1: { title: '전기 I', text: '상동 염색체끼리 접합하여 2가 염색체를 형성합니다. 교차가 일어날 수 있습니다.'},
        metaphase1: { title: '중기 I', text: '2가 염색체가 세포 중앙(적도면)에 배열됩니다.'},
        anaphase1: { title: '후기 I', text: '상동 염색체가 분리되어 세포의 양 극으로 이동합니다.'},
        telophase1: { title: '말기 I', text: '세포질이 나뉘어 2개의 딸세포가 만들어집니다. 염색체 수는 절반으로 줄어듭니다.'},
        prophase2: { title: '전기 II', text: '염색체가 다시 응축되고 방추사가 나타납니다.'},
        metaphase2: { title: '중기 II', text: '염색체가 세포 중앙에 배열됩니다.'},
        anaphase2: { title: '후기 II', text: '염색 분체가 분리되어 양 극으로 이동합니다. (체세포 분열 후기와 유사)'},
        telophase2: { title: '말기 II', text: '핵막이 다시 생기고 세포질이 나뉘어 총 4개의 딸세포가 형성됩니다.'}
    };

    function playSegment(phase) {
        if (!player || typeof player.seekTo !== 'function') return;

        player.setPlaybackRate(1.5);

        const segment = timeSegments[phase];
        if (!segment) return;
        if (intervalId) clearInterval(intervalId);
        
        player.seekTo(segment.start, true);
        player.playVideo();
        
        intervalId = setInterval(() => {
            if (player.getCurrentTime() >= segment.end) {
                player.pauseVideo();
                clearInterval(intervalId);
            }
        }, 250);
    }

    phaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const phase = button.dataset.phase;
            phaseButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            phaseTitle.textContent = phaseData[phase].title;
            phaseText.textContent = phaseData[phase].text;
            playSegment(phase);
        });
    });

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
}
