window.init_6_mendel2 = function() {
    console.log('Initializing 6_mendel2.js...');
    if (window.gsap) {
        gsap.registerPlugin(ScrollTrigger);
        
        // --- Side Navigation ---
        const sections = document.querySelectorAll('.content-section');
        const progressNav = document.getElementById('progress-nav');
        
        sections.forEach(section => {
            const link = document.createElement('a');
            link.href = `#${section.id}`;
            progressNav.appendChild(link);
        });
        const navLinks = progressNav.querySelectorAll('a');

        function updateNav(index) {
            navLinks.forEach((link, i) => link.classList.toggle('active', i === index));
        }

        sections.forEach((section, index) => {
            ScrollTrigger.create({
                trigger: section,
                start: 'top center',
                end: 'bottom center',
                onToggle: self => self.isActive && updateNav(index)
            });
        });

        // --- GSAP Animations ---
        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => {
            gsap.fromTo(el, { opacity: 0, y: 40 }, {
                opacity: 1, y: 0, duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
            });
        });
        
        const punnettCells = gsap.utils.toArray('.punnett-cell');
        gsap.from(punnettCells, {
            scale: 0.5, opacity: 0, stagger: 0.05, duration: 0.5,
            scrollTrigger: { trigger: '#punnett-container', start: 'top 70%', toggleActions: 'play none none reverse' }
        });
    }

    // --- Quiz Logic ---
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
                    feedback.textContent = "정답입니다! 👍 (비율 9:3:3:1에서 3에 해당)";
                    feedback.style.color = '#10b981';
                } else {
                    option.classList.add('incorrect');
                    feedback.textContent = "아쉽네요. 정답은 3/16입니다.";
                    feedback.style.color = '#ef4444';
                    container.querySelector('[data-correct="true"]').classList.add('correct');
                }
            });
        });
    });

    // --- YouTube IFrame API ---
    var player;
    function onYouTubeIframeAPIReady() {
        player = new YT.Player('youtube-player', {
            height: '100%',
            width: '100%',
            videoId: 'CBezq1fFUEA', // A relevant video on meiosis/independent assortment
            playerVars: { 'playsinline': 1, 'controls': 0, 'rel': 0 },
            events: {
                'onReady': onPlayerReady
            }
        });
    }
    function onPlayerReady(event) {
        const playBtn = document.getElementById('play-btn');
        const pauseBtn = document.getElementById('pause-btn');
        playBtn.addEventListener('click', () => { player.seekTo(20, true); player.playVideo(); });
        pauseBtn.addEventListener('click', () => { player.pauseVideo(); });
        
        if (window.ScrollTrigger) {
            ScrollTrigger.create({
                trigger: '#youtube-player',
                start: 'top bottom',
                end: 'bottom top',
                onLeave: () => player.pauseVideo(),
                onLeaveBack: () => player.pauseVideo()
            });
        }
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
}
