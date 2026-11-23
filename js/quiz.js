/**
 * Smart Quiz Application - Quiz Engine (quiz.js)
 * Manages question rendering, answer selection, timer, palette navigation, and modal confirmation.
 */

// Quiz Session State
let quizQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = []; // Array of indices (0-3) or null
let timerInterval = null;
let timeRemaining = 600; // in seconds
let totalTimeLimit = 600;
let quizStartTime = null;
let selectedCategoryKey = '';
let currentCategory = null;
let activeStudent = null;

document.addEventListener('DOMContentLoaded', () => {
    initQuizSession();
});

/**
 * Initializes the quiz session, validates student login and category.
 */
function initQuizSession() {
    activeStudent = getUser();
    if (!activeStudent || !activeStudent.name || !activeStudent.name.trim()) {
        showToast('Please enter your name to begin the quiz.', 'warning');
        setTimeout(() => {
            window.location.href = 'student.html';
        }, 800);
        return;
    }

    selectedCategoryKey = getSelectedCategory();
    currentCategory = quizData[selectedCategoryKey];

    if (!currentCategory) {
        showToast('Selected category not found. Redirecting to selection...', 'danger');
        setTimeout(() => {
            window.location.href = 'student.html';
        }, 1000);
        return;
    }

    // Prepare randomized questions and options
    quizQuestions = prepareQuizQuestions(selectedCategoryKey, true, true);
    if (!quizQuestions.length) {
        showToast('No questions found for this category.', 'danger');
        return;
    }

    // Initialize answer tracking
    userAnswers = new Array(quizQuestions.length).fill(null);
    currentQuestionIndex = 0;
    totalTimeLimit = currentCategory.timeLimit || 600;
    timeRemaining = totalTimeLimit;
    quizStartTime = Date.now();

    // Setup Header & Metadata UI
    setupQuizHeader();

    // Render palette and first question
    renderQuestionPalette();
    renderCurrentQuestion();

    // Start timer
    startQuizTimer();

    // Attach control listeners
    setupQuizEventListeners();
}

/**
 * Updates UI with student name, category details, and initial time.
 */
function setupQuizHeader() {
    const studentNameEl = document.getElementById('quiz-student-name');
    if (studentNameEl) studentNameEl.textContent = activeStudent.name;

    const catTitleEl = document.getElementById('quiz-category-title');
    if (catTitleEl) {
        catTitleEl.innerHTML = `
            <i class="${currentCategory.icon || 'fa-solid fa-graduation-cap'}" style="color: ${currentCategory.color || '#3b82f6'}; margin-right: 8px;"></i>
            <span>${escapeHtml(currentCategory.name)}</span>
        `;
    }

    const totalQuestionsEl = document.getElementById('quiz-total-questions');
    if (totalQuestionsEl) totalQuestionsEl.textContent = quizQuestions.length;

    updateTimerDisplay();
}

/**
 * Renders the question number palette for quick jump and status overview.
 */
function renderQuestionPalette() {
    const paletteContainer = document.getElementById('question-palette');
    if (!paletteContainer) return;

    paletteContainer.innerHTML = '';
    quizQuestions.forEach((_, idx) => {
        const itemBtn = document.createElement('button');
        itemBtn.className = 'palette-item';
        itemBtn.setAttribute('data-index', idx);
        itemBtn.setAttribute('aria-label', `Go to Question ${idx + 1}`);
        itemBtn.innerHTML = `<span>${idx + 1}</span>`;

        if (idx === currentQuestionIndex) {
            itemBtn.classList.add('current');
        }
        if (userAnswers[idx] !== null) {
            itemBtn.classList.add('answered');
        }

        itemBtn.addEventListener('click', () => {
            jumpToQuestion(idx);
        });

        paletteContainer.appendChild(itemBtn);
    });

    updateSummaryPills();
}

/**
 * Update the question palette status classes.
 */
function updatePaletteClasses() {
    const paletteItems = document.querySelectorAll('.palette-item');
    paletteItems.forEach((btn, idx) => {
        btn.classList.remove('current', 'answered', 'unanswered');

        if (idx === currentQuestionIndex) {
            btn.classList.add('current');
        }

        if (userAnswers[idx] !== null) {
            btn.classList.add('answered');
        } else {
            btn.classList.add('unanswered');
        }
    });

    updateSummaryPills();
}

