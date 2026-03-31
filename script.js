/**
 * =========================================================================
 * 🛠️ CONFIGURATION
 * Edit the names of the two candidates below to modify them manually.
 * =========================================================================
 */
const CANDIDATE_1_NAME = "Alice";
const CANDIDATE_2_NAME = "Bob";

// =========================================================================
// State
// =========================================================================
let state = {
    votes: {
        1: 0,
        2: 0
    }
};

// =========================================================================
// Initialization and UI Updates
// =========================================================================

function initUI() {
    // Attempt to load from localStorage so votes persist across reloads
    const savedVotes = localStorage.getItem('votingAppVotes');
    if (savedVotes) {
        state.votes = JSON.parse(savedVotes);
    }

    updateUI(false);
}

function updateUI(triggerAnim = true) {
    // Set Names on cards
    document.getElementById('name-1').innerText = CANDIDATE_1_NAME;
    document.getElementById('btn-name-1').innerText = CANDIDATE_1_NAME;
    
    document.getElementById('name-2').innerText = CANDIDATE_2_NAME;
    document.getElementById('btn-name-2').innerText = CANDIDATE_2_NAME;

    // Set Scores
    document.getElementById('score-1').innerText = state.votes[1];
    document.getElementById('score-2').innerText = state.votes[2];

    // Save state
    localStorage.setItem('votingAppVotes', JSON.stringify(state.votes));
}

// =========================================================================
// Actions
// =========================================================================

function vote(candidateId) {
    // Increment vote count
    state.votes[candidateId]++;
    
    // Update Score Element
    const scoreElement = document.getElementById(`score-${candidateId}`);
    scoreElement.innerText = state.votes[candidateId];
    
    // Animate the score pop
    scoreElement.style.animation = 'none';
    scoreElement.offsetHeight; // trigger reflow
    scoreElement.style.animation = 'popScore 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';

    // Save state
    localStorage.setItem('votingAppVotes', JSON.stringify(state.votes));
}

function resetVotes() {
    if(confirm("Are you sure you want to reset all votes?")) {
        state.votes[1] = 0;
        state.votes[2] = 0;
        updateUI();
    }
}

// Boot up
document.addEventListener('DOMContentLoaded', initUI);
