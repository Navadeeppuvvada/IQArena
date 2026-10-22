// ==================== ENVIRONMENT SETUP (NODE.JS SUPPORT) ====================
if (typeof window === 'undefined') {
    // Mock Browser Environment for Node.js Testing
    global.window = global;
    global.document = {
        addEventListener: (event, callback) => {
            if (event === 'DOMContentLoaded') setTimeout(callback, 0);
        },
        getElementById: () => ({
            classList: { add: () => {}, remove: () => {} },
            value: '',
            textContent: '',
            style: {},
            innerHTML: '',
            focus: () => {}
        }),
        createElement: () => ({
            className: '',
            innerHTML: '',
            onclick: null
        }),
        querySelectorAll: () => []
    };
    global.localStorage = {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {}
    };
    global.alert = console.log;
    global.location = { reload: () => {} };
    // Mock Chart.js
    global.Chart = function() { return { destroy: () => {} }; };
}

// ==================== IQ ARENA - COMPLETE JAVASCRIPT ====================

// ==================== CONFIGURATION ====================
const CONFIG = {
    IQ_TEST: { TOTAL_QUESTIONS: 30, TIME_LIMIT: 1200, QUESTIONS_PER_CATEGORY: 6, MIN_IQ: 70, MAX_IQ: 160 },
    CATEGORIES: ['logical', 'numerical', 'verbal', 'spatial', 'abstract'],
    STORAGE_KEYS: { USERS: 'iqUsers', CURRENT_USER: 'currentUser' },
    AGE_ADJUSTMENTS: [
        { maxAge: 10, adjustment: 15 }, { maxAge: 15, adjustment: 10 },
        { maxAge: 20, adjustment: 5 }, { maxAge: 30, adjustment: 0 },
        { maxAge: 50, adjustment: -2 }, { maxAge: 100, adjustment: -5 }
    ],
    IQ_CATEGORIES: [
        { minScore: 145, category: '🏆 Genius Level', description: 'Exceptional intellectual ability. Top 0.1% of population.', color: 'text-purple-400' },
        { minScore: 130, category: '⭐ Very Superior', description: 'Gifted intelligence. Top 2% of population.', color: 'text-cyan-400' },
        { minScore: 115, category: '✨ Above Average', description: 'Higher than average intelligence. Better than 84%.', color: 'text-green-400' },
        { minScore: 85, category: '👍 Average', description: 'Normal intelligence level, shared by about 68%.', color: 'text-yellow-400' },
        { minScore: 0, category: '📚 Keep Practicing', description: 'Regular practice can help improve your abilities.', color: 'text-orange-400' }
    ]
};

// ==================== SAFE STORAGE & OUTPUT HELPERS ====================
// This app is a browser-only prototype. Local storage is convenient for demos,
// but it is not a secure backend and must not be used for real credentials.
function readStoredJSON(key, fallback = {}) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : fallback;
    } catch (error) {
        console.warn(`Could not read saved data for "${key}". Using defaults.`, error);
        return fallback;
    }
}

function writeStoredJSON(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Could not save "${key}". Browser storage may be unavailable or full.`, error);
        if (typeof alert === 'function') {
            alert('Your browser could not save this change. Check storage permissions or available space.');
        }
        return false;
    }
}

function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>\"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', "'": '&#39;'
    }[character]));
}

const BADGES_DATA = {
    1: [
        { id: 'l1_1', type: 'start', name: 'Novice', desc: 'Complete your first test' },
        { id: 'l1_2', type: 'test', name: 'Learner', desc: 'Answer 10 questions' },
        { id: 'l1_3', type: 'brain', name: 'Thinker', desc: 'Score over 80 IQ' },
        { id: 'l1_4', type: 'speed', name: 'Quick', desc: 'Finish in under 10m' },
        { id: 'l1_5', type: 'accuracy', name: 'Accurate', desc: '5 correct in a row' }
    ],
    2: [
        { id: 'l2_1', type: 'brain', name: 'Smart', desc: 'Score over 100 IQ' },
        { id: 'l2_2', type: 'test', name: 'Scholar', desc: 'Complete 5 tests' },
        { id: 'l2_3', type: 'memory', name: 'Observer', desc: 'Play Memory Game' },
        { id: 'l2_4', type: 'speed', name: 'Swift', desc: 'Finish in under 8m' },
        { id: 'l2_5', type: 'accuracy', name: 'Precise', desc: '80% Accuracy in test' }
    ],
    3: [
        { id: 'l3_1', type: 'brain', name: 'Genius', desc: 'Score over 115 IQ' },
        { id: 'l3_2', type: 'test', name: 'Expert', desc: 'Complete 10 tests' },
        { id: 'l3_3', type: 'memory', name: 'Eidetic', desc: 'Score 500+ in Memory' },
        { id: 'l3_4', type: 'speed', name: 'Flash', desc: 'Finish in under 5m' },
        { id: 'l3_5', type: 'accuracy', name: 'Sharp', desc: '90% Accuracy in test' }
    ],
    4: [
        { id: 'l4_1', type: 'brain', name: 'Master', desc: 'Score over 130 IQ' },
        { id: 'l4_2', type: 'test', name: 'Veteran', desc: 'Complete 25 tests' },
        { id: 'l4_3', type: 'streak', name: 'Devoted', desc: '3 Day Streak' },
        { id: 'l4_4', type: 'speed', name: 'Instant', desc: 'Finish in under 3m' },
        { id: 'l4_5', type: 'memory', name: 'Mentalist', desc: 'Score 1000+ in Memory' }
    ],
    5: [
        { id: 'l5_1', type: 'brain', name: 'Alien', desc: 'Score over 145 IQ' },
        { id: 'l5_2', type: 'test', name: 'Legend', desc: 'Complete 50 tests' },
        { id: 'l5_3', type: 'accuracy', name: 'Oracle', desc: '100% Accuracy' },
        { id: 'l5_4', type: 'all', name: 'Cosmic', desc: 'Unlock 24 Badges' },
        { id: 'l5_5', type: 'streak', name: 'Infinite', desc: '100 Total Activities' }
    ]
};

// Helper to get SVG icons for badges
function getBadgeIcon(type) {
    // Define gradients for attractive icons
    const gradients = `
        <defs>
            <linearGradient id="gradGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#F59E0B;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#D97706;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="gradBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#6366F1;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#4F46E5;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="gradFire" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#F97316;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#EA580C;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="gradGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#10B981;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="gradPurple" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#A855F7;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#9333EA;stop-opacity:1" />
            </linearGradient>
        </defs>
    `;

    const icons = {
        // Star - Gold Gradient
        start: `${gradients}<path fill="url(#gradGold)" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>`,
        
        // Test/Certificate - Blue
        test: `${gradients}<path fill="url(#gradBlue)" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>`,
        
        // Brain - Purple
        brain: `${gradients}<path fill="url(#gradPurple)" d="M12 3c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6 6 6z"/><path fill="url(#gradPurple)" d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>`,
        
        // Speed - Lightning - Gold
        speed: `${gradients}<path fill="url(#gradGold)" d="M7 2v11h3v9l7-12h-4l4-8z"/>`,
        
        // Accuracy - Target - Green
        accuracy: `${gradients}<path fill="url(#gradGreen)" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>`,
        
        // Streak - Fire - Fire Gradient
        streak: `${gradients}<path fill="url(#gradFire)" d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z"/>`,
        
        // Memory - Eye - Blue
        memory: `${gradients}<path fill="url(#gradBlue)" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>`,
        
        // All - Trophy - Gold
        all: `${gradients}<path fill="url(#gradGold)" d="M20.2 2H3.8c-1.1 0-2 .9-2 2s.9 2 2 2c0 4.4 3.6 8 8 8h.2c4.4 0 8-3.6 8-8 1.1 0 2-.9 2-2s-.9-2-2-2zm-8.2 8c-3.3 0-6-2.7-6-6V4h12v.1c0 3.2-2.7 5.9-6 5.9zM5 20v2h14v-2h-5v-4h-4v4H5z"/>`
    };

    // Mapping to clean up keys
    const iconMap = {
        start: icons.start,
        test: icons.test,
        brain: icons.brain,
        speed: icons.speed,
        accuracy: icons.accuracy,
        streak: icons.streak,
        memory: icons.memory,
        all: icons.all
    };

    return iconMap[type] || iconMap.start;
}

// ==================== STATE ====================
let currentUser = null;
let currentActiveSection = 'home'; // Track active section