/**
 * Updates the answered/remaining badge counters.
 */
function updateSummaryPills() {
    const answeredCount = userAnswers.filter(a => a !== null).length;
    const remainingCount = quizQuestions.length - answeredCount;

    const answeredEl = document.getElementById('palette-answered-count');
    if (answeredEl) answeredEl.textContent = answeredCount;

    const remainingEl = document.getElementById('palette-remaining-count');
    if (remainingEl) remainingEl.textContent = remainingCount;
}

/**
 * Renders the current question and its four answer options.
 */
function renderCurrentQuestion() {
    if (!quizQuestions.length) return;
    const q = quizQuestions[currentQuestionIndex];

    // Update Question counter
    const currentNumEl = document.getElementById('current-question-num');
    if (currentNumEl) currentNumEl.textContent = currentQuestionIndex + 1;

    // Update Progress Bar
    const progressBar = document.getElementById('quiz-progress-bar');
    if (progressBar) {
        const progressPct = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
        progressBar.style.width = `${progressPct}%`;
    }

    // Update Question Text
    const questionTextEl = document.getElementById('question-text');
    if (questionTextEl) {
        questionTextEl.textContent = q.question;
    }

    // Render 4 Options
    const optionsContainer = document.getElementById('options-container');
    if (optionsContainer) {
        optionsContainer.innerHTML = '';
        const optionPrefixes = ['A', 'B', 'C', 'D'];

        q.options.forEach((optText, optIdx) => {
            const isSelected = userAnswers[currentQuestionIndex] === optIdx;

            const optCard = document.createElement('div');
            optCard.className = `option-card ${isSelected ? 'selected' : ''}`;
            optCard.setAttribute('role', 'radio');
            optCard.setAttribute('aria-checked', isSelected ? 'true' : 'false');
            optCard.setAttribute('tabindex', '0');

            optCard.innerHTML = `
                <div class="option-prefix">${optionPrefixes[optIdx]}</div>
                <div class="option-text">${escapeHtml(optText)}</div>
                <div class="option-check">
                    <i class="fa-solid fa-check"></i>
                </div>
            `;

            // Click listener to select option
            optCard.addEventListener('click', () => {
                selectAnswer(optIdx);
            });

            // Keyboard accessibility (Enter/Space)
            optCard.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectAnswer(optIdx);
                }
            });

            optionsContainer.appendChild(optCard);
        });
    }

    // Update Prev / Next / Submit button visibility
    const prevBtn = document.getElementById('prev-question-btn');
    if (prevBtn) {
        prevBtn.disabled = currentQuestionIndex === 0;
    }

    const nextBtn = document.getElementById('next-question-btn');
    const submitBtn = document.getElementById('submit-quiz-btn');

    if (currentQuestionIndex === quizQuestions.length - 1) {
        if (nextBtn) nextBtn.style.display = 'none';
        if (submitBtn) submitBtn.style.display = 'inline-flex';
    } else {
        if (nextBtn) nextBtn.style.display = 'inline-flex';
        if (submitBtn) submitBtn.style.display = 'none';
    }

    updatePaletteClasses();
}

/**
 * Handle user option selection
 * @param {number} optionIndex (0 to 3)
 */
function selectAnswer(optionIndex) {
    userAnswers[currentQuestionIndex] = optionIndex;
    renderCurrentQuestion();
}

/**
 * Clears the selected answer for the current question
 */
function clearCurrentChoice() {
    if (userAnswers[currentQuestionIndex] !== null) {
        userAnswers[currentQuestionIndex] = null;
        renderCurrentQuestion();
        showToast('Answer cleared for this question.', 'info');
    }
}

/**
 * Navigate to next question
 */
function nextQuestion() {
    if (currentQuestionIndex < quizQuestions.length - 1) {
        currentQuestionIndex++;
        renderCurrentQuestion();
    }
}

/**
 * Navigate to previous question
 */
