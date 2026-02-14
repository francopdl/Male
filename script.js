/* ════════════════════════════════════════════════════
   🎬 CONFIGURACIÓN GLOBAL
   ════════════════════════════════════════════════════ */

const CONFIG = {
    // ⚙️ EDITAR: Respuesta correcta del quiz (0, 1 o 2)
    STORY_QUIZ_CORRECT: 1,
    // ⚙️ EDITAR: URL de música
    MUSIC_URL: 'multimedia/Amarte es un placer.mp3',
    // Frases para mostrar
    QUOTES: [
        { text: "Ti Amo", author: "Nuestro amor" },
        { text: "La distancia no es nada cuando la otra persona lo significa todo.", author: "Nuestro amor" },
        { text: "No seriamos la Male y Franco si no nos pasaran estas cosas (como llegar tarde a la terminal)", author: "Nuestro amor" },
        { text: "Amarte es un placer", author: "Nuestro amor" },
        { text: "Te vi, te vi, te vi; Yo no buscaba a nadie y te vi", author: "Nuestro amor" }
    ]
};

/* ════════════════════════════════════════════════════
   📱 MANEJO DE MÚSICA
   ════════════════════════════════════════════════════ */
class MusicManager {
    constructor(url) {
        this.audio = new Audio(url);
        this.audio.loop = true;
        this.btn = document.getElementById('musicBtn');
        this.btn.addEventListener('click', () => this.toggle());
    }

    toggle() {
        if (this.audio.paused) {
            this.play();
        } else {
            this.pause();
        }
    }

    play() {
        this.audio.play().catch(err => console.warn('No se pudo reproducir música:', err));
        this.btn.textContent = '🎵 Pausar música';
        this.btn.classList.add('music-btn--playing');
    }

    pause() {
        this.audio.pause();
        this.btn.textContent = '🎵 Reproducir música';
        this.btn.classList.remove('music-btn--playing');
    }
}

/* ════════════════════════════════════════════════════
   ❓ MANEJO DE QUIZ
   ════════════════════════════════════════════════════ */
class QuizManager {
    constructor() {
        this.initializeQuizzes();
    }

    initializeQuizzes() {
        // Inicializar todos los quizzes
        const quizzes = document.querySelectorAll('[data-quiz]');
        quizzes.forEach(quiz => {
            const quizType = quiz.dataset.quiz;
            const correctValue = document.getElementById(`${quizType}-quiz-correct`);
            
            if (correctValue) {
                // Permitir múltiples respuestas correctas (separadas por coma)
                const correctIndices = correctValue.value.split(',').map(v => parseInt(v.trim()));
                const options = quiz.querySelectorAll('.quiz__option');
                options.forEach(option => {
                    option.addEventListener('click', () => this.handleQuizAnswer(quiz, option, correctIndices, quizType));
                });
            }
        });
    }

    handleQuizAnswer(quizElement, selectedOption, correctIndices, quizType) {
        const options = quizElement.querySelectorAll('.quiz__option');
        const selectedIndex = parseInt(selectedOption.dataset.index);
        const feedback = quizElement.querySelector('.quiz__feedback');
        const isCorrect = correctIndices.includes(selectedIndex);

        // Deshabilitar todas las opciones inmediatamente
        options.forEach(opt => {
            opt.disabled = true;
            opt.style.pointerEvents = 'none';
        });

        if (isCorrect) {
            selectedOption.classList.add('quiz__option--correct');
            feedback.innerHTML = '✅ ¡Correcto! Así fue...';
            feedback.classList.remove('quiz__feedback--incorrect');
            feedback.classList.add('quiz__feedback--correct');
            feedback.style.display = 'block';
            
            // Desbloquear botón siguiente según el tipo de quiz
            const nextBtnId = `${quizType}NextBtn`;
            const nextBtn = document.getElementById(nextBtnId);
            if (nextBtn) {
                nextBtn.disabled = false;
            }
        } else {
            selectedOption.classList.add('quiz__option--incorrect');
            feedback.innerHTML = '❌ Mmm, no fue así. Intenta de nuevo.';
            feedback.classList.remove('quiz__feedback--correct');
            feedback.classList.add('quiz__feedback--incorrect');
            feedback.style.display = 'block';

            setTimeout(() => {
                selectedOption.classList.remove('quiz__option--incorrect');
                options.forEach(opt => {
                    opt.disabled = false;
                    opt.style.pointerEvents = 'auto';
                });
                feedback.style.display = 'none';
            }, 2000);
        }
    }
}