// ==================== PROFESSIONAL 3D TILT EFFECT ====================
// Applies subtle 3D tilt to interactive cards only
document.addEventListener('mousemove', (e) => {
    const card = e.target.closest('.card, .scientist-card-enhanced, .badge-item, .feature-icon');
    if (!card) {
        // Reset any active tilt if we moved off
        document.querySelectorAll('.tilt-active').forEach(el => {
            el.style.transform = 'none';
            el.classList.remove('tilt-active');
        });
        return;
    }

    // Don't tilt if in IQ Test question area (to prevent misclicks)
    if (card.closest('#iq-test-section')) return;
    
    // Don't tilt in Matrix Memory Game board
    if (card.closest('#memory-game-area') && memoryState && memoryState.game === 'pattern-recognition') return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation (reduced to max 2 degrees for subtle effect)
    const rotateX = ((y - centerY) / centerY) * -2;
    const rotateY = ((x - centerX) / centerX) * 2;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.005, 1.005, 1.005)`;
    card.classList.add('tilt-active');
});

document.addEventListener('mouseout', (e) => {
    if (e.target.classList && (e.target.classList.contains('card') || e.target.classList.contains('scientist-card-enhanced'))) {
        e.target.style.transform = 'none';
        e.target.classList.remove('tilt-active');
    }
});

let isLoginMode = true;
let iqTestState = { questions: [], currentIndex: 0, answers: [], startTime: null, timer: null };
let practiceState = { category: '', questions: [], currentIndex: 0, score: 0, answered: false };
let memoryState = { game: '', level: 1, score: 0, data: {} };
let questionBank = null;
let usedQuestionsInSession = new Set();
let practiceUsedQuestions = new Set();
let practiceQuestionPool = [];

// ==================== SCIENTISTS DATA ====================
const scientists = [
    { name: "William James Sidis", iq: "250-300", field: "Mathematics", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/William_James_Sidis_1914.jpg/220px-William_James_Sidis_1914.jpg" },
    { name: "Terence Tao", iq: "225-230", field: "Mathematics", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Terence_Tao%2C_PCTS%2C_2006.jpg/220px-Terence_Tao%2C_PCTS%2C_2006.jpg" },
    { name: "Marilyn vos Savant", iq: "228", field: "Writer", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Marilyn_vos_Savant.jpg/220px-Marilyn_vos_Savant.jpg" },
    { name: "Christopher Hirata", iq: "225", field: "Astrophysics", image: "https://physics.osu.edu/sites/default/files/styles/person_teaser/public/people/ChrisHirata2014%20%281%29.jpg" },
    { name: "Kim Ung-yong", iq: "210", field: "Physics", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Kim_Ung-yong.jpg/220px-Kim_Ung-yong.jpg" },
    { name: "Garry Kasparov", iq: "190", field: "Chess", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Kasparov-34.jpg/220px-Kasparov-34.jpg" },
    { name: "Albert Einstein", iq: "160-190", field: "Physics", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Albert_Einstein_1947.jpg/220px-Albert_Einstein_1947.jpg" },
    { name: "Stephen Hawking", iq: "160", field: "Physics", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Stephen_Hawking.StarChild.jpg/220px-Stephen_Hawking.StarChild.jpg" },
    { name: "Isaac Newton", iq: "190-200", field: "Physics", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/GodfreyKneller-IsaacNewton-1689.jpg/220px-GodfreyKneller-IsaacNewton-1689.jpg" },
    { name: "Srinivasa Ramanujan", iq: "185", field: "Mathematics", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Srinivasa_Ramanujan_-_OPC_-_1.jpg/220px-Srinivasa_Ramanujan_-_OPC_-_1.jpg" },
    { name: "Leonardo da Vinci", iq: "180-220", field: "Polymath", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Francesco_Melzi_-_Portrait_of_Leonardo.png/220px-Francesco_Melzi_-_Portrait_of_Leonardo.png" },
    { name: "Nikola Tesla", iq: "160-310", field: "Engineering", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/N.Tesla.JPG/220px-N.Tesla.JPG" },
    { name: "Marie Curie", iq: "180-200", field: "Physics", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Marie_Curie_c._1920s.jpg/220px-Marie_Curie_c._1920s.jpg" },
    { name: "Galileo Galilei", iq: "180-200", field: "Astronomy", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Justus_Sustermans_-_Portrait_of_Galileo_Galilei%2C_1636.jpg/220px-Justus_Sustermans_-_Portrait_of_Galileo_Galilei%2C_1636.jpg" },
    { name: "Bobby Fischer", iq: "180", field: "Chess", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Bobby_Fischer_1960_in_Leipzig_in_color.jpg/220px-Bobby_Fischer_1960_in_Leipzig_in_color.jpg" },
    { name: "Johann Goethe", iq: "210-225", field: "Literature", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Goethe_%28Stieler_1828%29.jpg/220px-Goethe_%28Stieler_1828%29.jpg" },
    { name: "Gottfried Leibniz", iq: "182-205", field: "Philosophy", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Gottfried_Wilhelm_Leibniz%2C_Bernhard_Christoph_Francke.jpg/220px-Gottfried_Wilhelm_Leibniz%2C_Bernhard_Christoph_Francke.jpg" },
    { name: "Blaise Pascal", iq: "195", field: "Mathematics", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Blaise_Pascal_Versailles.JPG/220px-Blaise_Pascal_Versailles.JPG" },
    { name: "John Stuart Mill", iq: "200", field: "Philosophy", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/John_Stuart_Mill_by_London_Stereoscopic_Company%2C_c1870.jpg/220px-John_Stuart_Mill_by_London_Stereoscopic_Company%2C_c1870.jpg" },
    { name: "Carl Gauss", iq: "250-300", field: "Mathematics", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Carl_Friedrich_Gauss_1840_by_Jensen.jpg/220px-Carl_Friedrich_Gauss_1840_by_Jensen.jpg" }
];

// ==================== QUESTION GENERATORS ====================
function getDifficulty(age) {
    if (age >= 5 && age <= 9) return 'simple';
    if (age < 10) return 'easy';
    if (age < 17) return 'medium';
    return 'hard';
}

function generateLogicalQuestions(age) {
    const difficulty = getDifficulty(age);
    const questions = [];
    
    if (difficulty === 'simple') {
        // Age 5-9: Very simple questions
        const simpleQuestions = [
            { q: "What comes next: 1, 2, 3, ?", options: ["4", "5", "2", "1"], answer: 0, explanation: "Count up by 1." },
            { q: "What color is a banana?", options: ["Yellow", "Red", "Blue", "Purple"], answer: 0, explanation: "Bananas are yellow." },
            { q: "Which one is an animal?", options: ["Dog", "Car", "Tree", "Rock"], answer: 0, explanation: "A dog is an animal." },
            { q: "What shape is round?", options: ["Circle", "Square", "Triangle", "Star"], answer: 0, explanation: "A circle is round." },
            { q: "A, B, C, ?", options: ["D", "E", "F", "G"], answer: 0, explanation: "Alphabet order." },
            { q: "1 + 1 = ?", options: ["2", "3", "1", "4"], answer: 0, explanation: "1 plus 1 is 2." },
            { q: "Which is biggest?", options: ["Elephant", "Ant", "Mouse", "Cat"], answer: 0, explanation: "An elephant is the biggest." },
            { q: "Day, Night, Day, ?", options: ["Night", "Sun", "Moon", "Star"], answer: 0, explanation: "Pattern repeats Day, Night." },
            { q: "Which is a fruit?", options: ["Apple", "Carrot", "Potato", "Broccoli"], answer: 0, explanation: "Apple is a fruit." },
            { q: "How many fingers on one hand?", options: ["5", "10", "2", "1"], answer: 0, explanation: "You have 5 fingers on one hand." }
        ];
        simpleQuestions.forEach((p, i) => questions.push({ ...p, id: `log_simple_${i}` }));

    } else if (difficulty === 'easy') {
        // Age 5-9: Simple patterns and sequences
        const easyPatterns = [
            { q: "1, 2, 3, 4, ?", options: ["5", "6", "7", "8"], answer: 0, explanation: "Count up by 1." },
            { q: "2, 4, 6, 8, ?", options: ["9", "10", "12", "11"], answer: 1, explanation: "Add 2 each time." },
            { q: "5, 10, 15, 20, ?", options: ["25", "30", "35", "40"], answer: 0, explanation: "Count by 5s." },
            { q: "10, 9, 8, 7, ?", options: ["6", "5", "4", "3"], answer: 0, explanation: "Count down by 1." },
            { q: "A, B, C, D, ?", options: ["E", "F", "G", "H"], answer: 0, explanation: "Alphabet order." },
            { q: "Red, Blue, Red, Blue, ?", options: ["Red", "Blue", "Green", "Yellow"], answer: 0, explanation: "Pattern repeats Red, Blue." },
            { q: "1, 1, 2, 2, 3, ?", options: ["3", "4", "5", "1"], answer: 0, explanation: "Each number repeats twice." },
            { q: "Which is biggest?", options: ["Mouse", "Elephant", "Dog", "Cat"], answer: 1, explanation: "Elephant is the biggest animal." },
            { q: "Day, Night, Day, Night, ?", options: ["Day", "Moon", "Star", "Sun"], answer: 0, explanation: "Pattern repeats Day, Night." },
            { q: "10, 20, 30, 40, ?", options: ["50", "60", "45", "100"], answer: 0, explanation: "Count by 10s." },
            { q: "O, O, X, O, O, ?", options: ["X", "O", "Y", "Z"], answer: 0, explanation: "Pattern is O, O, X." },
            { q: "Triangle, Square, Triangle, Square, ?", options: ["Triangle", "Circle", "Cube", "Star"], answer: 0, explanation: "Pattern repeats." }
        ];
        easyPatterns.forEach((p, i) => questions.push({ ...p, id: `log_easy_${i}` }));
        
        // Generate simple addition sequences
        for(let i=0; i<90; i++) {
            const start = Math.floor(Math.random() * 5) + 1;
            const step = Math.floor(Math.random() * 3) + 1;
            const seq = [start, start+step, start+step*2, start+step*3];
            const ans = start+step*4;
            questions.push({
                id: `log_easy_gen_${i}`,
                q: `What comes next: ${seq.join(', ')}, ?`,
                options: [ans, ans+1, ans+2, ans-1].sort(()=>Math.random()-0.5).map(String),
                answer: -1, // Will fix answer index after shuffle
                explanation: `Add ${step} each time.`
            });
            // Fix answer index
            const q = questions[questions.length-1];
            q.answer = q.options.indexOf(String(ans));
        }

    } else if (difficulty === 'medium') {
        // Age 10-16: Medium patterns
        const mediumPatterns = [
            { q: "3, 6, 9, 12, ?", options: ["15", "14", "16", "18"], answer: 0, explanation: "Multiples of 3." },
            { q: "1, 4, 7, 10, ?", options: ["13", "12", "14", "11"], answer: 0, explanation: "Add 3 each time." },
            { q: "100, 90, 80, 70, ?", options: ["60", "50", "65", "55"], answer: 0, explanation: "Subtract 10." },
            { q: "2, 4, 8, 16, ?", options: ["32", "24", "20", "30"], answer: 0, explanation: "Double the number." },
            { q: "A, C, E, G, ?", options: ["I", "H", "J", "K"], answer: 0, explanation: "Skip one letter." },
            { q: "1, 2, 4, 7, 11, ?", options: ["16", "15", "18", "20"], answer: 0, explanation: "Add 1, then 2, then 3, then 4, then 5." },
            { q: "Z, Y, X, W, ?", options: ["V", "U", "T", "S"], answer: 0, explanation: "Backwards alphabet." },
            { q: "If A=1, B=2, C=3, what is D?", options: ["4", "5", "3", "6"], answer: 0, explanation: "Letter position." },
            { q: "Which number is odd?", options: ["4", "12", "7", "18"], answer: 2, explanation: "7 is not divisible by 2." },
            { q: "Spring, Summer, Autumn, ?", options: ["Winter", "Cold", "Snow", "January"], answer: 0, explanation: "Seasons order." },
            { q: "2, 5, 10, 17, ?", options: ["26", "24", "25", "30"], answer: 0, explanation: "n^2 + 1 (1, 4, 9, 16... + 1)." },
            { q: "A, Z, B, Y, C, ?", options: ["X", "W", "D", "V"], answer: 0, explanation: "First, Last, Second, Second-to-last..." },
            { q: "12, 11, 13, 12, 14, 13, ?", options: ["15", "16", "14", "12"], answer: 0, explanation: "-1, +2, -1, +2 pattern." },
            { q: "Which does not belong?", options: ["Car", "Bus", "Train", "Apple"], answer: 3, explanation: "Apple is a fruit, others are vehicles." },
            { q: "Cat, Dog, Hamster, ?", options: ["Goldfish", "Table", "Rock", "Cloud"], answer: 0, explanation: "Pets." }
        ];
        mediumPatterns.forEach((p, i) => questions.push({ ...p, id: `log_med_${i}` }));

        // Generate patterns
        for (let i = 0; i < 90; i++) {
            const start = Math.floor(Math.random() * 20) + 5;
            const step = Math.floor(Math.random() * 5) + 2;
            const seq = [start, start + step, start + 2 * step, start + 3 * step];
            const answer = start + 4 * step;
            const opts = [answer, answer + step, answer - step, answer + 2 * step].map(String);
            const shuffledOpts = [...new Set(opts)].sort(() => Math.random() - 0.5);
            questions.push({
                id: `log_med_gen_${i}`, q: `What comes next: ${seq.join(', ')}, ?`,
                options: shuffledOpts.slice(0, 4), answer: shuffledOpts.indexOf(answer.toString()),
                explanation: `Add ${step} each time.`
            });
        }

    } else {
        // Age 17+: Hard & Tricky
        const hardPatterns = [
            { q: "2, 4, 8, 16, ?", options: ["32", "24", "28", "20"], answer: 0, explanation: "Powers of 2: 2^n" },
            { q: "1, 1, 2, 3, 5, 8, ?", options: ["13", "11", "12", "14"], answer: 0, explanation: "Fibonacci: Sum of previous two." },
            { q: "1, 4, 9, 16, 25, ?", options: ["36", "30", "35", "49"], answer: 0, explanation: "Squares: 1^2, 2^2, 3^2..." },
            { q: "2, 3, 5, 7, 11, ?", options: ["13", "15", "17", "12"], answer: 0, explanation: "Prime numbers." },
            { q: "If all Bloops are Razzles and all Razzles are Lazzles, are all Bloops Lazzles?", options: ["Yes", "No", "Maybe", "Impossible"], answer: 0, explanation: "Syllogism: A⊂B, B⊂C => A⊂C", tricky: true },
            { q: "Complete: 100, 95, 90, 85, ?", options: ["80", "75", "70", "82"], answer: 0, explanation: "-5 each time." },
            { q: "2, 6, 18, 54, ?", options: ["162", "108", "148", "180"], answer: 0, explanation: "x3 each time." },
            { q: "Z, X, V, T, ?", options: ["R", "S", "Q", "P"], answer: 0, explanation: "Skip backwards.", tricky: true },
            { q: "7, 10, 8, 11, 9, 12, ?", options: ["10", "13", "11", "14"], answer: 0, explanation: "+3, -2, +3, -2..." },
            { q: "3, 12, 21, 30, 39, ?", options: ["48", "45", "50", "42"], answer: 0, explanation: "+9 each time." },
            { q: "Which is the odd one out?", options: ["Sphere", "Cube", "Pyramid", "Circle"], answer: 3, explanation: "Circle is 2D, others are 3D.", tricky: true },
            { q: "1/2, 1/4, 1/8, 1/16, ?", options: ["1/32", "1/20", "1/24", "1/18"], answer: 0, explanation: "Divide by 2." },
            { q: "Monday, Wednesday, Friday, ?", options: ["Sunday", "Saturday", "Tuesday", "Thursday"], answer: 0, explanation: "Skip one day." },
            { q: "Some flowers are red. All red things are hot. Therefore...", options: ["Some flowers are hot", "All flowers are hot", "No flowers are hot", "All hot things are flowers"], answer: 0, explanation: "Intersection of Flowers and Red is not empty; all Red is Hot; so Intersection of Flowers and Hot is not empty." },
            { q: "No A is B. All C are A. Therefore...", options: ["No C is B", "Some C are B", "All B are C", "All A are C"], answer: 0, explanation: "C is subset of A; A and B are disjoint; so C and B are disjoint." },
            { q: "Identify the next letter: J, F, M, A, M, J, ?", options: ["J", "A", "S", "O"], answer: 0, explanation: "Months of the year: January, February, March... July." },
            { q: "O, T, T, F, F, S, S, ?", options: ["E", "N", "T", "O"], answer: 0, explanation: "First letter of numbers: One, Two, Three... Eight." },
            { q: "31, 28, 31, 30, ?", options: ["31", "30", "29", "28"], answer: 0, explanation: "Days in months: Jan, Feb, Mar, Apr, May (31)." },
            { q: "4, 9, 25, 49, 121, ?", options: ["169", "144", "225", "196"], answer: 0, explanation: "Squares of prime numbers: 2^2, 3^2, 5^2, 7^2, 11^2, 13^2." },
            { q: "1, 2, 6, 24, 120, ?", options: ["720", "600", "500", "700"], answer: 0, explanation: "Factorials: 1!, 2!, 3!, 4!, 5!, 6!." },
            { q: "If HEAD is 8514, then TAIL is?", options: ["201912", "2019912", "191811", "211913"], answer: 0, explanation: "Letter positions: T(20) A(1) I(9) L(12)." },
            { q: "1, 8, 27, 64, 125, ?", options: ["216", "225", "200", "180"], answer: 0, explanation: "Cubes: 6^3 = 216." },
            { q: "A, E, I, O, ?", options: ["U", "Y", "W", "V"], answer: 0, explanation: "Vowels." },
            { q: "Which number is the odd one out? 3, 5, 7, 9, 11", options: ["9", "3", "7", "11"], answer: 0, explanation: "9 is not a prime number." },
            { q: "B, E, H, K, ?", options: ["N", "M", "O", "L"], answer: 0, explanation: "Add 3 letters: B(2)+3=E(5)... K(11)+3=N(14)." },
            { q: "10, 18, 28, 40, 54, ?", options: ["70", "68", "64", "72"], answer: 0, explanation: "Differences are 8, 10, 12, 14, 16. 54+16=70." },
            { q: "Find the missing number: 4, 6, 9, 6, 14, 6, ?", options: ["19", "6", "21", "8"], answer: 0, explanation: "Alternating series: 4(+5)=9(+5)=14(+5)=19." },
            { q: "6, 13, 28, 59, ?", options: ["122", "118", "120", "124"], answer: 0, explanation: "x2 + 1 each time." },
            { q: "If FISH is written as EHRG, how is JUNGLE written?", options: ["ITMFKD", "KVOHMF", "ITNFKD", "HSLEJC"], answer: 0, explanation: "Each letter is shifted back by one (F->E, I->H...)." },
            { q: "Pointing to a man, a woman said 'His mother is the only daughter of my mother'. How is the woman related to the man?", options: ["Mother", "Sister", "Aunt", "Grandmother"], answer: 0, explanation: "The 'only daughter of my mother' is the woman herself. So she is his mother." },
            { q: "Which is the odd one out?", options: ["Brass", "Copper", "Iron", "Gold"], answer: 0, explanation: "Brass is an alloy; the others are pure elements." },
            { q: "How many times can you subtract 10 from 100?", options: ["1", "10", "100", "0"], answer: 0, explanation: "Once. After that, you are subtracting from 90." },
            { q: "What number comes next? 3, 3, 5, 4, 4, 3, 5, 5, 4, 3, ?", options: ["6", "3", "4", "5"], answer: 0, explanation: "Number of letters in One, Two, Three... Ten. Eleven has 6 letters." },
            { q: "If 5+3=28, 9+1=810, 8+6=214, 5+4=19, then 7+3=?", options: ["410", "310", "421", "104"], answer: 0, explanation: "First digit is difference (7-3=4), next digits are sum (7+3=10). Result 410." },
            { q: "Look at this series: V, VIII, XI, XIV, __, XX, ... What number should fill the blank?", options: ["XVII", "XV", "IX", "XVI"], answer: 0, explanation: "Roman numerals: 5, 8, 11, 14, 17 (+3 each time)." },
            { q: "Which letter is the odd one out? A, E, I, D, U", options: ["D", "I", "U", "E"], answer: 0, explanation: "D is a consonant; others are vowels." },
            { q: "Mary's father has 5 daughters: Nana, Nene, Nini, Nono. What is the name of the 5th daughter?", options: ["Mary", "Nunu", "Nina", "Nano"], answer: 0, explanation: "The question says 'Mary's father'..." },
            { q: "A man builds a house with all 4 sides facing south. A bear walks past. What color is the bear?", options: ["White", "Brown", "Black", "Grey"], answer: 0, explanation: "If all sides face south, you are at the North Pole. The bear is a polar bear." },
            { q: "If you pass the person in second place in a race, what place are you in?", options: ["Second", "First", "Third", "Last"], answer: 0, explanation: "You take their spot as second place." },
            { q: "Which word does not belong?", options: ["Door", "Racecar", "Level", "Civic"], answer: 0, explanation: "Door is not a palindrome; the others are." },
            { q: "How many months have 28 days?", options: ["12", "1", "2", "6"], answer: 0, explanation: "All months have at least 28 days." },
            { q: "What belongs to you, but others use it more than you do?", options: ["Your Name", "Your Money", "Your Car", "Your House"], answer: 0, explanation: "People call you by your name." },
            { q: "77, 49, 36, 18, ?", options: ["8", "9", "10", "12"], answer: 0, explanation: "Multiply digits: 7*7=49, 4*9=36, 3*6=18, 1*8=8." },
            { q: "1, 2, 2, 4, 8, 32, ?", options: ["256", "128", "64", "512"], answer: 0, explanation: "Multiply previous two numbers: 1*2=2, 2*2=4, 2*4=8, 4*8=32, 8*32=256." },
            { q: "Identify the next letter: J, F, M, A, M, J, J, A, ?", options: ["S", "O", "N", "D"], answer: 0, explanation: "Months: ...July, August, September." },
            { q: "Which number is the odd one out?", options: ["2", "9", "25", "49"], answer: 0, explanation: "2 is not a square number (3^2=9, 5^2=25, 7^2=49)." },
            { q: "If CAT = 24 and DOG = 26, then RAT = ?", options: ["39", "40", "38", "42"], answer: 0, explanation: "A=1, B=2... R(18)+A(1)+T(20) = 39." }
        ];
        
        // Shuffle options for hard patterns
        hardPatterns.forEach((p, i) => {
             const correctVal = p.options[p.answer];
             const shuffled = [...p.options].sort(() => Math.random() - 0.5);
             questions.push({
                 ...p, 
                 options: shuffled,
                 answer: shuffled.indexOf(correctVal),
                 id: `log_hard_${i}`
             });
        });

        // Generate complex patterns (Reduced pool to allow more static hard ones)
        for (let i = 0; i < 80; i++) {
            const start = (i * 7 + 3) % 30 + 1;
            const diff = (i * 3 + 2) % 12 + 2;
            const seq = [start, start + diff, start + 2 * diff, start + 3 * diff];
            const answer = start + 4 * diff;
            const opts = [answer, answer + diff, answer - diff, answer + 2 * diff].map(String);
            const shuffledOpts = [...new Set(opts)].sort(() => Math.random() - 0.5);
            questions.push({
                id: `log_hard_gen_${i}`, q: `What comes next: ${seq.join(', ')}, ?`,
                options: shuffledOpts.slice(0, 4), answer: shuffledOpts.indexOf(answer.toString()),
                explanation: `Add ${diff} each time.`
            });
        }
    }
    
    return questions;
}

function generateNumericalQuestions(age) {
    const difficulty = getDifficulty(age);
    const questions = [];

    // ==================== TRICKY MATH & RIDDLES ====================
    const TRICKY_MATH = {
        easy: [
            { q: "What number has no value?", options: ["0", "1", "10", "100"], answer: 0, explanation: "Zero represents nothing." },
            { q: "How many fingers do you have on 2 hands?", options: ["10", "5", "8", "12"], answer: 0, explanation: "5 fingers on each hand." },
            { q: "Which number is bigger: 10 or 01?", options: ["10", "01", "Equal", "None"], answer: 0, explanation: "10 is bigger than 1." },
            { q: "What comes after 9?", options: ["10", "8", "11", "0"], answer: 0, explanation: "Counting order." },
            { q: "If you have 2 apples and get 2 more, how many?", options: ["4", "2", "3", "5"], answer: 0, explanation: "2 + 2 = 4." },
            { q: "What is half of 4?", options: ["2", "1", "3", "4"], answer: 0, explanation: "4 divided by 2 is 2." },
            { q: "How many legs does a dog have?", options: ["4", "2", "6", "8"], answer: 0, explanation: "Dogs have 4 legs." },
            { q: "Which is the smallest number?", options: ["1", "5", "10", "100"], answer: 0, explanation: "1 is the smallest." },
            { q: "How many sides does a triangle have?", options: ["3", "4", "2", "5"], answer: 0, explanation: "Triangles have 3 sides." },
            { q: "If you eat 1 of 3 cookies, how many are left?", options: ["2", "1", "3", "0"], answer: 0, explanation: "3 - 1 = 2." },
            { q: "What goes up when rain comes down?", options: ["Umbrella", "Sun", "Moon", "Stars"], answer: 0, explanation: "An umbrella goes up." },
            { q: "What has keys but can't open locks?", options: ["Piano", "Map", "Book", "Car"], answer: 0, explanation: "A piano has keys." },
            { q: "What has to be broken before you can use it?", options: ["Egg", "Glass", "Plate", "Stick"], answer: 0, explanation: "You break an egg to cook it." },
            { q: "What is full of holes but still holds water?", options: ["Sponge", "Bucket", "Cup", "Bowl"], answer: 0, explanation: "A sponge." },
            { q: "What has a neck but no head?", options: ["Bottle", "Person", "Giraffe", "Snake"], answer: 0, explanation: "A bottle." }
        ],
        medium: [
            { q: "Which is heavier: a kg of cotton or a kg of iron?", options: ["Same", "Iron", "Cotton", "Neither"], answer: 0, explanation: "Both are exactly one kilogram." },
            { q: "I am an odd number. Take away a letter and I become even. What number am I?", options: ["Seven", "Nine", "One", "Three"], answer: 0, explanation: "Remove 's' from 'Seven' to get 'even'." },
            { q: "If there are 3 apples and you take 2, how many do you have?", options: ["2", "3", "1", "0"], answer: 0, explanation: "You took 2, so you have 2." },
            { q: "How many months have 28 days?", options: ["12", "1", "2", "6"], answer: 0, explanation: "All 12 months have at least 28 days." },
            { q: "What goes up but never comes down?", options: ["Age", "Rain", "Ball", "Bird"], answer: 0, explanation: "Your age always increases." },
            { q: "A farmer has 17 sheep and all but 9 die. How many are left?", options: ["9", "8", "17", "0"], answer: 0, explanation: "'All but 9 die' means 9 are left alive." },
            { q: "Divide 30 by half and add 10.", options: ["70", "25", "40", "50"], answer: 0, explanation: "30 / 0.5 = 60. 60 + 10 = 70." },
            { q: "What has a face and two hands but no arms or legs?", options: ["Clock", "Robot", "Person", "Monkey"], answer: 0, explanation: "A clock." },
            { q: "Mary's father has 5 daughters: Nana, Nene, Nini, Nono. What is the name of the 5th daughter?", options: ["Mary", "Nunu", "Nina", "Nana"], answer: 0, explanation: "It's Mary's father." },
            { q: "What occurs once in a minute, twice in a moment, but never in a thousand years?", options: ["The letter M", "Time", "Seconds", "Life"], answer: 0, explanation: "The letter 'M'." },
            { q: "What has many teeth but cannot bite?", options: ["Comb", "Dog", "Shark", "Zipper"], answer: 0, explanation: "A comb." },
            { q: "What gets wet while drying?", options: ["Towel", "Water", "Sun", "Air"], answer: 0, explanation: "A towel absorbs water." },
            { q: "I’m tall when I’m young, and I’m short when I’m old. What am I?", options: ["Candle", "Tree", "Person", "Giraffe"], answer: 0, explanation: "A candle melts down." },
            { q: "What belongs to you, but other people use it more than you?", options: ["Your name", "Your money", "Your car", "Your house"], answer: 0, explanation: "People call you by your name." },
            { q: "What can run but never walks, has a mouth but never talks?", options: ["River", "Car", "Clock", "Wind"], answer: 0, explanation: "A river." }
        ],
        hard: [
            { q: "If 1=3, 2=3, 3=5, 4=4, 5=4, then 6=?", options: ["3", "4", "5", "6"], answer: 0, explanation: "Six has 3 letters." },
            { q: "What is 10% of 20% of 500?", options: ["10", "5", "20", "50"], answer: 0, explanation: "20% of 500 = 100. 10% of 100 = 10." },
            { q: "A bat and a ball cost $1.10. The bat costs $1.00 more than the ball. How much is the ball?", options: ["$0.05", "$0.10", "$0.01", "$0.15"], answer: 0, explanation: "2x + 1 = 1.10 -> 2x = 0.10 -> x = 0.05." },
            { q: "Multiply all numbers on a telephone keypad.", options: ["0", "362880", "987654", "100"], answer: 0, explanation: "Includes 0." },
            { q: "How can you take 2 from 5 and leave 4?", options: ["F-I-V-E", "Math error", "Impossible", "Negative"], answer: 0, explanation: "Remove F and E from FIVE leaves IV (4)." },
            { q: "Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?", options: ["(1/8)", "(1/3)", "(2/8)", "(1/16)"], answer: 0, explanation: "Divide by 2 each time." },
            { q: "If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?", options: ["5 minutes", "100 minutes", "1 minute", "20 minutes"], answer: 0, explanation: "Each machine takes 5 minutes per widget." },
            { q: "What is the next number: 1, 11, 21, 1211, 111221, ...?", options: ["312211", "122111", "112213", "1112221"], answer: 0, explanation: "Look-and-say sequence." },
            { q: "The day before yesterday was three days after Saturday. What day is it today?", options: ["Thursday", "Friday", "Wednesday", "Tuesday"], answer: 0, explanation: "Sat + 3 = Tue. Yesterday = Wed. Today = Thu." },
            { q: "Which weighs more, a pound of feathers or a pound of lead?", options: ["Same", "Lead", "Feathers", "Neither"], answer: 0, explanation: "Both are exactly one pound." },
            { q: "Using only addition, how do you add eight 8s and get the number 1000?", options: ["888+88+8+8+8", "88+88+88+88+8", "888+8+8+8+8+8", "888+88+88"], answer: 0, explanation: "888 + 88 + 8 + 8 + 8 = 1000." },
            { q: "I am a three-digit number. My second digit is four times bigger than the third digit. My first digit is three less than my second digit. Who am I?", options: ["141", "140", "282", "144"], answer: 0, explanation: "141: 2nd(4) = 4*3rd(1). 1st(1) = 2nd(4)-3." },
            { q: "The more of this there is, the less you see. What is it?", options: ["Darkness", "Fog", "Light", "Rain"], answer: 0, explanation: "Darkness." },
            { q: "What has cities, but no houses; mountains, but no trees; and water, but no fish?", options: ["Map", "Globe", "Picture", "Dream"], answer: 0, explanation: "A map." },
            { q: "What word is spelled incorrectly in every dictionary?", options: ["Incorrectly", "Wrongly", "Mistake", "Error"], answer: 0, explanation: "The word 'incorrectly'." },
            { q: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", options: ["Echo", "Cloud", "Ghost", "Thunder"], answer: 0, explanation: "An echo." },
            { q: "Two fathers and two sons go fishing. Each of them catches one fish. So why do they bring home only three fish?", options: ["Grandfather, Father, Son", "One fish jumped back", "One lost a fish", "Math error"], answer: 0, explanation: "The group is Grandfather, Father, and Son." },
            { q: "If you multiply this number by any other number, the answer will always be the same. What number is it?", options: ["0", "1", "Infinity", "10"], answer: 0, explanation: "0 multiplied by anything is 0." },
            { q: "What has 13 hearts but no other organs?", options: ["A deck of cards", "An octopus", "A worm", "A love letter"], answer: 0, explanation: "A standard deck of playing cards." },
            { q: "What 3 positive numbers give the same result when multiplied and added together?", options: ["1, 2, 3", "0, 1, 2", "2, 4, 6", "1, 1, 1"], answer: 0, explanation: "1+2+3=6 and 1*2*3=6." },
            { q: "A train travels 60 miles in 1 hour. How far does it go in 30 minutes?", options: ["30 miles", "20 miles", "40 miles", "15 miles"], answer: 0, explanation: "60 miles/hour * 0.5 hours = 30 miles." },
            { q: "If 5 cats catch 5 mice in 5 minutes, how long does it take 100 cats to catch 100 mice?", options: ["5 minutes", "100 minutes", "1 minute", "50 minutes"], answer: 0, explanation: "Each cat takes 5 minutes to catch one mouse." },
            { q: "What is the square root of 144?", options: ["12", "11", "13", "14"], answer: 0, explanation: "12 * 12 = 144." },
            { q: "What is 15% of 200?", options: ["30", "20", "40", "15"], answer: 0, explanation: "200 * 0.15 = 30." },
            { q: "A father is 4 times as old as his son. In 20 years, he will be twice as old. How old is the father now?", options: ["40", "30", "50", "36"], answer: 0, explanation: "F=4S. F+20=2(S+20). 4S+20=2S+40 -> 2S=20 -> S=10. F=40." },
            { q: "The sum of two numbers is 20 and their difference is 4. What are the numbers?", options: ["12 and 8", "10 and 10", "14 and 6", "11 and 9"], answer: 0, explanation: "x+y=20, x-y=4 -> 2x=24 -> x=12, y=8." }
        ]
    };
    
    if (difficulty === 'simple') {
        // Age 5-9: Counting and basic addition
        for (let i = 0; i < 20; i++) {
            const a = Math.floor(Math.random() * 5) + 1;
            const b = Math.floor(Math.random() * 5) + 1;
            const ans = a + b;
            const opts = [ans, ans + 1, ans - 1, ans + 2].map(String);
            const shuffledOpts = [...new Set(opts)].sort(() => Math.random() - 0.5);
            questions.push({ id: `num_simple_${i}`, q: `Count: ${a} + ${b} = ?`, options: shuffledOpts.slice(0, 4), answer: shuffledOpts.indexOf(ans.toString()), explanation: `${a} + ${b} = ${ans}` });
        }
        if (TRICKY_MATH.simple) TRICKY_MATH.simple.forEach((q, i) => questions.push({...q, id: `num_trick_simple_${i}`}));

    } else if (difficulty === 'easy') {
        // Age 5-9: Simple addition and subtraction (Reduced to 30)
        for (let i = 0; i < 30; i++) {
            const isAdd = Math.random() > 0.5;
            let a, b, ans, op;
            if (isAdd) {
                a = Math.floor(Math.random() * 10) + 1;
                b = Math.floor(Math.random() * 10) + 1;
                ans = a + b;
                op = '+';
            } else {
                a = Math.floor(Math.random() * 10) + 5;
                b = Math.floor(Math.random() * 5) + 1;
                ans = a - b;
                op = '-';
            }
            const opts = [ans, ans + 1, ans - 1, ans + 2].map(String);
            const shuffledOpts = [...new Set(opts)].sort(() => Math.random() - 0.5);
            questions.push({ id: `num_easy_${i}`, q: `Calculate: ${a} ${op} ${b} = ?`, options: shuffledOpts.slice(0, 4), answer: shuffledOpts.indexOf(ans.toString()), explanation: `${a} ${op} ${b} = ${ans}` });
        }
        TRICKY_MATH.easy.forEach((q, i) => questions.push({...q, id: `num_trick_easy_${i}`}));

    } else if (difficulty === 'medium') {
        // Age 10-16: Multiplication and larger addition (Reduced to 30)
        for (let i = 0; i < 30; i++) {
            const type = Math.floor(Math.random() * 3); // 0: add, 1: sub, 2: mul
            let a, b, ans, op;
            if (type === 0) {
                a = Math.floor(Math.random() * 50) + 10;
                b = Math.floor(Math.random() * 50) + 10;
                ans = a + b;
                op = '+';
            } else if (type === 1) {
                a = Math.floor(Math.random() * 50) + 30;
                b = Math.floor(Math.random() * 20) + 10;
                ans = a - b;
                op = '-';
            } else {
                a = Math.floor(Math.random() * 10) + 2;
                b = Math.floor(Math.random() * 10) + 2;
                ans = a * b;
                op = '×';
            }
            const opts = [ans, ans + 1, ans - 1, ans + 10].map(String);
            const shuffledOpts = [...new Set(opts)].sort(() => Math.random() - 0.5);
            questions.push({ id: `num_med_${i}`, q: `Calculate: ${a} ${op} ${b} = ?`, options: shuffledOpts.slice(0, 4), answer: shuffledOpts.indexOf(ans.toString()), explanation: `${a} ${op} ${b} = ${ans}` });
        }
        TRICKY_MATH.medium.forEach((q, i) => questions.push({...q, id: `num_trick_med_${i}`}));

    } else {
        // Age 17+: Harder arithmetic (Reduced to 20 Add + 20 Mul)
        for (let i = 0; i < 20; i++) {
            const a = (i * 17 + 123) % 400 + 150;
            const b = (i * 13 + 89) % 300 + 120;
            const answer = a + b;
            const opts = [answer, answer + 10, answer - 10, answer + 100].map(String);
            const shuffledOpts = [...new Set(opts)].sort(() => Math.random() - 0.5);
            questions.push({ id: `num_add_${i}`, q: `Calculate: ${a} + ${b} = ?`, options: shuffledOpts.slice(0, 4), answer: shuffledOpts.indexOf(answer.toString()), explanation: `${a} + ${b} = ${answer}` });
        }
        for (let i = 0; i < 20; i++) {
            const a = (i * 3 + 12) % 20 + 12;
            const b = (i * 2 + 11) % 15 + 11;
            const answer = a * b;
            const opts = [answer, answer + a, answer - b, answer + 10].map(String);
            const shuffledOpts = [...new Set(opts)].sort(() => Math.random() - 0.5);
            questions.push({ id: `num_mul_${i}`, q: `Calculate: ${a} × ${b} = ?`, options: shuffledOpts.slice(0, 4), answer: shuffledOpts.indexOf(answer.toString()), explanation: `${a} × ${b} = ${answer}` });
        }
        TRICKY_MATH.hard.forEach((q, i) => questions.push({...q, id: `num_trick_hard_${i}`}));
    }
    return questions;
}

function generateVerbalQuestions(age) {
    const difficulty = getDifficulty(age);
    const questions = [];
    
    // ==================== VERBAL DATA BANKS ====================
    const ANALOGIES = {
        simple: [
            ['Cat', 'Meow', 'Dog', 'Bark'], ['Bird', 'Fly', 'Fish', 'Swim'], ['Sun', 'Day', 'Moon', 'Night'],
            ['Happy', 'Smile', 'Sad', 'Frown'], ['Shoe', 'Foot', 'Hat', 'Head'], ['Cold', 'Ice', 'Hot', 'Fire']
        ],
        easy: [
            ['Dog', 'Puppy', 'Cat', 'Kitten'], ['Cow', 'Calf', 'Sheep', 'Lamb'], ['Duck', 'Duckling', 'Hen', 'Chick'],
            ['Day', 'Night', 'Sun', 'Moon'], ['Up', 'Down', 'Left', 'Right'], ['Hot', 'Cold', 'Summer', 'Winter'],
            ['Car', 'Road', 'Boat', 'Water'], ['Train', 'Track', 'Plane', 'Sky'], ['Fish', 'Swim', 'Bird', 'Fly'],
            ['Eye', 'See', 'Ear', 'Hear'], ['Nose', 'Smell', 'Tongue', 'Taste'], ['Hand', 'Touch', 'Leg', 'Walk'],
            ['Apple', 'Fruit', 'Carrot', 'Vegetable'], ['Banana', 'Yellow', 'Strawberry', 'Red'], ['Milk', 'Drink', 'Bread', 'Eat'],
            ['Doctor', 'Hospital', 'Teacher', 'School'], ['Firefighter', 'Fire', 'Police', 'Crime'], ['Farmer', 'Farm', 'Chef', 'Kitchen'],
            ['Pen', 'Write', 'Knife', 'Cut'], ['Broom', 'Sweep', 'Shovel', 'Dig'], ['Book', 'Read', 'Game', 'Play'],
            ['Happy', 'Smile', 'Sad', 'Cry'], ['Hungry', 'Eat', 'Thirsty', 'Drink'], ['Sleep', 'Bed', 'Sit', 'Chair'],
            ['Glove', 'Hand', 'Hat', 'Head'], ['Bird', 'Nest', 'Bee', 'Hive'], ['Shoe', 'Foot', 'Ring', 'Finger'],
            ['Brush', 'Hair', 'Paste', 'Teeth'], ['Key', 'Lock', 'Switch', 'Light']
        ],
        medium: [
            ['Finger', 'Hand', 'Toe', 'Foot'], ['Leaf', 'Tree', 'Petal', 'Flower'], ['Page', 'Book', 'Screen', 'Computer'],
            ['Second', 'Minute', 'Minute', 'Hour'], ['Day', 'Week', 'Month', 'Year'], ['Inch', 'Foot', 'Centimeter', 'Meter'],
            ['Puppy', 'Dog', 'Kitten', 'Cat'], ['Cub', 'Bear', 'Fawn', 'Deer'], ['Joey', 'Kangaroo', 'Foal', 'Horse'],
            ['Doctor', 'Stethoscope', 'Painter', 'Brush'], ['Carpenter', 'Hammer', 'Writer', 'Pen'], ['Chef', 'Knife', 'Gardener', 'Shovel'],
            ['Bird', 'Flock', 'Fish', 'School'], ['Lion', 'Pride', 'Wolf', 'Pack'], ['Bee', 'Swarm', 'Ant', 'Colony'],
            ['Water', 'Liquid', 'Ice', 'Solid'], ['Steam', 'Gas', 'Rock', 'Solid'], ['Rain', 'Wet', 'Sun', 'Dry'],
            ['Circle', 'Round', 'Square', 'Boxy'], ['Triangle', 'Three', 'Square', 'Four'], ['Sphere', 'Ball', 'Cube', 'Block'],
            ['Create', 'Destroy', 'Build', 'Demolish'], ['Enter', 'Exit', 'Arrive', 'Depart'], ['Win', 'Lose', 'Succeed', 'Fail'],
            ['Author', 'Book', 'Artist', 'Painting'], ['Chapter', 'Book', 'Room', 'House'], ['Poverty', 'Wealth', 'Sickness', 'Health'],
            ['Brave', 'Cowardly', 'Strong', 'Weak'], ['Giant', 'Dwarf', 'Ocean', 'Puddle']
        ],
        hard: [
            ['Candid', 'Frank', 'Secretive', 'Reticent'], ['Benevolent', 'Kind', 'Malevolent', 'Cruel'], ['Ephemeral', 'Short', 'Eternal', 'Long'],
            ['Forest', 'Trees', 'Ocean', 'Water'], ['Desert', 'Sand', 'Glacier', 'Ice'], ['Mountain', 'Rock', 'Beach', 'Sand'],
            ['Monday', 'Tuesday', 'January', 'February'], ['First', 'Second', 'Primary', 'Secondary'], ['Alpha', 'Beta', 'Start', 'End'],
            ['Pen', 'Writer', 'Brush', 'Artist'], ['Scalpel', 'Surgeon', 'Gavel', 'Judge'], ['Telescope', 'Astronomer', 'Microscope', 'Biologist'],
            ['Pilot', 'Airplane', 'Captain', 'Ship'], ['Driver', 'Car', 'Jockey', 'Horse'], ['Astronaut', 'Rocket', 'Cyclist', 'Bicycle'],
            ['Novice', 'Expert', 'Beginner', 'Master'], ['Student', 'Teacher', 'Patient', 'Doctor'], ['Apprentice', 'Mentor', 'Follower', 'Leader'],
            ['Obscure', 'Clear', 'Vague', 'Precise'], ['Complex', 'Simple', 'Intricate', 'Basic'], ['Fragile', 'Strong', 'Delicate', 'Robust'],
            ['Expand', 'Contract', 'Grow', 'Shrink'], ['Ascend', 'Descend', 'Rise', 'Fall'], ['Inflate', 'Deflate', 'Fill', 'Empty'],
            ['Skein', 'Yarn', 'Ream', 'Paper'], ['Tailor', 'Suit', 'Cobbler', 'Shoe'], ['Conductor', 'Orchestra', 'Director', 'Movie'],
            ['Hackneyed', 'Original', 'Trite', 'Novel'], ['Nadir', 'Zenith', 'Bottom', 'Top'],
            ['Sound', 'Cacophony', 'Smell', 'Stench'], ['Soldier', 'Regiment', 'Star', 'Constellation'],
            ['Grain', 'Silo', 'Water', 'Reservoir'], ['Architect', 'Blueprint', 'Composer', 'Score'],
            ['Light', 'Dark', 'Day', 'Night'], ['Doctor', 'Patient', 'Lawyer', 'Client'],
            ['Ocean', 'Water', 'Forest', 'Trees'], ['Huge', 'Gigantic', 'Small', 'Tiny'],
            ['Ancient', 'Modern', 'Old', 'New'], ['Bravery', 'Cowardice', 'Courage', 'Fear'],
            ['Expand', 'Contract', 'Increase', 'Decrease'], ['Chaos', 'Order', 'War', 'Peace']
        ]
    };

    const SYNONYMS = {
        medium: [
            ['Happy', 'Joyful'], ['Sad', 'Unhappy'], ['Big', 'Large'], ['Small', 'Tiny'], ['Fast', 'Quick'],
            ['Slow', 'Sluggish'], ['Smart', 'Intelligent'], ['Dumb', 'Stupid'], ['Rich', 'Wealthy'], ['Poor', 'Needy'],
            ['Hard', 'Difficult'], ['Easy', 'Simple'], ['Start', 'Begin'], ['End', 'Finish'], ['Run', 'Sprint'],
            ['Walk', 'Stroll'], ['Look', 'See'], ['Listen', 'Hear'], ['Speak', 'Talk'], ['Yell', 'Shout'],
            ['Funny', 'Humorous'], ['Scared', 'Afraid'], ['Angry', 'Mad'], ['Calm', 'Peaceful'],
            ['Brave', 'Courageous'], ['Help', 'Assist'], ['Idea', 'Concept'], ['Job', 'Occupation']
        ],
        hard: [
            ['Benevolent', 'Kind'], ['Malevolent', 'Cruel'], ['Candid', 'Frank'], ['Deceptive', 'Misleading'], ['Obscure', 'Vague'],
            ['Lucid', 'Clear'], ['Ephemeral', 'Temporary'], ['Eternal', 'Everlasting'], ['Fragile', 'Delicate'], ['Robust', 'Strong'],
            ['Meticulous', 'Careful'], ['Negligent', 'Careless'], ['Altruistic', 'Selfless'], ['Selfish', 'Egotistical'], ['Placid', 'Calm'],
            ['Turbulent', 'Chaotic'], ['Taciturn', 'Silent'], ['Loquacious', 'Talkative'], ['Diligent', 'Hardworking'], ['Lazy', 'Indolent'],
            ['Ephemeral', 'Transient'], ['Loquacious', 'Garrulous'], ['Taciturn', 'Reticent'], ['Mellifluous', 'Sweet-sounding'],
            ['Esoteric', 'Obscure'], ['Pragmatic', 'Practical'], ['Superfluous', 'Unnecessary'], ['Venerable', 'Respected']
        ]
    };

    // Helper to generate analogy questions
    function addAnalogyQuestions(pool, count, prefix) {
        // Repeat the pool if needed to reach count
        for (let i = 0; i < count; i++) {
            const template = pool[i % pool.length];
            // Template: A is to B as C is to D
            // Question: A is to B as C is to ? (Answer: D)
            // Options: D + 3 distractors
            const [A, B, C, D] = template;
            
            // Generate distractors from other items in the same pool (B or D positions)
            const distractors = [];
            while (distractors.length < 3) {
                const randItem = pool[Math.floor(Math.random() * pool.length)];
                const wrong = Math.random() > 0.5 ? randItem[1] : randItem[3];
                if (wrong !== D && !distractors.includes(wrong)) {
                    distractors.push(wrong);
                }
            }
            
            const options = [D, ...distractors].sort(() => Math.random() - 0.5);
            questions.push({
                id: `verb_${prefix}_ana_${i}`,
                q: `${A} is to ${B} as ${C} is to ?`,
                options: options,
                answer: options.indexOf(D),
                explanation: `${A} relates to ${B} in the same way ${C} relates to ${D}.`
            });
        }
    }

    // Helper to generate synonym/antonym questions
    function addVocabQuestions(pool, count, prefix, type) {
        for (let i = 0; i < count; i++) {
            const pair = pool[i % pool.length];
            const [word, target] = pair;
            
            const distractors = [];
            while (distractors.length < 3) {
                const randPair = pool[Math.floor(Math.random() * pool.length)];
                const wrong = randPair[1];
                if (wrong !== target && !distractors.includes(wrong)) {
                    distractors.push(wrong);
                }
            }
            
            const options = [target, ...distractors].sort(() => Math.random() - 0.5);
            questions.push({
                id: `verb_${prefix}_voc_${i}`,
                q: `Which word is ${type === 'syn' ? 'similar to' : 'opposite to'} '${word}'?`,
                options: options,
                answer: options.indexOf(target),
                explanation: `${target} is a ${type === 'syn' ? 'synonym' : 'antonym'} of ${word}.`
            });
        }
    }

    if (difficulty === 'simple') {
        // Age 5-9: Simple analogies
        if (ANALOGIES.simple) addAnalogyQuestions(ANALOGIES.simple, 20, 'simple');
    } else if (difficulty === 'easy') {
        // Generate ~100 easy questions
        addAnalogyQuestions(ANALOGIES.easy, 100, 'easy');
    } else if (difficulty === 'medium') {
        // Generate ~100 medium questions (50 analogies + 50 synonyms)
        addAnalogyQuestions(ANALOGIES.medium, 50, 'med');
        addVocabQuestions(SYNONYMS.medium, 50, 'med', 'syn');
    } else {
        // Generate ~100 hard questions (50 analogies + 50 synonyms/antonyms)
        addAnalogyQuestions(ANALOGIES.hard, 50, 'hard');
        addVocabQuestions(SYNONYMS.hard, 50, 'hard', 'syn');
    }

    return questions;
}

function generateSpatialQuestions(age) {
    const difficulty = getDifficulty(age);
    const questions = [];

    // ==================== SPATIAL DATA ====================
    const SHAPES_2D = [
        { name: 'Triangle', sides: 3, corners: 3, angleSum: 180 },
        { name: 'Square', sides: 4, corners: 4, angleSum: 360 },
        { name: 'Pentagon', sides: 5, corners: 5, angleSum: 540 },
        { name: 'Hexagon', sides: 6, corners: 6, angleSum: 720 },
        { name: 'Heptagon', sides: 7, corners: 7, angleSum: 900 },
        { name: 'Octagon', sides: 8, corners: 8, angleSum: 1080 },
        { name: 'Nonagon', sides: 9, corners: 9, angleSum: 1260 },
        { name: 'Decagon', sides: 10, corners: 10, angleSum: 1440 }
    ];

    const SHAPES_3D = [
        { name: 'Cube', faces: 6, edges: 12, vertices: 8, faceShape: 'Square' },
        { name: 'Sphere', faces: 1, edges: 0, vertices: 0, faceShape: 'None' },
        { name: 'Cylinder', faces: 3, edges: 2, vertices: 0, faceShape: 'Circle' },
        { name: 'Cone', faces: 2, edges: 1, vertices: 1, faceShape: 'Circle' },
        { name: 'Tetrahedron', faces: 4, edges: 6, vertices: 4, faceShape: 'Triangle' },
        { name: 'Square Pyramid', faces: 5, edges: 8, vertices: 5, faceShape: 'Triangle' }
    ];

    function addPropertyQuestions(count, prefix) {
        for (let i = 0; i < count; i++) {
            const type = i % 4; // 0: 2D sides, 1: 2D corners, 2: 3D faces, 3: 3D edges
            
            if (type === 0 || type === 1) {
                const shape = SHAPES_2D[Math.floor(Math.random() * SHAPES_2D.length)];
                const prop = type === 0 ? 'sides' : 'corners';
                const ans = shape[prop];
                const opts = [ans, ans+1, ans-1, ans+2];
                const options = [...new Set(opts)].map(String).sort(() => Math.random() - 0.5);
                
                questions.push({
                    id: `spat_${prefix}_2d_${i}`,
                    q: `How many ${prop} does a ${shape.name} have?`,
                    options: options,
                    answer: options.indexOf(String(ans)),
                    explanation: `A ${shape.name} has ${ans} ${prop}.`
                });
            } else {
                const shape = SHAPES_3D[Math.floor(Math.random() * SHAPES_3D.length)];
                const prop = type === 2 ? 'faces' : 'edges';
                const ans = shape[prop];
                const opts = [ans, ans+1, ans+2, Math.max(0, ans-1)];
                const options = [...new Set(opts)].map(String).sort(() => Math.random() - 0.5);
                
                questions.push({
                    id: `spat_${prefix}_3d_${i}`,
                    q: `How many ${prop} does a ${shape.name} have?`,
                    options: options,
                    answer: options.indexOf(String(ans)),
                    explanation: `A ${shape.name} has ${ans} ${prop}.`
                });
            }
        }
    }

    if (difficulty === 'simple') {
        const simpleShapes = [
            { q: "Which shape is round?", options: ["Circle", "Square", "Triangle", "Star"], answer: 0, explanation: "Circle is round." },
            { q: "Which shape has 3 sides?", options: ["Triangle", "Square", "Circle", "Box"], answer: 0, explanation: "Triangle has 3 sides." },
            { q: "Which shape has 4 sides?", options: ["Square", "Circle", "Triangle", "Star"], answer: 0, explanation: "Square has 4 sides." },
            { q: "Which looks like a ball?", options: ["Sphere", "Cube", "Pyramid", "Cone"], answer: 0, explanation: "Sphere is round like a ball." },
            { q: "Which looks like a box?", options: ["Cube", "Sphere", "Cone", "Cylinder"], answer: 0, explanation: "Cube is shaped like a box." },
            { q: "Which looks like a party hat?", options: ["Cone", "Cube", "Sphere", "Cylinder"], answer: 0, explanation: "Cone looks like a party hat." }
        ];
        simpleShapes.forEach((q, i) => questions.push({...q, id: `spat_simple_${i}`}));

    } else if (difficulty === 'easy') {
        // Easy: Basic shape recognition and simple counting (Static + Generated)
        const staticEasy = [
            { q: "Which shape has 3 sides?", options: ["Square", "Triangle", "Circle", "Star"], answer: 1, explanation: "Triangle has 3 sides." },
            { q: "Which shape is round?", options: ["Square", "Triangle", "Circle", "Rectangle"], answer: 2, explanation: "Circle is round." },
            { q: "Which letter has a circle in it?", options: ["A", "L", "O", "X"], answer: 2, explanation: "O is a circle." },
            { q: "Which shape looks like a ball?", options: ["Cube", "Sphere", "Pyramid", "Cone"], answer: 1, explanation: "Sphere is a ball." }
        ];
        staticEasy.forEach((q, i) => questions.push({...q, id: `spat_easy_stat_${i}`}));
        
        // Generate rest up to 100
        addPropertyQuestions(96, 'easy');

    } else if (difficulty === 'medium') {
        // Medium: Properties of 2D/3D shapes
        addPropertyQuestions(100, 'med');

    } else {
        // Hard: Complex properties, angles, rotations
        const staticHard = [
             { q: "If you fold a square in half twice, what shape can you get?", options: ["Circle", "Smaller Square", "Pentagon", "Hexagon"], answer: 1, explanation: "Folding a square twice creates a smaller square." },
             { q: "If you rotate 'b' 180 degrees, what letter does it become?", options: ["d", "p", "q", "b"], answer: 2, explanation: "Rotating 'b' 180 degrees creates 'q'." },
             { q: "Which view matches the top view of a pyramid?", options: ["Square with X", "Triangle", "Circle", "Rectangle"], answer: 0, explanation: "Looking down at a square pyramid shows the square base and edges meeting in center." },
             { q: "How many faces does a Dodecahedron have?", options: ["10", "12", "20", "8"], answer: 1, explanation: "Dodecahedron has 12 faces." },
             { q: "Which shape is the cross-section of a sphere?", options: ["Circle", "Square", "Triangle", "Oval"], answer: 0, explanation: "Cutting a sphere always gives a circle." },
             { q: "If you cut a cone parallel to its base, what shape do you get?", options: ["Triangle", "Circle", "Square", "Ellipse"], answer: 1, explanation: "The cross-section is a circle." },
             { q: "How many edges does a cube have?", options: ["12", "8", "6", "10"], answer: 0, explanation: "A cube has 12 edges." },
             { q: "Which 3D shape has no vertices?", options: ["Sphere", "Cone", "Cube", "Pyramid"], answer: 0, explanation: "A sphere is perfectly round with no corners." },
             { q: "How many faces does a Octahedron have?", options: ["8", "10", "6", "12"], answer: 0, explanation: "An Octahedron has 8 faces." },
             { q: "How many sides does a Nonagon have?", options: ["9", "10", "8", "7"], answer: 0, explanation: "A Nonagon has 9 sides." },
             { q: "Which letter has vertical symmetry?", options: ["A", "B", "C", "E"], answer: 0, explanation: "A can be divided vertically into two identical halves." },
             { q: "What is the opposite direction of North-East?", options: ["South-West", "North-West", "South-East", "North"], answer: 0, explanation: "Opposite on the compass." },
             { q: "How many degrees are in a full circle?", options: ["360", "180", "90", "270"], answer: 0, explanation: "A full rotation is 360 degrees." },
             { q: "Which shape has the most sides?", options: ["Octagon", "Hexagon", "Pentagon", "Square"], answer: 0, explanation: "Octagon(8) > Hexagon(6) > Pentagon(5) > Square(4)." },
             { q: "If you rotate a square 45 degrees, what shape does it resemble?", options: ["Diamond", "Triangle", "Circle", "Pentagon"], answer: 0, explanation: "A rotated square looks like a diamond (rhombus)." }
        ];
        staticHard.forEach((q, i) => questions.push({...q, id: `spat_hard_stat_${i}`}));

        // Generate geometry math questions
        for (let i = 0; i < 90; i++) {
            if (i % 2 === 0) {
                // Angle sums
                const shape = SHAPES_2D[Math.floor(Math.random() * SHAPES_2D.length)];
                if (shape.sides > 4) {
                    questions.push({
                        id: `spat_hard_ang_${i}`,
                        q: `What is the sum of interior angles in a ${shape.name}?`,
                        options: [...new Set([shape.angleSum, shape.angleSum-180, shape.angleSum+180, 360])].map(String).map(s=>s+"°").sort(() => Math.random() - 0.5),
                        answer: -1, // fixed below
                        explanation: `Formula: (n-2) × 180°. (${shape.sides}-2) × 180 = ${shape.angleSum}°`
                    });
                    const q = questions[questions.length-1];
                    q.answer = q.options.indexOf(shape.angleSum + "°");
                }
            } else {
                // Vertices/Edges relations (Euler's formula: V - E + F = 2)
                const shape = SHAPES_3D[Math.floor(Math.random() * SHAPES_3D.length)];
                if (shape.vertices > 0) {
                     questions.push({
                        id: `spat_hard_euler_${i}`,
                        q: `A ${shape.name} has ${shape.faces} faces and ${shape.vertices} vertices. How many edges?`,
                        options: [shape.edges, shape.edges+2, shape.edges-2, shape.faces+shape.vertices].map(String).sort(() => Math.random() - 0.5),
                        answer: -1,
                        explanation: `Euler's Formula: V - E + F = 2. ${shape.vertices} - E + ${shape.faces} = 2 => E = ${shape.edges}.`
                    });
                    const q = questions[questions.length-1];
                    q.answer = q.options.indexOf(String(shape.edges));
                }
            }
        }
        
        // Fill remaining with generic property questions if needed
        if (questions.length < 100) addPropertyQuestions(100 - questions.length, 'hard_fill');
    }
    return questions;
}

