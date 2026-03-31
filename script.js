/**
 * =========================================================================
 * CONFIGURATION
 * Edit the names of the two candidates below.
 * =========================================================================
 */
const CANDIDATE_1_NAME = "Jothik";
const CANDIDATE_2_NAME = "Unseen";

// =========================================================================
// State
// =========================================================================
let state = {
    votes: {
        1: 0,
        2: 0
    },
    userVote: null // tracks which candidate the current user voted for
};

// =========================================================================
// Initialization and UI Updates
// =========================================================================

function initUI() {
    const savedVotes = localStorage.getItem('votingAppVotes');
    if (savedVotes) {
        state.votes = JSON.parse(savedVotes);
    }
    const savedUserVote = localStorage.getItem('votingAppUserVote');
    if (savedUserVote) {
        state.userVote = parseInt(savedUserVote);
    }
    updateUI(false);
}

function updateUI(triggerAnim = true) {
    // Set Names on cards
    document.getElementById('name-1').innerText = CANDIDATE_1_NAME;
    document.getElementById('name-2').innerText = CANDIDATE_2_NAME;

    // Set avatar initials
    document.getElementById('avatar-1').innerText = CANDIDATE_1_NAME.charAt(0).toUpperCase();
    document.getElementById('avatar-2').innerText = CANDIDATE_2_NAME.charAt(0).toUpperCase();

    // Set Scores
    document.getElementById('score-1').innerText = state.votes[1];
    document.getElementById('score-2').innerText = state.votes[2];

    // Update buttons (handles names + voted/disabled state)
    updateVoteButtons();

    // Update progress bar
    updateProgressBar();

    // Update leading indicator
    updateLeading();

    // Save state
    localStorage.setItem('votingAppVotes', JSON.stringify(state.votes));
}

function updateProgressBar() {
    const total = state.votes[1] + state.votes[2];
    const p1 = total > 0 ? (state.votes[1] / total) * 100 : 50;
    const p2 = total > 0 ? (state.votes[2] / total) * 100 : 50;

    document.getElementById('progress-1').style.width = p1 + '%';
    document.getElementById('progress-2').style.width = p2 + '%';

    document.getElementById('percent-1').innerText = total > 0 ? Math.round(p1) + '%' : '0%';
    document.getElementById('percent-2').innerText = total > 0 ? Math.round(p2) + '%' : '0%';
    document.getElementById('total-votes').innerText = total + ' total vote' + (total !== 1 ? 's' : '');
}

function updateLeading() {
    const card1 = document.getElementById('card-1');
    const card2 = document.getElementById('card-2');

    card1.classList.remove('leading');
    card2.classList.remove('leading');

    if (state.votes[1] > state.votes[2]) {
        card1.classList.add('leading');
    } else if (state.votes[2] > state.votes[1]) {
        card2.classList.add('leading');
    }
}

// =========================================================================
// Confetti
// =========================================================================

const confettiCanvas = document.getElementById('confetti-canvas');
const confettiCtx = confettiCanvas.getContext('2d');
let confettiParticles = [];

function resizeConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeConfetti);
resizeConfetti();

function spawnConfetti(x, color) {
    const colors = color === 'blue'
        ? ['#3b82f6', '#60a5fa', '#93c5fd', '#2563eb']
        : ['#ec4899', '#f472b6', '#f9a8d4', '#db2777'];

    for (let i = 0; i < 25; i++) {
        confettiParticles.push({
            x: x,
            y: window.innerHeight * 0.4,
            vx: (Math.random() - 0.5) * 12,
            vy: -(Math.random() * 8 + 4),
            size: Math.random() * 6 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            life: 1
        });
    }
}

function animateConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    confettiParticles = confettiParticles.filter(p => p.life > 0);

    confettiParticles.forEach(p => {
        p.x += p.vx;
        p.vy += 0.25;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.life -= 0.015;

        confettiCtx.save();
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate((p.rotation * Math.PI) / 180);
        confettiCtx.globalAlpha = p.life;
        confettiCtx.fillStyle = p.color;
        confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        confettiCtx.restore();
    });

    requestAnimationFrame(animateConfetti);
}
animateConfetti();

// =========================================================================
// Actions
// =========================================================================

function vote(candidateId) {
    // Prevent voting if user already voted
    if (state.userVote !== null) return;

    state.votes[candidateId]++;
    state.userVote = candidateId;

    // Update score
    const scoreElement = document.getElementById(`score-${candidateId}`);
    scoreElement.innerText = state.votes[candidateId];

    // Animate score pop
    scoreElement.style.animation = 'none';
    scoreElement.offsetHeight;
    scoreElement.style.animation = 'popScore 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';

    // Update progress & leading
    updateProgressBar();
    updateLeading();

    // Lock buttons after voting
    updateVoteButtons();

    // Confetti burst
    const card = document.getElementById(`card-${candidateId}`);
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    spawnConfetti(centerX, candidateId === 1 ? 'blue' : 'pink');

    // Save state
    localStorage.setItem('votingAppVotes', JSON.stringify(state.votes));
    localStorage.setItem('votingAppUserVote', candidateId);
}

function updateVoteButtons() {
    const btn1 = document.querySelector('.btn-1');
    const btn2 = document.querySelector('.btn-2');

    if (state.userVote !== null) {
        // Disable both buttons
        btn1.disabled = true;
        btn2.disabled = true;

        // Style the chosen button as "voted" and dim the other
        if (state.userVote === 1) {
            btn1.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg> Voted';
            btn1.classList.add('voted');
            btn2.classList.add('disabled-btn');
        } else {
            btn2.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg> Voted';
            btn2.classList.add('voted');
            btn1.classList.add('disabled-btn');
        }
    } else {
        // Re-enable both buttons (after reset)
        btn1.disabled = false;
        btn2.disabled = false;
        btn1.classList.remove('voted', 'disabled-btn');
        btn2.classList.remove('voted', 'disabled-btn');
        btn1.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-6 0v4"/><path d="M5 11h14a2 2 0 0 1 2 2v5a7 7 0 0 1-7 7h-4a7 7 0 0 1-7-7v-5a2 2 0 0 1 2-2z"/></svg> Vote <span id="btn-name-1">${CANDIDATE_1_NAME}</span>`;
        btn2.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-6 0v4"/><path d="M5 11h14a2 2 0 0 1 2 2v5a7 7 0 0 1-7 7h-4a7 7 0 0 1-7-7v-5a2 2 0 0 1 2-2z"/></svg> Vote <span id="btn-name-2">${CANDIDATE_2_NAME}</span>`;
    }
}

function resetVotes() {
    if (confirm("Are you sure you want to reset all votes?")) {
        state.votes[1] = 0;
        state.votes[2] = 0;
        state.userVote = null;
        localStorage.removeItem('votingAppUserVote');
        updateUI();
    }
}

// Boot up
document.addEventListener('DOMContentLoaded', initUI);