/* ════════════════════════════════════════════════════
    EFECTOS VISUALES
   ════════════════════════════════════════════════════ */
class EffectsManager {
    static createConfetti(count = 50) {
        const colors = ['#ff6b9d', '#ffd700', '#ff85b3', '#ffb3d9'];

        for (let i = 0; i < count; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = (Math.random() * 0.5) + 's';
            confetti.style.animationDuration = (Math.random() * 1.5 + 2.5) + 's';
            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 4000);
        }
    }

    static createHearts(count = 30) {
        const hearts = ['❤️', '💕', '💖', '💗', '💝'];

        for (let i = 0; i < count; i++) {
            const heart = document.createElement('div');
            heart.className = 'heart-particle';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.bottom = '-50px';
            heart.style.animationDelay = (Math.random() * 0.3) + 's';
            heart.style.animationDuration = (Math.random() * 2 + 3) + 's';
            document.body.appendChild(heart);

            setTimeout(() => heart.remove(), 5000);
        }
    }

    static openGift() {
        const giftBox = document.getElementById('giftBox');
        giftBox.style.animation = 'none';

        setTimeout(() => {
            giftBox.style.transform = 'scale(0)';
            giftBox.style.opacity = '0';
            giftBox.style.transition = 'all 0.5s ease';
        }, 100);

        EffectsManager.createConfetti(50);
        EffectsManager.createHearts(30);
    }
}

/* ════════════════════════════════════════════════════
   📄 MANEJO DE FRASES
   ════════════════════════════════════════════════════ */
function initializeQuotes() {
    const quotesList = document.getElementById('quotesList');
    CONFIG.QUOTES.forEach(quote => {
        const card = document.createElement('div');
        card.className = 'quote-card';
        card.innerHTML = `
            <div class="quote-card__text">"${quote.text}"</div>
            <div class="quote-card__author">— ${quote.author}</div>
        `;
        quotesList.appendChild(card);
    });
}

/* ════════════════════════════════════════════════════
   📊 MANEJO DE PROGRESO
   ════════════════════════════════════════════════════ */
class ProgressManager {
    constructor() {
        this.sections = document.querySelectorAll('.section');
        this.progressBar = document.getElementById('progressBar');
        this.currentIndex = 0;
        this.updateProgress();
    }

    updateProgress() {
        const progress = ((this.currentIndex + 1) / this.sections.length) * 100;
        this.progressBar.style.width = progress + '%';
    }

    scrollToSection(index) {
        if (index >= 0 && index < this.sections.length) {
            this.currentIndex = index;
            this.sections[index].scrollIntoView({ behavior: 'smooth' });
            this.updateProgress();
        }
    }

    getNextIndex() {
        return Math.min(this.currentIndex + 1, this.sections.length - 1);
    }
}

/* ════════════════════════════════════════════════════
   🎯 INICIALIZACIÓN
   ════════════════════════════════════════════════════ */
const progressMgr = new ProgressManager();
const musicMgr = new MusicManager(CONFIG.MUSIC_URL);
const quizMgr = new QuizManager();

// Esconder pantalla de carga
setTimeout(() => {
    document.getElementById('appLoader').style.display = 'none';
}, 2700);

// Inicializar frases
initializeQuotes();

// Eventos de navegación
document.getElementById('heroStartBtn').addEventListener('click', () => {
    progressMgr.scrollToSection(1);
});

document.getElementById('storyNextBtn').addEventListener('click', () => {
    progressMgr.scrollToSection(2);
});

document.getElementById('momentsNextBtn').addEventListener('click', () => {
    progressMgr.scrollToSection(3);
});

document.getElementById('quotesNextBtn').addEventListener('click', () => {
    progressMgr.scrollToSection(4);
});

document.getElementById('memoriesNextBtn').addEventListener('click', () => {
    progressMgr.scrollToSection(5);
});

document.getElementById('loveNextBtn').addEventListener('click', () => {
    progressMgr.scrollToSection(6);
});

document.getElementById('openGiftBtn').addEventListener('click', () => {
    EffectsManager.openGift();
});

// Soporte para teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
        progressMgr.scrollToSection(progressMgr.getNextIndex());
    }
});