function generateAbstractQuestions(age) {
    const difficulty = getDifficulty(age);
    const questions = [];
    
    if (difficulty === 'easy') {
        const symbols = ['★', '●', '■'];
        for (let i = 0; i < 100; i++) {
            const s1 = symbols[i % 3];
            const v1 = i % 5 + 1;
            const ans = v1 + 1;
            questions.push({ 
                id: `abs_easy_${i}`, 
                q: `If ${s1} = ${v1}, what is ${s1} + 1?`, 
                options: [ans, ans+1, ans+2, ans-1].map(String), 
                answer: 0, 
                explanation: `${s1} is ${v1}, so ${v1} + 1 = ${ans}` 
            });
        }
    } else if (difficulty === 'medium') {
        const symbols = ['★', '◆', '●', '▲'];
        for (let i = 0; i < 100; i++) {
            const s1 = symbols[i % symbols.length];
            const s2 = symbols[(i + 1) % symbols.length];
            const v1 = (i * 2) % 5 + 2;
            const v2 = (i * 3) % 5 + 1;
            const answer = v1 + v2;
            const opts = [answer, answer + 1, answer - 1, answer + 2].map(String);
            const shuffledOpts = [...new Set(opts)].sort(() => Math.random() - 0.5);
            questions.push({ 
                id: `abs_med_${i}`, 
                q: `If ${s1} = ${v1} and ${s2} = ${v2}, what is ${s1} + ${s2}?`, 
                options: shuffledOpts.slice(0, 4), 
                answer: shuffledOpts.indexOf(answer.toString()), 
                explanation: `${s1} + ${s2} = ${v1} + ${v2} = ${answer}` 
            });
        }
    } else {
        const symbols = ['★', '◆', '●', '▲', '■'];
        for (let i = 0; i < 100; i++) {
            const s1 = symbols[i % symbols.length];
            const s2 = symbols[(i + 3) % symbols.length];
            const v1 = (i * 3 + 2) % 15 + 1;
            const v2 = (i * 2 + 5) % 15 + 1;
            const answer = v1 + v2;
            const opts = [answer, answer + 1, answer - 1, answer + 3].map(String);
            const shuffledOpts = [...new Set(opts)].sort(() => Math.random() - 0.5);
            questions.push({ id: `abs_add_${i}`, q: `If ${s1} = ${v1} and ${s2} = ${v2}, what is ${s1} + ${s2}?`, options: shuffledOpts.slice(0, 4), answer: shuffledOpts.indexOf(answer.toString()), explanation: `${s1} + ${s2} = ${v1} + ${v2} = ${answer}` });
        }
        
        // Tricky abstract (Expanded)
        questions.push(
            { id: 'abs_trick_1', q: "If 🍎 + 🍎 = 10, and 🍎 + 🍌 = 14, what is 🍌?", options: ["4", "9", "5", "8"], answer: 1, explanation: "🍎 = 5. 5 + 🍌 = 14, so 🍌 = 9." },
            { id: 'abs_trick_2', q: "If A = 1, B = 2, ... Z = 26. What is sum of BAD?", options: ["7", "6", "8", "9"], answer: 0, explanation: "B(2) + A(1) + D(4) = 7" },
            { id: 'abs_trick_3', q: "Find the missing number: 2, 6, 12, 20, ?", options: ["30", "28", "32", "24"], answer: 0, explanation: "1*2, 2*3, 3*4, 4*5, so 5*6 = 30." },
            { id: 'abs_trick_4', q: "If 1+4=5, 2+5=12, 3+6=21, then 8+11=?", options: ["96", "40", "99", "52"], answer: 0, explanation: "Pattern is a + (a*b). 8 + (8*11) = 8 + 88 = 96." },
            { id: 'abs_trick_5', q: "Which number replaces the question mark? [3] [6] [9] -> [5] [10] [15] -> [7] [14] [?]", options: ["21", "20", "28", "18"], answer: 0, explanation: "Multiples of the first number: 7, 14, 21." },
            { id: 'abs_trick_6', q: "Which shape does not belong? [Square] [Triangle] [Hexagon] [Circle]", options: ["Circle", "Triangle", "Hexagon", "Square"], answer: 0, explanation: "Circle has no corners." },
            { id: 'abs_trick_7', q: "Which number completes the pattern? 1, 8, 27, 64, ?", options: ["125", "100", "81", "121"], answer: 0, explanation: "Cubes: 1^3, 2^3, 3^3, 4^3, 5^3 = 125." },
            { id: 'abs_trick_8', q: "If [Triangle] = 3, [Square] = 4, [Pentagon] = 5, what is [Hexagon] + [Triangle]?", options: ["9", "8", "10", "12"], answer: 0, explanation: "Hexagon(6) + Triangle(3) = 9." },
            { id: 'abs_trick_9', q: "Which symbol is next? ▲, ►, ▼, ◄, ?", options: ["▲", "►", "▼", "●"], answer: 0, explanation: "Clockwise rotation." },
            { id: 'abs_trick_10', q: "If A=26, B=25, C=24... what is Z?", options: ["1", "0", "2", "26"], answer: 0, explanation: "Reverse alphabet." },
            { id: 'abs_trick_11', q: "If 1+4=10, 2+8=20, 4+16=40, then 8+32=?", options: ["80", "60", "100", "70"], answer: 0, explanation: "(A + B) * 2." },
            { id: 'abs_trick_12', q: "If A=1, C=3, E=5, what is G?", options: ["7", "6", "8", "9"], answer: 0, explanation: "G is the 7th letter." },
            { id: 'abs_trick_13', q: "If 8888=8, 9999=4, 6666=4, 1111=0, what is 0000?", options: ["4", "0", "1", "8"], answer: 0, explanation: "Counting the circles in the digits." },
            { id: 'abs_trick_14', q: "Which letter is the odd one out? A, E, I, K, U", options: ["K", "A", "E", "U"], answer: 0, explanation: "K is a consonant, others are vowels." },
            { id: 'abs_trick_15', q: "If Square=4, Triangle=3, what is Square + Triangle?", options: ["7", "12", "1", "6"], answer: 0, explanation: "4 + 3 = 7." },
            { id: 'abs_trick_16', q: "Which shape comes next? Circle, Square, Hexagon, ?", options: ["Octagon", "Pentagon", "Heptagon", "Nonagon"], answer: 0, explanation: "Sides: 1 (curve) or 0 vertices -> 4 -> 6 -> 8 (Octagon) increasing by 2." },
            { id: 'abs_trick_17', q: "Odd one out: North, South, East, Up", options: ["Up", "North", "East", "South"], answer: 0, explanation: "Up is a vertical direction, others are compass directions." },
            { id: 'abs_trick_18', q: "111, 222, 333, ?", options: ["444", "555", "333", "222"], answer: 0, explanation: "Repeating digits." },
            { id: 'abs_trick_19', q: "Which symbol completes the pattern? @, #, $, ?", options: ["%", "&", "*", "!"], answer: 0, explanation: "Shift+2, Shift+3, Shift+4, Shift+5 on keyboard? Or just sequence @ # $ %." },
            { id: 'abs_trick_20', q: "If A=26, B=25, C=24, what is D?", options: ["23", "4", "22", "27"], answer: 0, explanation: "Reverse alphabet numbering." }
        );
    }
    return questions;
}

