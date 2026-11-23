/**
 * Smart Quiz Application - Result Engine (result.js)
 * Renders student score, performance metrics, celebration confetti, and full question review with explanations.
 */

document.addEventListener('DOMContentLoaded', () => {
    initResultPage();
});

let currentResult = null;
let currentFilter = 'all';

function initResultPage() {
    currentResult = getCurrentResult();

    if (!currentResult) {
        showToast('No recent quiz result found. Redirecting to home...', 'warning');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        return;
    }

    // Populate Results UI
    renderSummaryHeader();
    renderScoreCard();
    renderMetricCards();
    renderDetailedReview();
    setupResultActionButtons();

    // Trigger celebration if passed (>= 60%)
    if (currentResult.percentage >= 60) {
        launchCelebrationConfetti();
    }
}

/**
 * Renders student name, category, and date
 */
function renderSummaryHeader() {
    const nameEl = document.getElementById('result-student-name');
    if (nameEl) nameEl.textContent = currentResult.studentName || 'Student';

    const catEl = document.getElementById('result-category-name');
    if (catEl) catEl.textContent = currentResult.categoryName || 'Quiz';

    const dateEl = document.getElementById('result-date');
    if (dateEl) dateEl.textContent = currentResult.date || new Date().toLocaleDateString();

    const timeTakenEl = document.getElementById('result-time-taken');
    if (timeTakenEl) timeTakenEl.textContent = currentResult.timeTaken || '--';
}

/**
 * Renders circular score chart, grade, and encouragement message
 */
function renderScoreCard() {
    const pct = currentResult.percentage || 0;

    // Percentage text
    const percentageEl = document.getElementById('score-percentage');
    if (percentageEl) {
        animateCounter(percentageEl, 0, pct, 1200, '%');
    }

    // Fraction score (e.g. 8 / 10)
    const fractionEl = document.getElementById('score-fraction');
    if (fractionEl) {
        fractionEl.textContent = `${currentResult.correctCount} / ${currentResult.totalQuestions}`;
    }

    // Grade badge
    const gradeBadgeEl = document.getElementById('result-grade-badge');
    if (gradeBadgeEl) {
        gradeBadgeEl.textContent = currentResult.grade || 'A';
    }

    // Performance title & message
    const perfTitleEl = document.getElementById('performance-title');
    if (perfTitleEl) {
        perfTitleEl.textContent = currentResult.performanceBadge || 'Performance Summary';
    }

    const perfDescEl = document.getElementById('performance-description');
    if (perfDescEl) {
        perfDescEl.textContent = currentResult.performanceMessage || '';
    }

    // Animate circular SVG stroke
    const circleRing = document.getElementById('score-circle-progress');
    if (circleRing) {
        const radius = circleRing.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        circleRing.style.strokeDasharray = `${circumference} ${circumference}`;
        circleRing.style.strokeDashoffset = circumference;

        setTimeout(() => {
            const offset = circumference - (pct / 100) * circumference;
            circleRing.style.strokeDashoffset = offset;
        }, 150);
    }
}

/**
 * Renders the 4 summary statistics cards
 */
function renderMetricCards() {
    const totalEl = document.getElementById('metric-total');
    if (totalEl) totalEl.textContent = currentResult.totalQuestions;

    const correctEl = document.getElementById('metric-correct');
    if (correctEl) correctEl.textContent = currentResult.correctCount;

    const wrongEl = document.getElementById('metric-wrong');
    if (wrongEl) wrongEl.textContent = currentResult.wrongCount;

    const unansEl = document.getElementById('metric-unanswered');
    if (unansEl) unansEl.textContent = currentResult.unansweredCount;
}

/**
 * Renders the full question-by-question review section with explanations
 */