function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderCurrentQuestion();
    }
}

/**
 * Jump to a specific question from the palette
 * @param {number} targetIndex 
 */
function jumpToQuestion(targetIndex) {
    if (targetIndex >= 0 && targetIndex < quizQuestions.length) {
        currentQuestionIndex = targetIndex;
        renderCurrentQuestion();
    }
}

// ==========================================
// Timer Management
// ==========================================
function startQuizTimer() {
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            timeRemaining = 0;
            updateTimerDisplay();
            showToast('Time is up! Submitting your quiz...', 'warning', 4000);
            setTimeout(() => {
                finalizeAndSubmit(true);
            }, 1000);
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timerDisplay = document.getElementById('quiz-timer');
    if (!timerDisplay) return;

    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    timerDisplay.innerHTML = `<i class="fa-regular fa-clock"></i> <span>${formattedTime}</span>`;

    // Alert visually when under 60 seconds
    const timerBadge = document.querySelector('.timer-badge');
    if (timerBadge) {
        if (timeRemaining <= 60) {
            timerBadge.classList.add('timer-warning');
        } else {
            timerBadge.classList.remove('timer-warning');
        }
    }
}

// ==========================================
// Event Listeners Setup
// ==========================================
function setupQuizEventListeners() {
    const prevBtn = document.getElementById('prev-question-btn');
    if (prevBtn) prevBtn.addEventListener('click', prevQuestion);

    const nextBtn = document.getElementById('next-question-btn');
    if (nextBtn) nextBtn.addEventListener('click', nextQuestion);

    const clearBtn = document.getElementById('clear-choice-btn');
    if (clearBtn) clearBtn.addEventListener('click', clearCurrentChoice);

    const submitBtn = document.getElementById('submit-quiz-btn');
    if (submitBtn) submitBtn.addEventListener('click', openSubmitConfirmationModal);

    const headerSubmitBtn = document.getElementById('header-submit-btn');
    if (headerSubmitBtn) headerSubmitBtn.addEventListener('click', openSubmitConfirmationModal);

    // Modal buttons
    const cancelModalBtn = document.getElementById('modal-cancel-btn');
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeSubmitConfirmationModal);

    const confirmModalBtn = document.getElementById('modal-confirm-submit-btn');
    if (confirmModalBtn) confirmModalBtn.addEventListener('click', () => {
        closeSubmitConfirmationModal();
        finalizeAndSubmit(false);
    });

    // Close modal on backdrop click
    const modalBackdrop = document.getElementById('submit-modal');
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) {
                closeSubmitConfirmationModal();
            }
        });
    }

    // Keyboard shortcuts: Left/Right arrows for nav
    document.addEventListener('keydown', (e) => {
        // Only if modal is not open
        if (modalBackdrop && modalBackdrop.classList.contains('modal-active')) return;

        if (e.key === 'ArrowRight' && currentQuestionIndex < quizQuestions.length - 1) {
            nextQuestion();
        } else if (e.key === 'ArrowLeft' && currentQuestionIndex > 0) {
            prevQuestion();
        } else if (['1', '2', '3', '4'].includes(e.key)) {
            const optIndex = parseInt(e.key, 10) - 1;
            selectAnswer(optIndex);
        }
    });

    // Prevent accidental page leave
    window.addEventListener('beforeunload', handleBeforeUnload);
}

function handleBeforeUnload(e) {
    // Only warn if quiz is in progress
    if (timeRemaining > 0 && userAnswers.some(a => a !== null)) {
        e.preventDefault();
        e.returnValue = 'Quiz in progress! Leaving will lose your current answers.';
        return e.returnValue;
    }
}