function initializeQuestionBank(age) {
    const userAge = age || (currentUser ? currentUser.age : 25);
    questionBank = {
        logical: generateLogicalQuestions(userAge),
        numerical: generateNumericalQuestions(userAge),
        verbal: generateVerbalQuestions(userAge),
        spatial: generateSpatialQuestions(userAge),
        abstract: generateAbstractQuestions(userAge)
    };
    console.log(`Question bank initialized for age ${userAge}`);
}

// ==================== HELPER FUNCTIONS ====================
function createEmptyProgress() {
    return { 
        iqScores: [], 
        categories: { logical: 0, numerical: 0, verbal: 0, spatial: 0, abstract: 0 }, 
        categoryAttempts: { logical: 0, numerical: 0, verbal: 0, spatial: 0, abstract: 0 }, 
        memoryScores: {}, 
        activities: [], 
        testsCompleted: 0, 
        practiceSessions: 0, 
        memoryGames: 0,
        usedQuestionIds: [] // Track used questions across sessions
    };
}

function generateQuestionId(question) {
    if (!question || !question.q) return 'unknown_' + Date.now();
    return btoa(encodeURIComponent(question.q.substring(0, 50))).replace(/[^a-zA-Z0-9]/g, '');
}

// ==================== AUTH FUNCTIONS ====================
function showAuthModal() { 
    document.getElementById('authModal').classList.remove('hidden'); 
    // Reset to login mode
    isLoginMode = true;
    updateAuthFormDisplay();
}
function hideAuthModal() { document.getElementById('authModal').classList.add('hidden'); }