function renderDetailedReview() {
    const reviewContainer = document.getElementById('review-list-container');
    if (!reviewContainer || !currentResult.answersReview) return;

    reviewContainer.innerHTML = '';

    const filteredReviews = currentResult.answersReview.filter(item => {
        if (currentFilter === 'correct') return item.isCorrect;
        if (currentFilter === 'wrong') return item.isAnswered && !item.isCorrect;
        if (currentFilter === 'skipped') return !item.isAnswered;
        return true; // 'all'
    });

    if (!filteredReviews.length) {
        reviewContainer.innerHTML = `
            <div class="empty-filter-state">
                <i class="fa-solid fa-list-check"></i>
                <p>No questions match the "${currentFilter}" filter.</p>
            </div>
        `;
        return;
    }

    filteredReviews.forEach((item, displayIdx) => {
        const card = document.createElement('div');
        let statusClass = 'status-correct';
        let statusBadge = '<span class="review-status-badge correct"><i class="fa-solid fa-check"></i> Correct</span>';

        if (!item.isAnswered) {
            statusClass = 'status-skipped';
            statusBadge = '<span class="review-status-badge skipped"><i class="fa-solid fa-circle-minus"></i> Skipped</span>';
        } else if (!item.isCorrect) {
            statusClass = 'status-wrong';
            statusBadge = '<span class="review-status-badge wrong"><i class="fa-solid fa-xmark"></i> Incorrect</span>';
        }

        card.className = `review-card ${statusClass}`;

        const optionPrefixes = ['A', 'B', 'C', 'D'];
        let optionsHtml = '';

        item.options.forEach((optText, optIdx) => {
            let optClass = 'review-option';
            let iconBadge = '';

            const isCorrectAnswer = optIdx === item.correctAnswerIndex;
            const isUserChoice = optIdx === item.userChoiceIndex;

            if (isCorrectAnswer) {
                optClass += ' correct-option';
                iconBadge = '<span class="option-tag tag-correct"><i class="fa-solid fa-check"></i> Correct Answer</span>';
            }

            if (isUserChoice && !isCorrectAnswer) {
                optClass += ' wrong-option';
                iconBadge = '<span class="option-tag tag-wrong"><i class="fa-solid fa-xmark"></i> Your Answer</span>';
            } else if (isUserChoice && isCorrectAnswer) {
                iconBadge = '<span class="option-tag tag-correct"><i class="fa-solid fa-circle-check"></i> Your Correct Choice</span>';
            }

            optionsHtml += `
                <div class="${optClass}">
                    <span class="review-opt-prefix">${optionPrefixes[optIdx]}</span>
                    <span class="review-opt-text">${escapeHtml(optText)}</span>
                    ${iconBadge}
                </div>
            `;
        });

        card.innerHTML = `
            <div class="review-card-header">
                <span class="review-question-num">Question ${displayIdx + 1}</span>
                ${statusBadge}
            </div>
            <h4 class="review-question-text">${escapeHtml(item.questionText)}</h4>
            <div class="review-options-list">
                ${optionsHtml}
            </div>
            <div class="review-explanation-box">
                <div class="explanation-title">
                    <i class="fa-regular fa-lightbulb"></i>
                    <strong>Explanation:</strong>
                </div>
                <p class="explanation-text">${escapeHtml(item.explanation || 'No explanation available.')}</p>
            </div>
        `;

        reviewContainer.appendChild(card);
    });
}

/**
 * Filter buttons (All, Correct, Wrong, Skipped)
 */
function setupFilterTabs() {
    const filterButtons = document.querySelectorAll('.review-filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter') || 'all';
            renderDetailedReview();
        });
    });
}

/**
 * Attach listeners for Restart, Choose Category, Dashboard, and Print
 */
function setupResultActionButtons() {
    setupFilterTabs();

    const retakeBtn = document.getElementById('retake-quiz-btn');
    if (retakeBtn) {
        retakeBtn.addEventListener('click', () => {
            // Re-use current category and student
            setSelectedCategory(currentResult.categoryKey);
            window.location.href = 'quiz.html';
        });
    }

    const changeCategoryBtn = document.getElementById('choose-category-btn');
    if (changeCategoryBtn) {
        changeCategoryBtn.addEventListener('click', () => {
            window.location.href = 'student.html';
        });
    }

    const dashboardBtn = document.getElementById('view-dashboard-btn');
    if (dashboardBtn) {
        dashboardBtn.addEventListener('click', () => {
            window.location.href = 'dashboard.html';
        });
    }

    const printBtn = document.getElementById('print-result-btn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }
}

/**
 * Simple number counter animation
 */
function animateCounter(element, start, end, duration, suffix = '') {
    if (!element) return;
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuad = 1 - (1 - progress) * (1 - progress);
        const currentVal = Math.round(start + (end - start) * easeOutQuad);

        element.textContent = `${currentVal}${suffix}`;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = `${end}${suffix}`;
        }
    }

    requestAnimationFrame(updateCounter);
}

/**
 * Lightweight canvas confetti particle animation
 */
function launchCelebrationConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    const particleCount = 80;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height / 3,
            vx: (Math.random() - 0.5) * 14,
            vy: (Math.random() - 0.7) * 16,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            gravity: 0.35,
            opacity: 1
        });
    }

    let frame = 0;
    function renderConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let activeParticles = 0;
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.rotation += p.rotationSpeed;
            p.opacity -= 0.008;

            if (p.opacity > 0) {
                activeParticles++;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = Math.max(0, p.opacity);
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                ctx.restore();
            }
        });

        frame++;
        if (activeParticles > 0 && frame < 200) {
            requestAnimationFrame(renderConfetti);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    renderConfetti();
}