// ==========================================
// Submit Confirmation Modal
// ==========================================
function openSubmitConfirmationModal() {
    const modal = document.getElementById('submit-modal');
    if (!modal) {
        finalizeAndSubmit(false);
        return;
    }

    const answeredCount = userAnswers.filter(a => a !== null).length;
    const unansweredCount = quizQuestions.length - answeredCount;

    const modalAnsweredEl = document.getElementById('modal-answered-count');
    if (modalAnsweredEl) modalAnsweredEl.textContent = answeredCount;

    const modalUnansweredEl = document.getElementById('modal-unanswered-count');
    if (modalUnansweredEl) modalUnansweredEl.textContent = unansweredCount;

    const modalWarningEl = document.getElementById('modal-unanswered-warning');
    if (modalWarningEl) {
        if (unansweredCount > 0) {
            modalWarningEl.style.display = 'flex';
            modalWarningEl.innerHTML = `
                <i class="fa-solid fa-triangle-exclamation"></i>
                <span>You have <strong>${unansweredCount}</strong> unanswered question(s). Are you sure you want to finish now?</span>
            `;
        } else {
            modalWarningEl.style.display = 'none';
        }
    }

    modal.classList.add('modal-active');
}

function closeSubmitConfirmationModal() {
    const modal = document.getElementById('submit-modal');
    if (modal) modal.classList.remove('modal-active');
}

// ==========================================
// Quiz Finalization & Score Calculation
// ==========================================
function finalizeAndSubmit(isAutoSubmit = false) {
    if (timerInterval) clearInterval(timerInterval);
    window.removeEventListener('beforeunload', handleBeforeUnload);

    const totalQuestions = quizQuestions.length;
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    const answersReview = quizQuestions.map((q, idx) => {
        const userChoiceIndex = userAnswers[idx];
        const isAnswered = userChoiceIndex !== null;
        const isCorrect = isAnswered && (userChoiceIndex === q.answer);

        if (!isAnswered) {
            unansweredCount++;
        } else if (isCorrect) {
            correctCount++;
        } else {
            wrongCount++;
        }

        return {
            questionId: q.id,
            questionText: q.question,
            options: q.options,
            userChoiceIndex: userChoiceIndex,
            userChoiceText: isAnswered ? q.options[userChoiceIndex] : null,
            correctAnswerIndex: q.answer,
            correctAnswerText: q.options[q.answer],
            isCorrect: isCorrect,
            isAnswered: isAnswered,
            explanation: q.explanation
        };
    });

    const score = correctCount; // 1 mark per correct answer
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const timeTakenSeconds = Math.max(0, totalTimeLimit - timeRemaining);
    const timeTakenMinutes = Math.floor(timeTakenSeconds / 60);
    const timeTakenSecs = timeTakenSeconds % 60;
    const formattedTimeTaken = `${timeTakenMinutes}m ${timeTakenSecs}s`;

    // Performance evaluation message
    let performanceBadge = 'Needs Practice';
    let performanceMessage = 'Don\'t give up! Review your mistakes and try again.';
    let grade = 'D';

    if (percentage >= 90) {
        performanceBadge = 'Outstanding Master';
        performanceMessage = 'Phenomenal work! You have truly mastered this topic.';
        grade = 'A+';
    } else if (percentage >= 75) {
        performanceBadge = 'Great Performance';
        performanceMessage = 'Impressive score! You have a solid grasp of these concepts.';
        grade = 'A';
    } else if (percentage >= 60) {
        performanceBadge = 'Good Effort';
        performanceMessage = 'Good job! A little more practice will help you achieve mastery.';
        grade = 'B';
    } else if (percentage >= 40) {
        performanceBadge = 'Fair Effort';
        performanceMessage = 'You passed, but reviewing key explanations will boost your score.';
        grade = 'C';
    }

    const resultRecord = {
        id: 'quiz_' + Date.now(),
        studentName: activeStudent.name,
        categoryKey: selectedCategoryKey,
        categoryName: currentCategory.name,
        totalQuestions: totalQuestions,
        correctCount: correctCount,
        wrongCount: wrongCount,
        unansweredCount: unansweredCount,
        score: score,
        percentage: percentage,
        grade: grade,
        performanceBadge: performanceBadge,
        performanceMessage: performanceMessage,
        timeTaken: formattedTimeTaken,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        timestamp: Date.now(),
        isAutoSubmitted: isAutoSubmit,
        answersReview: answersReview
    };

    // Save to localStorage
    saveQuizResult(resultRecord);

    // Redirect to Result Page
    window.location.href = 'result.html';
}