function showGuestModal() {
    hideAuthModal();
    document.getElementById('guestModal').classList.remove('hidden');
    document.getElementById('guestAge').value = '';
    const guestName = document.getElementById('guestName');
    if (guestName) guestName.value = '';
    if (guestName) guestName.focus();
    else document.getElementById('guestAge').focus();
}
function hideGuestModal() { document.getElementById('guestModal').classList.add('hidden'); }

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    updateAuthFormDisplay();
}

function updateAuthFormDisplay() {
    const nameField = document.getElementById('nameField');
    const ageField = document.getElementById('ageField');
    
    document.getElementById('authTitle').textContent = isLoginMode ? 'Welcome Back' : 'Create Account';
    document.getElementById('authSubtitle').textContent = isLoginMode ? 'Sign in to continue' : 'Join us today';
    document.getElementById('authBtnText').textContent = isLoginMode ? 'Sign In' : 'Create Account';
    document.getElementById('authSwitch').textContent = isLoginMode ? "Don't have an account? " : "Already have an account? ";
    document.getElementById('authSwitchBtn').textContent = isLoginMode ? 'Create Account' : 'Sign In';
    
    // Show/hide name and age fields based on mode
    if (isLoginMode) {
        nameField.classList.add('hidden');
        ageField.classList.add('hidden');
    } else {
        nameField.classList.remove('hidden');
        ageField.classList.remove('hidden');
    }
}

function handleAuth() {
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value;
    const name = document.getElementById('authName')?.value.trim() || '';
    const age = parseInt(document.getElementById('authAge')?.value) || 0;
    
    if (!email || !password) { alert('Please enter email and password'); return; }
    
    const users = readStoredJSON(CONFIG.STORAGE_KEYS.USERS, {});
    
    if (isLoginMode) {
        // Login - no age required
        if (users[email] && users[email].password === password) {
            currentUser = { ...users[email], email };
            writeStoredJSON(CONFIG.STORAGE_KEYS.USERS, users);
        } else { alert('Invalid email or password'); return; }
    } else {
        // Register - name and age required
        if (!name) { alert('Please enter your name'); return; }
        if (!age || age < 5 || age > 100) { alert('Please enter valid age (5-100)'); return; }
        if (users[email]) { alert('Email already registered'); return; }
        users[email] = { name, password, age, progress: createEmptyProgress() };
        writeStoredJSON(CONFIG.STORAGE_KEYS.USERS, users);
        currentUser = { email, name, age, progress: users[email].progress };
    }
    
    writeStoredJSON(CONFIG.STORAGE_KEYS.CURRENT_USER, currentUser);
    updateAuthUI(); hideAuthModal(); showSection('home');
}

function guestLogin() {
    const age = parseInt(document.getElementById('guestAge').value);
    const nameInput = document.getElementById('guestName') ? document.getElementById('guestName').value.trim() : '';
    const name = nameInput || 'Guest';

    if (!age || age < 5 || age > 100) { alert('Please enter valid age (5-100)'); return; }

    const nameLower = name.toLowerCase();
    if (nameLower.includes('@munna') || nameLower.includes('@harini') || nameLower.includes('@navadeep')) {
        let displayName = 'MUNNA';
        if (nameLower.includes('@harini')) {
            displayName = 'HARINI';
        } else if (nameLower.includes('@navadeep')) {
            displayName = 'NAVADEEP';
        }
        const nameEl = document.getElementById('special-welcome-name');
        if (nameEl) {
            nameEl.textContent = displayName;
        }
        document.getElementById('special-welcome').classList.remove('hidden');
    }

    currentUser = { email: 'Guest', name: name, age, progress: createEmptyProgress(), isGuest: true };
    writeStoredJSON(CONFIG.STORAGE_KEYS.CURRENT_USER, currentUser);
    updateAuthUI(); hideGuestModal(); showSection('home');
}

function logout() {
    currentUser = null;
    try {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.CURRENT_USER);
    } catch (error) {
        console.warn('Could not clear the saved session from browser storage.', error);
    }
    updateAuthUI(); showSection('home');
}

function updateAuthUI() {
    if (currentUser) {
        document.getElementById('authBtn').classList.add('hidden');
        document.getElementById('logoutBtn').classList.remove('hidden');
        const displayName = currentUser.name || (currentUser.email === 'Guest' ? 'Guest' : currentUser.email.split('@')[0]);
        const safeName = escapeHTML(displayName);
        document.getElementById('userDisplay').innerHTML = `<div class="flex items-center gap-2"><div class="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">${escapeHTML(displayName.charAt(0).toUpperCase())}</div><span class="hidden sm:inline">${safeName}</span></div>`;
    } else {
        document.getElementById('authBtn').classList.remove('hidden');
        document.getElementById('logoutBtn').classList.add('hidden');
    }
    updateHomeStats();
}

function saveProgress() {
    if (currentUser && !currentUser.isGuest) {
        const users = readStoredJSON(CONFIG.STORAGE_KEYS.USERS, {});
        if (users[currentUser.email]) {
            users[currentUser.email].progress = currentUser.progress;
            writeStoredJSON(CONFIG.STORAGE_KEYS.USERS, users);
        }
    }
    writeStoredJSON(CONFIG.STORAGE_KEYS.CURRENT_USER, currentUser);
}

// ==================== NAVIGATION ====================
const SECTIONS = ['home', 'iq-test', 'iq-practice', 'memory', 'about', 'dashboard'];

function showSection(section) {
    currentActiveSection = section;

    SECTIONS.forEach(s => {
        const el = document.getElementById(s + '-section');
        if (el) el.classList.add('hidden');
        const nav = document.getElementById('nav-' + s);
        if (nav) nav.classList.remove('active');
    });

    const target = document.getElementById(section + '-section');
    if (target) target.classList.remove('hidden');
    const activeNav = document.getElementById('nav-' + section);
    if (activeNav) activeNav.classList.add('active');
    
    if (section === 'dashboard') loadDashboard();
    if (section === 'home') updateHomeStats();
    if (section === 'about') loadAboutScientists();
    
    window.scrollTo(0, 0);
}

function updateHomeStats() {
    if (currentUser && currentUser.progress) {
        const latest = currentUser.progress.iqScores?.length > 0 ? currentUser.progress.iqScores[currentUser.progress.iqScores.length - 1].score : '--';
        document.getElementById('homeIQ').textContent = latest;
        document.getElementById('homeTests').textContent = currentUser.progress.testsCompleted || 0;
        document.getElementById('homePractice').textContent = currentUser.progress.practiceSessions || 0;
        document.getElementById('homeStreak').textContent = calculateStreak();
    }
}

function calculateStreak() {
    if (!currentUser || !currentUser.progress.activities?.length) return 0;
    const dates = [...new Set(currentUser.progress.activities.map(a => new Date(a.date).toDateString()))];
    dates.sort((a, b) => new Date(b) - new Date(a));
    let streak = 0, checkDate = new Date();
    for (const date of dates) {
        if (date === checkDate.toDateString()) { streak++; checkDate.setDate(checkDate.getDate() - 1); }
        else break;
    }
    return streak;
}

// ==================== IQ TEST ====================
function getUniqueQuestions(category, count) {
    if (!questionBank || !questionBank[category]) return [];
    
    // Get list of IDs user has already seen (persistent + session)
    const persistentUsed = (currentUser && currentUser.progress && currentUser.progress.usedQuestionIds) ? new Set(currentUser.progress.usedQuestionIds) : new Set();
    
    // Filter available questions (exclude session-used and persistent-used)
    let available = questionBank[category].filter(q => {
        const qId = q.id || generateQuestionId(q);
        return !usedQuestionsInSession.has(qId) && !persistentUsed.has(qId);
    });
    
    // If not enough, try clearing session cache first (but keep persistent)
    if (available.length < count) {
        usedQuestionsInSession.clear();
        available = questionBank[category].filter(q => {
             const qId = q.id || generateQuestionId(q);
             return !persistentUsed.has(qId);
        });
    }
    
    // If still not enough (user has seen almost everything), recycle oldest or random
    if (available.length < count) {
        // Fallback: just return random ones from the full bank to ensure we have questions
        return [...questionBank[category]].sort(() => Math.random() - 0.5).slice(0, count);
    }
    
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);
    
    selected.forEach(q => {
        const qId = q.id || generateQuestionId(q);
        usedQuestionsInSession.add(qId);
        if (currentUser && currentUser.progress) {
            if (!currentUser.progress.usedQuestionIds) currentUser.progress.usedQuestionIds = [];
            currentUser.progress.usedQuestionIds.push(qId);
            // Limit history size to 500 to prevent bloat
            if (currentUser.progress.usedQuestionIds.length > 500) currentUser.progress.usedQuestionIds.shift();
        }
    });
    
    return selected;
}

function startIQTest() {
    if (!currentUser) { showAuthModal(); return; }
    document.getElementById('iq-test-intro').classList.add('hidden');
    document.getElementById('iq-test-active').classList.remove('hidden');
    document.getElementById('iq-test-result').classList.add('hidden');
    
    usedQuestionsInSession.clear();
    
    // Generate Easy Questions (Age 7 - Simple/Easy) and Hard Questions (User Age)
    const easyAge = 7;
    const hardAge = currentUser.age;

    const getBank = (age) => ({
        logical: generateLogicalQuestions(age),
        numerical: generateNumericalQuestions(age),
        verbal: generateVerbalQuestions(age),
        spatial: generateSpatialQuestions(age),
        abstract: generateAbstractQuestions(age)
    });

    const easyBank = getBank(easyAge);
    const hardBank = getBank(hardAge);

    const persistentUsed = (currentUser && currentUser.progress && currentUser.progress.usedQuestionIds) ? new Set(currentUser.progress.usedQuestionIds) : new Set();

    const pickQuestions = (sourceList, count) => {
        let candidates = sourceList.filter(q => !persistentUsed.has(q.id || generateQuestionId(q)));
        if (candidates.length < count) candidates = sourceList;
        return candidates.sort(() => Math.random() - 0.5).slice(0, count);
    };

    const finalEasy = [];
    const finalHard = [];

    CONFIG.CATEGORIES.forEach(cat => {
        // 10 easy questions total -> 2 per category
        pickQuestions(easyBank[cat], 2).forEach(q => finalEasy.push({...q, category: cat}));
        // 20 hard questions total -> 4 per category
        pickQuestions(hardBank[cat], 4).forEach(q => finalHard.push({...q, category: cat}));
    });

    // Shuffle segments internally
    finalEasy.sort(() => Math.random() - 0.5);
    finalHard.sort(() => Math.random() - 0.5);
    
    iqTestState = { questions: [...finalEasy, ...finalHard], currentIndex: 0, answers: [], startTime: Date.now(), timer: null };
    if (iqTestState.timer) clearInterval(iqTestState.timer);
    startIQTimer(); showIQQuestion();
}

function resetIQTest() {
    document.getElementById('iq-test-intro').classList.remove('hidden');
    document.getElementById('iq-test-result').classList.add('hidden');
    usedQuestionsInSession.clear();
    if (iqTestState.timer) { clearInterval(iqTestState.timer); iqTestState.timer = null; }
}

function startIQTimer() {
    let timeLeft = CONFIG.IQ_TEST.TIME_LIMIT;
    iqTestState.timer = setInterval(() => {
        timeLeft--;
        const mins = Math.floor(timeLeft / 60), secs = timeLeft % 60;
        const timerEl = document.getElementById('iqTimer');
        timerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        if (timeLeft <= 60) timerEl.classList.add('timer-warning');
        if (timeLeft <= 0) { clearInterval(iqTestState.timer); finishIQTest(); }
    }, 1000);
}

function showIQQuestion() {
    if (!iqTestState.questions || iqTestState.currentIndex >= iqTestState.questions.length) { finishIQTest(); return; }
    const q = iqTestState.questions[iqTestState.currentIndex];
    if (!q || !q.q || !q.options) { iqTestState.currentIndex++; showIQQuestion(); return; }
    
    document.getElementById('iqQuestionNum').textContent = iqTestState.currentIndex + 1;
    document.getElementById('iqProgress').style.width = ((iqTestState.currentIndex + 1) / 30 * 100) + '%';
    document.getElementById('iqQuestionType').textContent = q.category ? q.category.charAt(0).toUpperCase() + q.category.slice(1) : 'General';
    document.getElementById('iqQuestion').textContent = q.q;
    
    const optionsDiv = document.getElementById('iqOptions');
    optionsDiv.innerHTML = '';
    q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'iq-option w-full text-left p-4 rounded-xl bg-slate-800/50 hover:bg-slate-700 transition border-2 border-transparent hover:border-indigo-500 flex items-center gap-4';
        btn.innerHTML = `<span class="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center font-bold text-indigo-400">${String.fromCharCode(65 + i)}</span><span class="text-lg">${opt}</span>`;
        btn.onclick = () => answerIQQuestion(i);
        optionsDiv.appendChild(btn);
    });
}

function answerIQQuestion(answerIndex) {
    const q = iqTestState.questions[iqTestState.currentIndex];
    iqTestState.answers.push({ question: iqTestState.currentIndex, answer: answerIndex, correct: answerIndex === q.answer, category: q.category });
    iqTestState.currentIndex++;
    if (iqTestState.currentIndex >= CONFIG.IQ_TEST.TOTAL_QUESTIONS) { clearInterval(iqTestState.timer); finishIQTest(); }
    else showIQQuestion();
}

