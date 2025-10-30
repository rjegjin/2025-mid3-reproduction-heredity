window.init_2_mitosis = function() {
    console.log('Initializing 2_mitosis.js...');
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

    // YouTube Player Logic
    const phaseButtons = document.querySelectorAll('#mitosis-phases .phase-button');
    const phaseTitle = document.getElementById('phase-title');
    const phaseText = document.getElementById('phase-text');
    let player;
    let intervalId;

    function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
            height: '100%', width: '100%', videoId: 'LM-0RdQbSUs',
            playerVars: { 'playsinline': 1, 'controls': 0, 'rel': 0 },
        });
    }

    if (window.YT) {
        onYouTubeIframeAPIReady();
    } else {
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    }

    const timeSegments = {
        prophase: { start: 4, end: 9 },
        metaphase: { start: 11, end: 16 },
        anaphase: { start: 21, end: 24 },
        telophase: { start: 26, end: 30 }
    };
    
    const phaseData = {
        prophase: { title: '전기', text: '핵막이 사라지고 염색체가 응축되며 방추사가 형성됩니다.'},
        metaphase: { title: '중기', text: '염색체들이 세포 중앙에 배열됩니다.'},
        anaphase: { title: '후기', text: '염색분체들이 분리되어 양 극으로 이동합니다.'},
        telophase: { title: '말기', text: '두 개의 새로운 핵이 형성되고 세포질 분열이 시작됩니다.'}
    };

    function playSegment(phase) {
        if (!player || typeof player.seekTo !== 'function') return;
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

    // Modal Logic
    const modalOverlay = document.getElementById('modal-overlay');
    const dnaModal = document.getElementById('dna-modal');
    const geneModal = document.getElementById('gene-modal');

    window.openModal = function(modalId) {
        modalOverlay.classList.remove('hidden');
        setTimeout(() => {
            modalOverlay.classList.remove('opacity-0');
            if (modalId === 'dna-modal') {
                dnaModal.classList.remove('hidden');
                setTimeout(() => {
                    dnaModal.classList.remove('opacity-0', 'scale-95');
                }, 50);
            } else if (modalId === 'gene-modal') {
                geneModal.classList.remove('hidden');
                setTimeout(() => {
                    geneModal.classList.remove('opacity-0', 'scale-95');
                }, 50);
            }
        }, 10);
    }

    window.closeModal = function() {
        modalOverlay.classList.add('opacity-0');
        dnaModal.classList.add('opacity-0', 'scale-95');
        geneModal.classList.add('opacity-0', 'scale-95');
        setTimeout(() => {
            modalOverlay.classList.add('hidden');
            dnaModal.classList.add('hidden');
            geneModal.classList.add('hidden');
        }, 300);
    }
    
    // Image Slider Logic
    const slider = document.getElementById('slider');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    if (slider) {
        const images = slider.querySelectorAll('img');
        const imageCount = images.length;
        let currentIndex = 0;

        function showImage(index) {
            const offset = -index * 100;
            slider.style.transform = `translateX(${offset}%)`;
        }

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : imageCount - 1;
            showImage(currentIndex);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex < imageCount - 1) ? currentIndex + 1 : 0;
            showImage(currentIndex);
        });
        
        showImage(currentIndex);
    }
}