function finishIQTest() {
    document.getElementById('iq-test-active').classList.add('hidden');
    document.getElementById('iq-test-result').classList.remove('hidden');
    
    const timeTaken = Math.floor((Date.now() - iqTestState.startTime) / 1000);
    const correctCount = iqTestState.answers.filter(a => a.correct).length;
    const wrongCount = CONFIG.IQ_TEST.TOTAL_QUESTIONS - correctCount;
    
    const baseScore = (correctCount / CONFIG.IQ_TEST.TOTAL_QUESTIONS) * 100;
    let ageAdjustment = -5;
    for (const { maxAge, adjustment } of CONFIG.AGE_ADJUSTMENTS) { if (currentUser.age < maxAge) { ageAdjustment = adjustment; break; } }
    const timeBonus = Math.max(0, (CONFIG.IQ_TEST.TIME_LIMIT - timeTaken) / CONFIG.IQ_TEST.TIME_LIMIT * 10);
    let iqScore = Math.round(70 + baseScore * 0.8 + ageAdjustment + timeBonus);
    iqScore = Math.min(CONFIG.IQ_TEST.MAX_IQ, Math.max(CONFIG.IQ_TEST.MIN_IQ, iqScore));
    
    document.getElementById('iqCorrectCount').textContent = correctCount;
    document.getElementById('iqWrongCount').textContent = wrongCount;
    document.getElementById('iqTimeTaken').textContent = `${Math.floor(timeTaken / 60)}:${(timeTaken % 60).toString().padStart(2, '0')}`;
    
    const scoreDisplay = document.getElementById('iqScoreDisplay');
    const scoreRing = document.getElementById('iqScoreRing');
    let currentScore = 0;
    const animation = setInterval(() => {
        if (currentScore < iqScore) { currentScore += 2; scoreDisplay.textContent = Math.min(currentScore, iqScore); scoreRing.style.strokeDashoffset = 553 - (553 * Math.min((currentScore - 70) / 90, 1)); }
        else clearInterval(animation);
    }, 20);
    
    let cat = CONFIG.IQ_CATEGORIES[CONFIG.IQ_CATEGORIES.length - 1];
    for (const c of CONFIG.IQ_CATEGORIES) { if (iqScore >= c.minScore) { cat = c; break; } }
    document.getElementById('iqCategory').textContent = cat.category;
    document.getElementById('iqCategory').className = `text-xl font-semibold mb-4 ${cat.color}`;
    document.getElementById('iqDescription').textContent = cat.description;
    
    currentUser.progress.iqScores.push({ score: iqScore, date: new Date().toISOString(), correct: correctCount, timeTaken: timeTaken });
    currentUser.progress.testsCompleted++;
    iqTestState.answers.forEach(a => { 
        if (!currentUser.progress.categoryAttempts[a.category]) currentUser.progress.categoryAttempts[a.category] = 0;
        if (!currentUser.progress.categories[a.category]) currentUser.progress.categories[a.category] = 0;
        currentUser.progress.categoryAttempts[a.category]++; 
        if (a.correct) currentUser.progress.categories[a.category]++; 
    });
    currentUser.progress.activities.unshift({ type: 'IQ Test', score: iqScore, date: new Date().toISOString(), correct: correctCount, total: CONFIG.IQ_TEST.TOTAL_QUESTIONS });
    saveProgress();
}

// ==================== IQ PRACTICE ====================
function startPractice(category) {
    if (!currentUser) { showAuthModal(); return; }
    document.getElementById('practice-menu').classList.add('hidden');
    document.getElementById('practice-active').classList.remove('hidden');
    
    practiceUsedQuestions.clear();
    let questions = [];
    if (category === 'mixed') {
        CONFIG.CATEGORIES.forEach(cat => { if (questionBank && questionBank[cat]) questionBank[cat].forEach(q => questions.push({ ...q, category: cat })); });
    } else if (questionBank && questionBank[category]) {
        questions = [...questionBank[category]].map(q => ({ ...q, category: category }));
    }
    
    practiceQuestionPool = questions.sort(() => Math.random() - 0.5);
    practiceState = { category, questions: [], currentIndex: 0, score: 0, answered: false };
    document.getElementById('practiceCategory').textContent = category.charAt(0).toUpperCase() + category.slice(1);
    loadNextPracticeQuestion();
}

function loadNextPracticeQuestion() {
    if (!practiceQuestionPool?.length) { endPractice(); return; }
    let nextQuestion = null;
    for (const q of practiceQuestionPool) {
        const qId = q.id || generateQuestionId(q);
        if (!practiceUsedQuestions.has(qId)) { nextQuestion = q; practiceUsedQuestions.add(qId); break; }
    }
    if (!nextQuestion) { practiceUsedQuestions.clear(); practiceQuestionPool.sort(() => Math.random() - 0.5); nextQuestion = practiceQuestionPool[0]; if (nextQuestion) practiceUsedQuestions.add(nextQuestion.id || generateQuestionId(nextQuestion)); }
    if (nextQuestion?.q && nextQuestion?.options) { practiceState.questions = [nextQuestion]; practiceState.currentIndex = 0; showPracticeQuestion(); }
    else endPractice();
}

function showPracticeQuestion() {
    practiceState.answered = false;
    document.getElementById('practiceExplanation').classList.add('hidden');
    document.getElementById('practiceNext').classList.add('hidden');
    const q = practiceState.questions[practiceState.currentIndex];
    document.getElementById('practiceQuestionType').textContent = q.category ? q.category.charAt(0).toUpperCase() + q.category.slice(1) : '';
    document.getElementById('practiceQuestion').textContent = q.q;
    document.getElementById('practiceScore').textContent = practiceState.score;
    
    const optionsDiv = document.getElementById('practiceOptions');
    optionsDiv.innerHTML = '';
    q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'practice-option w-full text-left p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition border-2 border-transparent hover:border-indigo-500';
        btn.innerHTML = `<span class="font-medium text-indigo-400 mr-3">${String.fromCharCode(65 + i)}</span>${opt}`;
        btn.onclick = () => answerPracticeQuestion(i);
        optionsDiv.appendChild(btn);
    });
}

function answerPracticeQuestion(answerIndex) {
    if (practiceState.answered) return;
    practiceState.answered = true;
    const q = practiceState.questions[practiceState.currentIndex];
    const correct = answerIndex === q.answer;
    
    const options = document.querySelectorAll('.practice-option');
    options.forEach((opt, i) => {
        if (i === q.answer) opt.classList.add('bg-emerald-500/30', 'border-emerald-500');
        else if (i === answerIndex && !correct) opt.classList.add('bg-red-500/30', 'border-red-500');
        opt.style.pointerEvents = 'none';
    });
    
    if (correct) { practiceState.score++; document.getElementById('practiceScore').textContent = practiceState.score; }
    document.getElementById('practiceExplanation').classList.remove('hidden');
    document.getElementById('practiceExplanation').className = `mt-6 p-4 rounded-xl bg-slate-800 border-l-4 ${correct ? 'border-emerald-500' : 'border-red-500'}`;
    document.getElementById('explanationText').textContent = q.explanation;
    document.getElementById('practiceNext').classList.remove('hidden');
    
    const cat = q.category || practiceState.category;
    if (currentUser.progress.categoryAttempts[cat] !== undefined) {
        currentUser.progress.categoryAttempts[cat]++;
        if (correct) currentUser.progress.categories[cat]++;
    }
}

function nextPracticeQuestion() { loadNextPracticeQuestion(); }

function endPractice() {
    document.getElementById('practice-menu').classList.remove('hidden');
    document.getElementById('practice-active').classList.add('hidden');
    currentUser.progress.practiceSessions++;
    currentUser.progress.activities.unshift({ type: `Practice (${practiceState.category})`, score: practiceState.score, date: new Date().toISOString() });
    saveProgress();
}

// ==================== MEMORY GAMES ====================
function startMemoryGame(game) {
    if (!currentUser) { showAuthModal(); return; }

    document.getElementById('memory-menu').classList.add('hidden');
    document.getElementById('memory-game-area').classList.remove('hidden');
    memoryState = { game, level: 1, score: 0, data: {} };
    document.getElementById('memoryLevel').textContent = 1;
    document.getElementById('memoryScore').textContent = 0;
    
    switch (game) {
        case 'number-recall': startNumberRecall(); break;
        case 'object-memory': startObjectMemory(); break;
        case 'pattern-recognition': startPatternRecognition(); break;
        case 'ascending-order': startAscendingOrder(); break;
        case 'match-cards': startMatchCards(); break;
        case 'word-recognition': startWordRecognition(); break;
    }
}

function endMemoryGame() {
    document.getElementById('memory-menu').classList.remove('hidden');
    document.getElementById('memory-game-area').classList.add('hidden');
    const gameName = memoryState.game.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    currentUser.progress.memoryGames++;
    currentUser.progress.activities.unshift({ type: `Memory: ${gameName}`, score: memoryState.score, level: memoryState.level, date: new Date().toISOString() });
    saveProgress();
}

function showMemoryFeedback(success, message, callback) {
    document.getElementById('memoryGameContent').innerHTML = `
        <div class="text-center scale-in">
            <div class="memory-feedback-icon">${success ? '🎉' : '😅'}</div>
            <h2 class="text-3xl font-bold mb-3 ${success ? 'text-emerald-400' : 'text-red-400'}">${success ? 'Excellent!' : 'Try Again!'}</h2>
            <p class="text-slate-300 mb-8 text-lg max-w-md mx-auto">${message}</p>
            <button onclick="${callback.name}()" class="btn-primary px-10 py-4 rounded-xl font-bold text-white text-lg">Continue</button>
        </div>`;
}

function updateMemoryStats() { document.getElementById('memoryScore').textContent = memoryState.score; document.getElementById('memoryLevel').textContent = memoryState.level; }

// Number Recall
function startNumberRecall() {
    const digits = memoryState.level + 2;
    const displayTime = 3000 + (digits * 1500) + (memoryState.level * 1000);
    let number = '';
    for (let i = 0; i < digits; i++) number += Math.floor(Math.random() * 10);
    memoryState.data.number = number;
    
    document.getElementById('memoryGameContent').innerHTML = `
        <div class="text-center">
            <div class="instruction-box"><h3>🧠 Remember this number</h3><p>${digits} digits • Level ${memoryState.level}</p></div>
            <div class="number-recall-display"><div class="number-recall-digits" style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
                ${number.split('').map((d, i) => `<span class="digit-box" style="animation-delay:${i * 0.1}s">${d}</span>`).join('')}
            </div></div>
            <div class="timer-bar-container"><div class="timer-bar" id="recallProgress"></div></div>
        </div>`;
    
    let elapsed = 0;
    const interval = setInterval(() => { elapsed += 50; const p = document.getElementById('recallProgress'); if (p) p.style.width = ((displayTime - elapsed) / displayTime * 100) + '%'; }, 50);
    setTimeout(() => { clearInterval(interval); showNumberRecallInput(digits); }, displayTime);
}

function showNumberRecallInput(digits) {
    document.getElementById('memoryGameContent').innerHTML = `
        <div class="text-center scale-in">
            <div class="instruction-box"><h3>✏️ Enter the number</h3><p>Type the ${digits}-digit number</p></div>
            <div style="margin:20px 0"><input type="text" id="numberInput" class="number-input-field" maxlength="${digits}" placeholder="${'•'.repeat(digits)}" autofocus></div>
            <button onclick="checkNumberRecall()" class="btn-primary px-12 py-4 rounded-2xl font-bold text-white text-lg mt-4">Submit</button>
        </div>`;
    const input = document.getElementById('numberInput');
    input.focus();
    input.addEventListener('input', e => e.target.value = e.target.value.replace(/[^0-9]/g, ''));
    input.addEventListener('keypress', e => { if (e.key === 'Enter') checkNumberRecall(); });
}

function checkNumberRecall() {
    const input = document.getElementById('numberInput').value;
    if (input === memoryState.data.number) { memoryState.score += memoryState.level * 10; memoryState.level++; updateMemoryStats(); showMemoryFeedback(true, `Perfect! The number was ${memoryState.data.number}`, startNumberRecall); }
    else showMemoryFeedback(false, `The correct number was ${memoryState.data.number}`, startNumberRecall);
}

// Object Memory - Missing Object
function startObjectMemory() {
    const allObjects = ['🍎', '🚗', '🏠', '⭐', '🌙', '🔔', '📚', '🎸', '⚽', '🎨', '🌺', '🦋', '🍦', '🍕', '🌵', '🚀', '🧸', '🎈', '🎁', '🔑'];
    const numObjects = Math.min(memoryState.level + 2, 8);
    
    // Select objects for this round
    const selectedObjects = allObjects.sort(() => Math.random() - 0.5).slice(0, numObjects);
    const missingIndex = Math.floor(Math.random() * numObjects);
    const missingObject = selectedObjects[missingIndex];
    const remainingObjects = selectedObjects.filter((_, i) => i !== missingIndex);
    
    // Distractors for options
    const otherObjects = allObjects.filter(obj => !selectedObjects.includes(obj));
    const distractors = otherObjects.sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [missingObject, ...distractors].sort(() => Math.random() - 0.5);
    
    memoryState.data = { 
        selectedObjects, 
        remainingObjects, 
        missingObject, 
        options 
    };
    
    const showTime = 3000 + (memoryState.level * 500);
    
    document.getElementById('memoryGameContent').innerHTML = `
        <div class="text-center scale-in">
            <div class="instruction-box"><h3>👁️ Memorize these objects</h3><p>${numObjects} objects • Level ${memoryState.level}</p></div>
            <div class="flex flex-wrap justify-center gap-4 mx-auto mb-6" style="max-width:400px">
                ${selectedObjects.map(obj => `<div class="w-20 h-20 bg-slate-800/80 border-2 border-slate-700 rounded-2xl flex items-center justify-center text-5xl shadow-lg animate-pulse-slow">${obj}</div>`).join('')}
            </div>
            <div class="timer-bar-container"><div class="timer-bar" id="objectProgress"></div></div>
        </div>`;
    
    let elapsed = 0;
    const interval = setInterval(() => { 
        elapsed += 50; 
        const p = document.getElementById('objectProgress'); 
        if (p) p.style.width = ((showTime - elapsed) / showTime * 100) + '%'; 
        else clearInterval(interval);
    }, 50);
    
    setTimeout(() => { clearInterval(interval); askMissingObject(); }, showTime);
}

function askMissingObject() {
    const { remainingObjects, options, missingObject } = memoryState.data;
    
    document.getElementById('memoryGameContent').innerHTML = `
        <div class="text-center scale-in">
            <div class="instruction-box"><h3>❓ Which object is missing?</h3><p>One object has vanished</p></div>
            
            <div class="bg-slate-800/50 p-6 rounded-3xl mb-8 border border-slate-700/50 inline-block">
                <div class="flex flex-wrap justify-center gap-4 mx-auto" style="max-width:400px">
                    ${remainingObjects.sort(() => Math.random() - 0.5).map(obj => `<div class="w-16 h-16 bg-slate-800 border-2 border-slate-600 rounded-xl flex items-center justify-center text-3xl opacity-70 grayscale-30">${obj}</div>`).join('')}
                    <div class="w-16 h-16 border-2 border-dashed border-indigo-500/50 bg-indigo-500/10 rounded-xl flex items-center justify-center text-3xl text-indigo-400 font-bold animate-pulse">?</div>
                </div>
            </div>

            <p class="text-slate-400 mb-4">Select the missing object:</p>
            <div class="flex flex-wrap justify-center gap-4">
                ${options.map(opt => `<button onclick="checkMissingObject('${opt}')" class="w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-2 border-indigo-500/50 rounded-2xl flex items-center justify-center text-4xl hover:scale-110 hover:bg-indigo-500/40 transition shadow-lg hover:shadow-indigo-500/30 cursor-pointer">${opt}</button>`).join('')}
            </div>
        </div>`;
}

function checkMissingObject(selected) {
    const { missingObject } = memoryState.data;
    if (selected === missingObject) {
        memoryState.score += memoryState.level * 25;
        memoryState.level++;
        updateMemoryStats();
        showMemoryFeedback(true, `Correct! ${missingObject} was missing.`, startObjectMemory);
    } else {
        showMemoryFeedback(false, `Wrong! The missing object was ${missingObject}.`, startObjectMemory);
    }
}

// Matrix Memory (Pattern Recognition)
function startPatternRecognition() {
    const gridSize = 4;
    const numCells = Math.min(memoryState.level + 2, 8);
    const totalCells = gridSize * gridSize;
    
    // Select unique random cells
    const pattern = [];
    while (pattern.length < numCells) {
        const pos = Math.floor(Math.random() * totalCells);
        if (!pattern.includes(pos)) pattern.push(pos);
    }
    
    memoryState.data = { pattern, userPattern: [] };
    const showTime = Math.max(1000, 2500 - (memoryState.level * 200));
    
    document.getElementById('memoryGameContent').innerHTML = `
        <div class="text-center scale-in">
            <div class="instruction-box"><h3>🧠 Memorize the pattern</h3><p>${numCells} cells • Level ${memoryState.level}</p></div>
            <div class="grid grid-cols-4 gap-3 mx-auto mb-6 p-4 bg-slate-800/50 rounded-2xl border border-slate-700" style="max-width:340px">
                ${Array(totalCells).fill(0).map((_, i) => {
                    const isTarget = pattern.includes(i);
                    const activeClass = isTarget ? 'bg-indigo-500 shadow-glow-indigo scale-105' : 'bg-slate-700/50';
                    return `<div class="w-16 h-16 rounded-xl border-2 border-slate-600/50 flex items-center justify-center transition-all duration-300 ${activeClass}" id="pat-${i}"></div>`;
                }).join('')}
            </div>
            <div class="timer-bar-container"><div class="timer-bar" id="patternTimer"></div></div>
        </div>`;
    
    let elapsed = 0;
    const interval = setInterval(() => {
        elapsed += 50;
        const p = document.getElementById('patternTimer');
        if (p) p.style.width = ((showTime - elapsed) / showTime * 100) + '%';
        else clearInterval(interval);
    }, 50);
    
    setTimeout(() => {
        clearInterval(interval);
        showMatrixInput();
    }, showTime);
}

function showMatrixInput() {
    const { pattern } = memoryState.data;
    const gridSize = 4;
    const totalCells = gridSize * gridSize;
    
    document.getElementById('memoryGameContent').innerHTML = `
        <div class="text-center scale-in">
            <div class="instruction-box"><h3>👆 Recreate the pattern</h3><p>Select the ${pattern.length} cells</p></div>
            <div class="grid grid-cols-4 gap-3 mx-auto mb-6 p-4 bg-slate-800/50 rounded-2xl border border-slate-700" style="max-width:340px">
                ${Array(totalCells).fill(0).map((_, i) => 
                    `<div class="w-16 h-16 rounded-xl bg-slate-700/50 border-2 border-slate-600/50 cursor-pointer hover:bg-slate-600 hover:border-slate-500 transition-all active:scale-95" 
                          id="pat-${i}" onclick="checkMatrixCell(${i})"></div>`
                ).join('')}
            </div>
        </div>`;
}

function checkMatrixCell(pos) {
    const { pattern, userPattern } = memoryState.data;
    const cell = document.getElementById(`pat-${pos}`);
    
    if (userPattern.includes(pos) || !cell) return; // Already selected
    
    if (pattern.includes(pos)) {
        // Correct
        cell.classList.remove('bg-slate-700/50', 'border-slate-600/50', 'hover:bg-slate-600');
        cell.classList.add('bg-emerald-500', 'border-emerald-400', 'shadow-glow-emerald');
        cell.innerHTML = '';
        userPattern.push(pos);
        
        if (userPattern.length === pattern.length) {
            memoryState.score += memoryState.level * 30;
            memoryState.level++;
            updateMemoryStats();
            setTimeout(() => showMemoryFeedback(true, "Perfect match!", startPatternRecognition), 500);
        }
    } else {
        // Wrong
        // Disable all inputs immediately
        const allCells = document.querySelectorAll('[id^="pat-"]');
        allCells.forEach(el => {
            el.onclick = null;
            el.style.pointerEvents = 'none';
        });

        cell.classList.remove('bg-slate-700/50', 'border-slate-600/50', 'hover:bg-slate-600');
        cell.classList.add('bg-rose-500', 'border-rose-400');
        cell.innerHTML = '<span class="text-white text-xl">✗</span>';
        
        // Show missed ones
        pattern.forEach(p => {
            if (!userPattern.includes(p)) {
                const c = document.getElementById(`pat-${p}`);
                if (c) {
                    c.classList.add('bg-indigo-500/50', 'border-indigo-400/50');
                    c.innerHTML = '<span class="text-white/50 text-xl">●</span>';
                }
            }
        });
        
        setTimeout(() => showMemoryFeedback(false, "Incorrect cell selected!", startPatternRecognition), 1500);
    }
}

// Ascending Order
function startAscendingOrder() {
    const count = Math.min(memoryState.level + 3, 12);
    const numbers = [];
    while (numbers.length < count) { const n = Math.floor(Math.random() * 99) + 1; if (!numbers.includes(n)) numbers.push(n); }
    const gridCols = count <= 6 ? 3 : 4;
    const positions = Array.from({length: count}, (_, i) => i).sort(() => Math.random() - 0.5);
    memoryState.data = { numbers: [...numbers], sorted: [...numbers].sort((a, b) => a - b), clicked: [], positions, gridCols };
    const showTime = 4000 + (count * 1000) + (memoryState.level * 1500);
    const totalSeconds = Math.ceil(showTime / 1000);
    
    document.getElementById('memoryGameContent').innerHTML = `
        <div class="text-center">
            <div class="instruction-box"><h3>🔢 Memorize these numbers</h3><p>${count} numbers • ${totalSeconds} seconds • Level ${memoryState.level}</p></div>
            <div class="ascending-grid" style="grid-template-columns:repeat(${gridCols},1fr);max-width:${gridCols * 100}px">
                ${positions.map((pos, i) => `<div class="ascending-number-card scale-in" style="animation-delay:${i * 0.08}s"><span class="ascending-number">${numbers[pos]}</span></div>`).join('')}
            </div>
            <div class="timer-bar-container mt-8"><div class="timer-bar" id="showProgress"></div></div>
        </div>`;
    
    let elapsed = 0;
    const interval = setInterval(() => { elapsed += 50; const p = document.getElementById('showProgress'); if (p) p.style.width = ((showTime - elapsed) / showTime * 100) + '%'; }, 50);
    setTimeout(() => { clearInterval(interval); showAscendingInput(); }, showTime);
}

function showAscendingInput() {
    const { numbers, sorted, positions, gridCols } = memoryState.data;
    document.getElementById('memoryGameContent').innerHTML = `
        <div class="text-center scale-in">
            <div class="instruction-box"><h3>📈 Click numbers in ascending order</h3><p>Start with the smallest</p></div>
            <div class="ascending-progress-bar"><div class="ascending-progress-fill" id="ascProgressBar" style="width:0%"></div></div>
            <p class="text-slate-400 mb-6">Progress: <span id="ascProgress" class="font-bold text-emerald-400">0</span>/${sorted.length}</p>
            <div class="ascending-grid" style="grid-template-columns:repeat(${gridCols},1fr);max-width:${gridCols * 100}px">
                ${positions.map(pos => `<button class="ascending-input-card" id="num-${numbers[pos]}" onclick="clickAscending(${numbers[pos]})"><span class="question-mark">?</span></button>`).join('')}
            </div>
        </div>`;
}

function clickAscending(num) {
    const { sorted, clicked } = memoryState.data;
    const expected = sorted[clicked.length];
    const btn = document.getElementById(`num-${num}`);
    
    if (num === expected) {
        clicked.push(num);
        btn.innerHTML = `<span class="revealed-number">${num}</span>`;
        btn.className = 'ascending-input-card correct'; btn.disabled = true;
        document.getElementById('ascProgress').textContent = clicked.length;
        document.getElementById('ascProgressBar').style.width = (clicked.length / sorted.length * 100) + '%';
        if (clicked.length === sorted.length) { memoryState.score += memoryState.level * 15; memoryState.level++; updateMemoryStats(); setTimeout(() => showMemoryFeedback(true, `Perfect! All ${sorted.length} numbers correct!`, startAscendingOrder), 600); }
    } else {
        btn.innerHTML = `<span class="revealed-number">${num}</span>`;
        btn.className = 'ascending-input-card wrong';
        const correctBtn = document.getElementById(`num-${expected}`);
        if (correctBtn) { setTimeout(() => { correctBtn.innerHTML = `<span class="revealed-number">${expected}</span>`; correctBtn.className = 'ascending-input-card correct-hint'; }, 300); }
        setTimeout(() => showMemoryFeedback(false, `Wrong! Expected ${expected}. Got ${clicked.length}/${sorted.length}`, startAscendingOrder), 1200);
    }
}

// Match Cards
function startMatchCards() {
    const emojis = ['🎈', '🎁', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎺', '🎻', '🎼', '🎧'];
    const pairCount = Math.min(3 + memoryState.level, 8);
    const selected = emojis.slice(0, pairCount);
    const cards = [...selected, ...selected].sort(() => Math.random() - 0.5);
    memoryState.data = { cards, flipped: [], matched: [], moves: 0 };
    
    document.getElementById('memoryGameContent').innerHTML = `
        <div class="text-center">
            <div class="instruction-box"><h3>🃏 Find all matching pairs</h3><p>Moves: <span id="moveCount" class="font-bold text-cyan-400">0</span> • Pairs: <span id="pairsFound" class="font-bold text-emerald-400">0</span>/${pairCount}</p></div>
            <div class="grid grid-cols-4 gap-4 mx-auto" style="max-width:360px">
                ${cards.map((_, i) => `<div class="memory-card" onclick="flipCard(${i})" style="width:76px;height:96px;"><div class="memory-card-inner relative w-full h-full"><div class="memory-card-front flex items-center justify-center"><span class="text-3xl">❓</span></div><div class="memory-card-back flex items-center justify-center"><span class="text-4xl">${cards[i]}</span></div></div></div>`).join('')}
            </div>
        </div>`;
}

function flipCard(index) {
    const { cards, flipped, matched } = memoryState.data;
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;
    
    document.querySelectorAll('.memory-card')[index].classList.add('flipped');
    flipped.push(index);
    
    if (flipped.length === 2) {
        memoryState.data.moves++;
        document.getElementById('moveCount').textContent = memoryState.data.moves;
        if (cards[flipped[0]] === cards[flipped[1]]) {
            matched.push(flipped[0], flipped[1]);
            document.getElementById('pairsFound').textContent = matched.length / 2;
            memoryState.data.flipped = [];
            if (matched.length === cards.length) { memoryState.score += Math.max(10, 50 - memoryState.data.moves) * memoryState.level; memoryState.level++; updateMemoryStats(); setTimeout(() => showMemoryFeedback(true, `All pairs found in ${memoryState.data.moves} moves!`, startMatchCards), 500); }
        } else {
            setTimeout(() => { document.querySelectorAll('.memory-card').forEach((card, i) => { if (flipped.includes(i)) card.classList.remove('flipped'); }); memoryState.data.flipped = []; }, 1000);
        }
    }
}

// Word Recognition
function startWordRecognition() {
    const sequenceLength = 10 + (memoryState.level - 1) * 5;
    const allWords = ['apple', 'mountain', 'river', 'garden', 'castle', 'bridge', 'forest', 'ocean', 'village', 'temple', 
                      'thunder', 'whisper', 'shadow', 'crystal', 'harmony', 'journey', 'mystery', 'phoenix', 'victory', 'wisdom', 
                      'diamond', 'silver', 'copper', 'bronze', 'golden', 'purple', 'velvet', 'marble', 'canvas', 'anchor', 
                      'sunset', 'breeze', 'meadow', 'glacier', 'canyon', 'island', 'desert', 'jungle', 'volcano', 'rainbow',
                      'galaxy', 'comet', 'planet', 'star', 'nebula', 'orbit', 'meteor', 'cosmos', 'gravity', 'eclipse',
                      'dragon', 'wizard', 'elf', 'fairy', 'giant', 'mermaid', 'unicorn', 'goblin', 'troll', 'spirit',
                      'music', 'piano', 'violin', 'drum', 'guitar', 'flute', 'harp', 'cello', 'trumpet', 'singer'];
    const pool = [...allWords].sort(() => Math.random() - 0.5);
    
    memoryState.data = {
        pool: pool,
        history: [], 
        currentIndex: 0,
        correct: 0,
        total: sequenceLength
    };
    nextWordTurn();
}

function nextWordTurn() {
    const { pool, history, currentIndex, total } = memoryState.data;
    if (currentIndex >= total) { showWordLevelComplete(); return; }
    
    let word, isSeen;
    const canShowSeen = history.length > 0;
    const wantShowSeen = Math.random() < 0.5; // 50% chance for seen if possible
    
    // First word is always new.
    if (currentIndex === 0 || !canShowSeen || !wantShowSeen) {
        word = pool.pop();
        if (!word && history.length > 0) { word = history[Math.floor(Math.random() * history.length)]; isSeen = true; }
        else { isSeen = false; }
    } else {
        word = history[Math.floor(Math.random() * history.length)];
        isSeen = true;
    }
    
    memoryState.data.currentWord = word;
    memoryState.data.currentIsSeen = isSeen;
    
    document.getElementById('memoryGameContent').innerHTML = `
        <div class="text-center scale-in">
            <div class="bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border-2 border-indigo-500/30 rounded-3xl p-12 mb-8 inline-block min-w-[300px]">
                <div class="text-5xl font-bold text-white">${word}</div>
            </div>
            <p class="text-slate-400 mb-6 text-lg">Did this word appear before in this level?</p>
            <div class="flex gap-4 justify-center">
                <button onclick="handleWordChoice('seen')" class="px-12 py-5 rounded-2xl font-bold text-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white hover:scale-105 transition shadow-lg shadow-emerald-500/20">SEEN</button>
                <button onclick="handleWordChoice('new')" class="px-12 py-5 rounded-2xl font-bold text-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:scale-105 transition shadow-lg shadow-blue-500/20">NEW</button>
            </div>
        </div>`;
}

function handleWordChoice(choice) {
    const { currentIsSeen, currentWord, history } = memoryState.data;
    const correct = (choice === 'seen' && currentIsSeen) || (choice === 'new' && !currentIsSeen);
    
    if (!correct) {
        showWordGameOver();
        return;
    }
    
    memoryState.data.correct++;
    if (!history.includes(currentWord)) history.push(currentWord);
    
    memoryState.data.currentIndex++;
    nextWordTurn();
}

function showWordGameOver() {
    const { correct, total } = memoryState.data;
    
    document.getElementById('memoryGameContent').innerHTML = `
        <div class="text-center scale-in">
            <div class="text-8xl mb-6">💥</div>
            <h2 class="text-3xl font-bold mb-4 text-rose-400">Game Over!</h2>
            <div class="bg-slate-800/80 rounded-3xl p-8 inline-block mb-6">
                <div class="text-2xl text-slate-400 mb-2">You reached step</div>
                <div class="text-6xl font-bold text-white">${correct}</div>
            </div>
            <p class="text-slate-400 mb-8">One wrong move ends the game.</p>
            <button onclick="startWordRecognition()" class="btn-primary px-10 py-4 rounded-2xl font-bold text-white text-lg">Try Again</button>
        </div>`;
}

function showWordLevelComplete() {
    const { correct, total } = memoryState.data;
    const percentage = Math.round((correct / total) * 100);
    const passed = percentage >= 80;
    
    if (passed) { memoryState.score += memoryState.level * 20; memoryState.level++; updateMemoryStats(); }
    
    document.getElementById('memoryGameContent').innerHTML = `
        <div class="text-center scale-in">
            <div class="text-8xl mb-6">${passed ? '🎉' : '💪'}</div>
            <h2 class="text-3xl font-bold mb-4 ${passed ? 'text-emerald-400' : 'text-amber-400'}">${passed ? 'Level Complete!' : 'Good Effort!'}</h2>
            <div class="bg-slate-800/80 rounded-3xl p-8 inline-block mb-6">
                <div class="text-6xl font-bold ${passed ? 'text-emerald-400' : 'text-amber-400'} mb-2">${percentage}%</div>
                <div class="text-slate-400">${correct} / ${total} correct</div>
            </div>
            <p class="text-slate-400 mb-8">${passed ? `Advancing to Level ${memoryState.level}` : 'Need 80% to advance'}</p>
            <button onclick="startWordRecognition()" class="btn-primary px-10 py-4 rounded-2xl font-bold text-white text-lg">${passed ? 'Start Next Level' : 'Try Again'}</button>
        </div>`;
}

// ==================== DASHBOARD ====================
function loadDashboard() {
    if (!currentUser) { showAuthModal(); return; }
    if (!currentUser.progress) currentUser.progress = createEmptyProgress();
    const p = currentUser.progress;
    
    document.getElementById('dashIQ').textContent = p.iqScores?.length > 0 ? p.iqScores[p.iqScores.length - 1].score : '--';
    
    // Calculate Average IQ
    if (p.iqScores && p.iqScores.length > 0) {
        const sum = p.iqScores.reduce((acc, curr) => acc + curr.score, 0);
        const avg = Math.round(sum / p.iqScores.length);
        document.getElementById('dashAvgIQ').textContent = avg;
    } else {
        document.getElementById('dashAvgIQ').textContent = '--';
    }

    document.getElementById('dashTests').textContent = p.testsCompleted || 0;
    document.getElementById('dashPractice').textContent = p.practiceSessions || 0;
    document.getElementById('dashMemory').textContent = p.memoryGames || 0;
    
    // IQ Progress Chart
    const iqCtx = document.getElementById('iqProgressChart').getContext('2d');
    if (window.iqChart) window.iqChart.destroy();
    window.iqChart = new Chart(iqCtx, {
        type: 'line',
        data: { labels: (p.iqScores || []).map((_, i) => `Test ${i + 1}`), datasets: [{ label: 'IQ', data: (p.iqScores || []).map(s => s.score), borderColor: '#94a3b8', backgroundColor: 'rgba(148, 163, 184, 0.1)', fill: true, tension: 0.4 }] },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { min: 70, max: 160, grid: { color: '#334155' }, ticks: { color: '#94a3b8' } }, x: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } } } }
    });
    
    // Category Chart
    const catCtx = document.getElementById('categoryChart').getContext('2d');
    if (window.catChart) window.catChart.destroy();
    const catData = CONFIG.CATEGORIES.map(c => { const attempts = (p.categoryAttempts?.[c] || 1); return Math.round((p.categories?.[c] || 0) / attempts * 100); });
    window.catChart = new Chart(catCtx, {
        type: 'radar',
        data: { labels: CONFIG.CATEGORIES.map(c => c.charAt(0).toUpperCase() + c.slice(1)), datasets: [{ data: catData, borderColor: '#cbd5e1', backgroundColor: 'rgba(203, 213, 225, 0.1)', pointBackgroundColor: '#cbd5e1' }] },
        options: { responsive: true, scales: { r: { beginAtZero: true, max: 100, grid: { color: '#334155' }, angleLines: { color: '#334155' }, pointLabels: { color: '#94a3b8' }, ticks: { display: false } } }, plugins: { legend: { display: false } } }
    });
    
    // Advice
    const weakest = CONFIG.CATEGORIES.reduce((a, b) => catData[CONFIG.CATEGORIES.indexOf(a)] < catData[CONFIG.CATEGORIES.indexOf(b)] ? a : b);
    const weakestScore = catData[CONFIG.CATEGORIES.indexOf(weakest)];
    let adviceHTML = '';
    if (weakestScore < 50) adviceHTML += `<div class="flex items-start gap-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl cursor-pointer hover:border-rose-500/40" onclick="startPractice('${weakest}')"><div class="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-xl">📚</div><div><div class="font-semibold text-rose-400">Focus on ${weakest}</div><div class="text-slate-400 text-sm">Weakest at ${weakestScore}%</div></div></div>`;
    adviceHTML += `<div class="flex items-start gap-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl"><div class="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-xl">💪</div><div><div class="font-semibold text-emerald-400">Keep practicing</div><div class="text-slate-400 text-sm">Daily practice improves IQ</div></div></div>`;
    document.getElementById('adviceSection').innerHTML = adviceHTML;
    
    // Check and Render Badges
    checkBadges();
    renderBadges();

    // Activities
    const activitiesDiv = document.getElementById('recentActivities');
    activitiesDiv.innerHTML = (p.activities || []).slice(0, 10).map(a => {
        const type = String(a?.type || 'Activity');
        const isIQTest = type.includes('IQ Test');
        const dateValue = new Date(a?.date);
        const dateLabel = Number.isNaN(dateValue.getTime()) ? 'Date unavailable' : dateValue.toLocaleDateString();
        const score = Number.isFinite(Number(a?.score)) ? Number(a.score) : 0;
        return `<div class="flex items-center justify-between p-3 bg-slate-800 rounded-xl"><div><div class="font-medium">${escapeHTML(type)}</div><div class="text-xs text-slate-400">${escapeHTML(dateLabel)}</div></div><div class="text-right"><div class="font-bold ${isIQTest ? 'gradient-text' : 'text-emerald-400'}">${score}${isIQTest ? '' : ' pts'}</div></div></div>`;
    }).join('') || '<div class="text-slate-400 text-center py-4">No activities yet</div>';
}

function loadAboutScientists() {
    const grid = document.getElementById('aboutScientistGrid');
    if (!grid) return;
    const colors = [
        { bg: 'from-yellow-500/20 to-amber-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400' },
        { bg: 'from-slate-500/20 to-slate-500/10', border: 'border-slate-400/30', text: 'text-slate-300' },
        { bg: 'from-amber-700/20 to-orange-500/10', border: 'border-amber-600/30', text: 'text-amber-500' }
    ];
    grid.innerHTML = scientists.map((s, i) => {
        const medal = i < 3 ? ['🥇', '🥈', '🥉'][i] : null;
        const colorSet = i < 3 ? colors[i] : { bg: 'from-indigo-500/10 to-purple-500/5', border: 'border-indigo-500/20', text: 'text-indigo-400' };
        return `<div class="scientist-card-enhanced rounded-2xl p-4 text-center bg-gradient-to-br ${colorSet.bg} border ${colorSet.border}">
            <div class="relative mb-3">${medal ? `<div class="absolute -top-2 -left-2 text-2xl z-10">${medal}</div>` : `<div class="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400">${i + 1}</div>`}
                <div class="w-16 h-16 mx-auto overflow-hidden rounded-full border-2 ${colorSet.border}"><img src="${s.image}" alt="${s.name}" class="w-full h-full object-cover bg-slate-700" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=6366f1&color=fff&size=64'"></div>
            </div>
            <h4 class="font-semibold text-xs mb-1 text-white truncate">${s.name}</h4>
            <div class="text-lg font-bold ${colorSet.text} mb-1">${s.iq}</div>
            <div class="text-xs text-slate-500">${s.field}</div>
        </div>`;
    }).join('');
}

function checkBadges() {
    if (!currentUser || !currentUser.progress) return;
    if (!currentUser.progress.badges) currentUser.progress.badges = [];
    
    const p = currentUser.progress;
    const unlocked = new Set(p.badges);
    const iqScores = p.iqScores || [];
    const activities = p.activities || [];
    const categories = p.categories || {};
    const attempts = p.categoryAttempts || {};
    
    // Helper to get category accuracy
    const getCatAcc = (cat) => attempts[cat] ? (categories[cat] / attempts[cat]) : 0;
    
    // --- Level 1 ---
    if (iqScores.length >= 1) unlocked.add('l1_1'); // Novice
    const totalQuestions = Object.values(attempts).reduce((a, b) => a + b, 0);
    if (totalQuestions >= 10) unlocked.add('l1_2'); // Learner
    if (iqScores.some(s => s.score > 80)) unlocked.add('l1_3'); // Thinker
    if (iqScores.some(s => s.timeTaken < 600)) unlocked.add('l1_4'); // Quick (under 10m)
    // Accurate: Check recent IQ tests for 5 correct answers (approximate logic for "in a row" or just high accuracy)
    if (activities.some(a => a.type === 'IQ Test' && a.correct >= 5)) unlocked.add('l1_5');

    // --- Level 2 ---
    if (iqScores.some(s => s.score > 100)) unlocked.add('l2_1'); // Smart
    if (iqScores.length >= 5) unlocked.add('l2_2'); // Scholar
    if (getCatAcc('logical') === 1 && attempts['logical'] >= 5) unlocked.add('l2_3'); // Bright (Perfect Logic)
    // Fast: Answer in 5s (Hard to track, use proxy: finish test in under 3 mins)
    if (iqScores.some(s => s.timeTaken < 180)) unlocked.add('l2_4'); 
    if (p.practiceSessions >= 10) unlocked.add('l2_5'); // Puzzle (Practice sessions)

    // --- Level 3 ---
    if (iqScores.some(s => s.score > 120)) unlocked.add('l3_1'); // Wise
    if (iqScores.length >= 10) unlocked.add('l3_2'); // Expert
    if (getCatAcc('numerical') === 1 && attempts['numerical'] >= 5) unlocked.add('l3_3'); // Math (Perfect Numerical)
    if (getCatAcc('spatial') === 1 && attempts['spatial'] >= 5) unlocked.add('l3_4'); // Visual (Perfect Spatial)
    // Streak: 10 correct in a row (Use proxy: test with > 25 correct)
    if (activities.some(a => a.type === 'IQ Test' && a.correct >= 25)) unlocked.add('l3_5');

    // --- Level 4 ---
    if (iqScores.some(s => s.score > 130)) unlocked.add('l4_1'); // Genius
    // Master: Top 10% (Use score > 135 as proxy)
    if (iqScores.some(s => s.score > 135)) unlocked.add('l4_2');
    // Elite: All categories > 80%
    const allCats = CONFIG.CATEGORIES;
    if (allCats.length > 0 && allCats.every(c => getCatAcc(c) >= 0.8 && attempts[c] >= 5)) unlocked.add('l4_3');
    if (iqScores.some(s => s.timeTaken < 300)) unlocked.add('l4_4'); // Speed (under 5m)
    if (activities.some(a => a.type.startsWith('Memory') && a.score >= 1000)) unlocked.add('l4_5'); // Star (Memory Score)

    // --- Level 5 ---
    if (iqScores.some(s => s.score > 145)) unlocked.add('l5_1'); // Alien
    if (iqScores.length >= 50) unlocked.add('l5_2'); // Legend
    // Oracle: 100% Accuracy (Perfect score in a test)
    if (activities.some(a => a.type === 'IQ Test' && a.correct === 30)) unlocked.add('l5_3');
    // Cosmic: Unlock all other badges
    if (unlocked.size >= 24) unlocked.add('l5_4');
    // Infinite: Play time (Use total activities count > 100 as proxy)
    if (activities.length >= 100) unlocked.add('l5_5');

    // Save back
    p.badges = Array.from(unlocked);
    saveProgress();
}

function renderBadges() {
    const container = document.getElementById('badgesContainer');
    if (!container) return;
    
    if (!currentUser.progress.badges) currentUser.progress.badges = [];
    const unlockedBadges = new Set(currentUser.progress.badges);
    
    container.innerHTML = '';
    
    for (let level = 1; level <= 5; level++) {
        const levelRow = document.createElement('div');
        levelRow.className = 'badge-level-row';
        
        const title = document.createElement('div');
        title.className = 'badge-level-title';
        title.innerHTML = `<span style="opacity: 0.7">Level ${level}</span>`;
        levelRow.appendChild(title);
        
        const grid = document.createElement('div');
        grid.className = 'badge-grid';
        
        BADGES_DATA[level].forEach(badge => {
            const isUnlocked = unlockedBadges.has(badge.id);
            const badgeEl = document.createElement('div');
            badgeEl.className = `badge-item badge-level-${level} ${isUnlocked ? 'unlocked' : 'locked'}`;
            
            // Generate SVG icon
            const svgIcon = `<svg class="badge-icon" viewBox="0 0 24 24" fill="currentColor">${getBadgeIcon(badge.type)}</svg>`;
            
            badgeEl.innerHTML = `
                <div class="badge-hexagon">
                    ${svgIcon}
                </div>
                <div class="badge-tooltip">
                    <span class="badge-name">${badge.name}</span>
                    <span class="badge-desc">${badge.desc}</span>
                    <span class="badge-status">${isUnlocked ? 'Unlocked' : 'Locked'}</span>
                </div>
            `;
            grid.appendChild(badgeEl);
        });
        
        levelRow.appendChild(grid);
        container.appendChild(levelRow);
    }
}

// ==================== CLICK SPARK ====================
class ClickSpark {
  constructor(options = {}) {
    this.sparkColor = options.sparkColor || '#fff';
    this.sparkSize = options.sparkSize || 10;
    this.sparkRadius = options.sparkRadius || 15;
    this.sparkCount = options.sparkCount || 8;
    this.duration = options.duration || 400;
    this.easing = options.easing || 'ease-out';
    this.extraScale = options.extraScale || 1.0;
    this.root = options.root || document.body;

    this.sparks = [];
    this.startTime = null;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    
    this.init();
  }

  init() {
    // Style the canvas
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.userSelect = 'none';
    this.canvas.style.zIndex = '9999'; // Ensure it's on top of other elements

    // Ensure root is relative or absolute so canvas positions correctly
    // We check if it's body because body usually doesn't need position: relative for absolute children to work if they are top/left 0
    // But for a specific container it might be needed.
    const computedStyle = getComputedStyle(this.root);
    if (computedStyle.position === 'static' && this.root !== document.body) {
      this.root.style.position = 'relative';
    }

    this.root.appendChild(this.canvas);

    this.resizeCanvas = this.resizeCanvas.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.draw = this.draw.bind(this);

    // Resize Observer
    this.resizeTimeout = null;
    this.ro = new ResizeObserver(this.handleResize);
    this.ro.observe(this.root);
    
    // Initial resize
    this.resizeCanvas();

    // Event Listener
    this.root.addEventListener('click', this.handleClick);

    // Start Animation Loop
    requestAnimationFrame(this.draw);
  }

  resizeCanvas() {
    const { width, height } = this.root.getBoundingClientRect();
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
  }

  handleResize() {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(this.resizeCanvas, 100);
  }

  easeFunc(t) {
    switch (this.easing) {
      case 'linear': return t;
      case 'ease-in': return t * t;
      case 'ease-in-out': return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      default: return t * (2 - t); // ease-out
    }
  }

  handleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const now = performance.now();
    const newSparks = Array.from({ length: this.sparkCount }, (_, i) => ({
      x,
      y,
      angle: (2 * Math.PI * i) / this.sparkCount,
      startTime: now
    }));

    this.sparks.push(...newSparks);
  }

  draw(timestamp) {
    if (!this.startTime) {
      this.startTime = timestamp;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.sparks = this.sparks.filter(spark => {
      const elapsed = timestamp - spark.startTime;
      if (elapsed >= this.duration) {
        return false;
      }

      const progress = elapsed / this.duration;
      const eased = this.easeFunc(progress);

      const distance = eased * this.sparkRadius * this.extraScale;
      const lineLength = this.sparkSize * (1 - eased);

      const x1 = spark.x + distance * Math.cos(spark.angle);
      const y1 = spark.y + distance * Math.sin(spark.angle);
      const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
      const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

      this.ctx.strokeStyle = this.sparkColor;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();

      return true;
    });

    requestAnimationFrame(this.draw);
  }
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initializeQuestionBank();
    const savedUser = readStoredJSON(CONFIG.STORAGE_KEYS.CURRENT_USER, null);
    if (savedUser && typeof savedUser === 'object' && savedUser.email) {
        currentUser = savedUser;
        if (!currentUser.isGuest) {
            const users = readStoredJSON(CONFIG.STORAGE_KEYS.USERS, {});
            if (users[currentUser.email]) currentUser.progress = users[currentUser.email].progress;
        }
    }
    updateAuthUI();
    // Initialize ClickSpark
    if (typeof ClickSpark !== 'undefined' && typeof process === 'undefined') {
        new ClickSpark({
            sparkColor: '#fff', 
            sparkSize: 10,
            sparkRadius: 15,
            sparkCount: 8,
            duration: 400,
            easing: 'ease-out',
            extraScale: 1.0,
            root: document.body
        });
    }
    console.log('IQ Arena initialized successfully');
});

// ==================== VERIFICATION & TESTING (NODE.JS ONLY) ====================
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    // Run verification tests immediately when executed in Node.js
    console.log('=== VERIFICATION START ===');
    
    function testAge(age, expectedDiff) {
        console.log(`\nTesting Age: ${age} (Expected: ${expectedDiff})`);
        
        // Test getDifficulty
        const diff = getDifficulty(age);
        console.log(`getDifficulty(${age}) = ${diff}`);
        if (diff !== expectedDiff) {
            console.error(`FAIL: Expected difficulty ${expectedDiff}, got ${diff}`);
            return;
        }

        // Test generateNumericalQuestions
        console.log('Testing generateNumericalQuestions...');
        const questions = generateNumericalQuestions(age);
        console.log(`Generated ${questions.length} numerical questions.`);
        
        if (questions.length === 0) {
            console.error('FAIL: No questions generated.');
            return;
        }

        // Analyze questions based on difficulty
        const sample = questions[0];
        console.log(`Sample Question: ${sample.q} | Answer: ${sample.options[sample.answer]}`);

        if (expectedDiff === 'easy') {
            // Expect addition/subtraction, small numbers
            const isEasy = questions.every(q => q.q.includes('+') || q.q.includes('-'));
            console.log(`All questions are Add/Sub? ${isEasy}`);
            if (!isEasy) console.error('FAIL: Easy questions should be Add/Sub');
        } else if (expectedDiff === 'medium') {
            // Expect Add/Sub/Mul
            const ops = new Set(questions.map(q => {
                if (q.q.includes('+')) return '+';
                if (q.q.includes('-')) return '-';
                if (q.q.includes('×')) return '×';
                return 'other';
            }));
            console.log(`Operators found: ${Array.from(ops).join(', ')}`);
        } else if (expectedDiff === 'hard') {
            // Hard
            // Check for tricky questions
            const tricky = questions.filter(q => String(q.id || '').includes('trick'));
            console.log(`Tricky questions count: ${tricky.length}`);
            if (tricky.length === 0) console.error('FAIL: Hard difficulty should include tricky questions');
        }
    }

    // Run Test Cases
    testAge(8, 'simple');
    testAge(14, 'medium');
    testAge(25, 'hard');
    
    console.log('=== VERIFICATION END ===');
}

// ==================== OPENING SEQUENCE ====================
if (typeof process === 'undefined') document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('opening-overlay');
    const bar = document.getElementById('opening-bar');
    const status = document.getElementById('opening-status');
    const particleCanvas = document.getElementById('opening-particles');
    
    if (!overlay || !bar || !status) return;

    // --- Particle System ---
    if (particleCanvas) {
        const ctx = particleCanvas.getContext('2d');
        let width, height;
        let particles = [];
        let mouse = { x: null, y: null, radius: 150 };
        
        function resize() {
            width = particleCanvas.width = window.innerWidth;
            height = particleCanvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 1.5; 
                this.vy = (Math.random() - 0.5) * 1.5;
                this.size = Math.random() * 2 + 1;
                this.baseColor = Math.random() > 0.5 ? '#6366f1' : '#22d3ee';
                this.color = this.baseColor;
            }
            update() {
                // Mouse interaction
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance > 0 && distance < mouse.radius) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouse.radius - distance) / mouse.radius;
                        const directionX = forceDirectionX * force * 3;
                        const directionY = forceDirectionY * force * 3;
                        this.x -= directionX;
                        this.y -= directionY;
                    }
                }

                this.x += this.vx;
                this.y += this.vy;

                // Wrap around screen
                if (this.x < 0) this.x = width;
                else if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                else if (this.y > height) this.y = 0;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Create particles
        for (let i = 0; i < 80; i++) particles.push(new Particle());

        function animateParticles() {
            if (overlay.classList.contains('opening-complete')) return;

            ctx.clearRect(0, 0, width, height);
            
            // Draw connections
            ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
            ctx.lineWidth = 1;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }


    // --- Typewriter Effect ---
    let typeInterval = null;
    function typeText(text, callback) {
        if (typeInterval) clearInterval(typeInterval);
        let i = 0;
        status.innerHTML = ''; // Clear previous
        
        const cursor = document.createElement('span');
        cursor.className = 'cursor-blink';
        cursor.textContent = '█';
        status.appendChild(cursor);

        typeInterval = setInterval(() => {
            if (i < text.length) {
                status.insertBefore(document.createTextNode(text.charAt(i)), cursor);
                i++;
            } else {
                clearInterval(typeInterval);
                if (callback) setTimeout(callback, 200);
            }
        }, 12); // Faster typing for a snappier launch
    }

    // --- Reliable, bounded loading sequence ---
    // This is a visual intro, not a real network-loading indicator. Keep it
    // short and guarantee that a slow/blocked animation cannot trap the user.
    const statuses = [
        { p: 0, text: "INITIALIZING NEURAL INTERFACE..." },
        { p: 25, text: "LOADING COGNITIVE ASSETS..." },
        { p: 50, text: "CALIBRATING COGNITIVE SYSTEMS..." },
        { p: 75, text: "SYNCHRONIZING INTERFACE..." },
        { p: 95, text: "SYSTEM READY" }
    ];
    const duration = 1800;
    const startedAt = performance.now();
    let currentStatusIdx = -1;
    let finished = false;

    function finishOpening() {
        if (finished) return;
        finished = true;
        if (typeInterval) clearInterval(typeInterval);
        bar.style.width = '100%';
        status.textContent = 'ACCESS GRANTED';
        status.style.color = 'var(--success)';
        status.style.textShadow = '0 0 20px var(--success)';
        overlay.classList.add('opening-complete');

        const homeSection = document.getElementById('home-section');
        if (homeSection) {
            homeSection.querySelectorAll('.fade-in, .slide-up').forEach(el => {
                el.style.animation = 'none';
                void el.offsetHeight;
                el.style.animation = null;
            });
        }
        window.setTimeout(() => { overlay.style.display = 'none'; }, 900);
    }

    function tick(now) {
        if (finished || !overlay.isConnected) return;
        const progress = Math.min(100, ((now - startedAt) / duration) * 100);
        bar.style.width = `${progress}%`;
        const nextIdx = statuses.reduce((found, item, idx) => progress >= item.p ? idx : found, 0);
        if (nextIdx !== currentStatusIdx) {
            currentStatusIdx = nextIdx;
            // Update immediately rather than repeatedly restarting a typewriter,
            // which could leave only a few letters visible on slower devices.
            status.textContent = statuses[nextIdx].text;
        }
        if (progress >= 100) {
            window.setTimeout(finishOpening, 250);
            return;
        }
        window.requestAnimationFrame(tick);
    }

    // Hard fallback: even if requestAnimationFrame is throttled in a background
    // tab, the intro is dismissed as soon as the page becomes active again.
    const fallbackTimer = window.setTimeout(finishOpening, 5000);
    window.addEventListener('pageshow', () => {
        if (!finished && document.visibilityState === 'visible' && bar.style.width === '100%') {
            clearTimeout(fallbackTimer);
            finishOpening();
        }
    }, { once: true });
    window.requestAnimationFrame(tick);
    window.setTimeout(() => { if (!finished) finishOpening(); }, 5000);

});
