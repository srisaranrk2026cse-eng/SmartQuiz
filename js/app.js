
/**
 * Smart Quiz Application - Global Core Utilities (app.js)
 * Manages Theme (Dark/Light), Local Storage, User Session, Toasts, and Global Navigation.
 */

// Local Storage Keys
const STORAGE_KEYS = {
    THEME: 'smartQuiz_theme',
    USER: 'smartQuiz_user',
    CATEGORY: 'smartQuiz_selectedCategory',
    HISTORY: 'smartQuiz_history',
    CURRENT_RESULT: 'smartQuiz_currentResult'
};

// ==========================================
// 1. Theme Management (Dark / Light Mode)
// ==========================================
function initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 
        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    applyTheme(savedTheme);

    // Attach listeners to all theme toggle buttons on the page
    const themeToggles = document.querySelectorAll('.theme-toggle-btn');
    themeToggles.forEach(btn => {
        btn.addEventListener('click', toggleTheme);
    });
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEYS.THEME, theme);

    // Update toggle button icons & aria-label
    const themeToggles = document.querySelectorAll('.theme-toggle-btn');
    themeToggles.forEach(btn => {
        const icon = btn.querySelector('i');
        const text = btn.querySelector('.theme-text');
        if (theme === 'dark') {
            if (icon) icon.className = 'fa-solid fa-sun';
            if (text) text.textContent = 'Light Mode';
            btn.setAttribute('aria-label', 'Switch to Light Mode');
            btn.setAttribute('title', 'Switch to Light Mode');
        } else {
            if (icon) icon.className = 'fa-solid fa-moon';
            if (text) text.textContent = 'Dark Mode';
            btn.setAttribute('aria-label', 'Switch to Dark Mode');
            btn.setAttribute('title', 'Switch to Dark Mode');
        }
    });
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
}

// ==========================================
// 2. Local Storage Helpers for User & State
// ==========================================

/** Get currently active student details */
function getUser() {
    try {
        const user = localStorage.getItem(STORAGE_KEYS.USER);
        return user ? JSON.parse(user) : null;
    } catch (e) {
        console.error('Error reading user data:', e);
        return null;
    }
}

/** Save student details */
function setUser(userObj) {
    try {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userObj));
    } catch (e) {
        console.error('Error saving user data:', e);
    }
}

/** Clear active user */
function clearUser() {
    localStorage.removeItem(STORAGE_KEYS.USER);
}

/** Get selected category key (e.g., 'python') */
function getSelectedCategory() {
    return localStorage.getItem(STORAGE_KEYS.CATEGORY) || 'cpp';
}

/** Save selected category key */
function setSelectedCategory(categoryKey) {
    localStorage.setItem(STORAGE_KEYS.CATEGORY, categoryKey);
}

/** Retrieve all quiz attempt history */
function getQuizHistory() {
    try {
        const history = localStorage.getItem(STORAGE_KEYS.HISTORY);
        return history ? JSON.parse(history) : [];
    } catch (e) {
        console.error('Error reading quiz history:', e);
        return [];
    }
}

/** Save a new quiz result to history */
function saveQuizResult(resultRecord) {
    try {
        const history = getQuizHistory();
        history.unshift(resultRecord); // Add latest to front
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
        localStorage.setItem(STORAGE_KEYS.CURRENT_RESULT, JSON.stringify(resultRecord));
    } catch (e) {
        console.error('Error saving quiz result:', e);
    }
}

/** Get the latest result for display on result.html */
function getCurrentResult() {
    try {
        const res = localStorage.getItem(STORAGE_KEYS.CURRENT_RESULT);
        return res ? JSON.parse(res) : null;
    } catch (e) {
        console.error('Error reading current result:', e);
        return null;
    }
}

/** Delete a single quiz history item */
function deleteQuizHistoryItem(id) {
    try {
        let history = getQuizHistory();
        history = history.filter(item => item.id !== id);
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (e) {
        console.error('Error deleting quiz history item:', e);
    }
}

/** Clear all quiz history */
function clearAllQuizHistory() {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_RESULT);
}

/**
 * Calculates aggregate stats from history
 * Returns: { totalQuizzes, highestScore, averageScore, totalQuestionsAnswered, categoryStats }
 */
function getOverallStats() {
    const history = getQuizHistory();
    if (!history.length) {
        return {
            totalQuizzes: 0,
            highestScore: 0,
            averageScore: 0,
            totalQuestionsAnswered: 0,
            categoryStats: {}
        };
    }

    let highestScore = 0;
    let totalScoreSum = 0;
    let totalQuestionsAnswered = 0;
    const categoryStats = {};

    history.forEach(item => {
        const pct = item.percentage || 0;
        if (pct > highestScore) highestScore = pct;
        totalScoreSum += pct;
        totalQuestionsAnswered += (item.totalQuestions || 0);

        const catKey = item.categoryKey || 'other';
        if (!categoryStats[catKey]) {
            categoryStats[catKey] = {
                categoryName: item.categoryName || catKey,
                count: 0,
                totalPercentage: 0,
                highestScore: 0
            };
        }
        categoryStats[catKey].count += 1;
        categoryStats[catKey].totalPercentage += pct;
        if (pct > categoryStats[catKey].highestScore) {
            categoryStats[catKey].highestScore = pct;
        }
    });

    const averageScore = Math.round(totalScoreSum / history.length);

    // Calculate per-category average
    Object.keys(categoryStats).forEach(key => {
        const cat = categoryStats[key];
        cat.avgPercentage = Math.round(cat.totalPercentage / cat.count);
    });

    return {
        totalQuizzes: history.length,
        highestScore: Math.round(highestScore),
        averageScore: averageScore,
        totalQuestionsAnswered: totalQuestionsAnswered,
        categoryStats: categoryStats
    };
}

// ==========================================
// 3. UI Toast Notification Utility
// ==========================================
function showToast(message, type = 'info', duration = 3000) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type} toast-enter`;

    const iconMap = {
        success: 'fa-solid fa-circle-check',
        danger: 'fa-solid fa-triangle-exclamation',
        warning: 'fa-solid fa-circle-exclamation',
        info: 'fa-solid fa-circle-info'
    };

    const iconClass = iconMap[type] || iconMap.info;

    toast.innerHTML = `
        <i class="${iconClass}"></i>
        <span class="toast-message">${escapeHtml(message)}</span>
        <button class="toast-close" aria-label="Close">&times;</button>
    `;

    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.remove('toast-enter');
        toast.classList.add('toast-show');
    });

    const removeToast = () => {
        toast.classList.remove('toast-show');
        toast.classList.add('toast-exit');
        setTimeout(() => {
            if (toast.parentElement) toast.parentElement.removeChild(toast);
        }, 300);
    };

    toast.querySelector('.toast-close').addEventListener('click', removeToast);
    setTimeout(removeToast, duration);
}

/** Simple HTML escaping to avoid XSS in user names or prompts */
function escapeHtml(string) {
    if (!string) return '';
    return String(string)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ==========================================
// 4. Mobile Navigation & Common Handlers
// ==========================================
function initNavbar() {
    const hamburger = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-links');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('nav-links-active');
            hamburger.classList.toggle('active');
            const isExpanded = hamburger.classList.contains('active');
            hamburger.setAttribute('aria-expanded', isExpanded);
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target) && navMenu.classList.contains('nav-links-active')) {
                navMenu.classList.remove('nav-links-active');
                hamburger.classList.remove('active');
            }
        });
    }

    // Set active link based on current page path
    const path = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (path.endsWith(href) || (href === 'index.html' && (path.endsWith('/') || path.endsWith('/AI/') || path.endsWith('/Smart-Quiz/'))))) {
            link.classList.add('active');
        }
    });

    // Display current student name in header badge if logged in
    const user = getUser();
    const studentBadge = document.querySelector('.header-student-badge');
    if (studentBadge && user && user.name) {
        studentBadge.innerHTML = `
            <span class="user-avatar-chip"><i class="fa-solid fa-user-graduate"></i></span>
            <span class="user-name-text">${escapeHtml(user.name)}</span>
        `;
        studentBadge.style.display = 'inline-flex';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavbar();
    if (document.getElementById('dashboard-view')) {
        initDashboard();
    }
});

// ==========================================
// 5. Dashboard View Manager
// ==========================================
function initDashboard() {
    const user = getUser();
    const greetingEl = document.getElementById('dash-greeting');
    if (greetingEl && user && user.name) {
        greetingEl.textContent = `${user.name}'s Performance Dashboard`;
    }

    renderDashboardStats();
    renderDashboardHistory();
    setupDashboardEventListeners();
}

function renderDashboardStats() {
    const stats = getOverallStats();

    const totalQuizzesEl = document.getElementById('dash-total-quizzes');
    if (totalQuizzesEl) totalQuizzesEl.textContent = stats.totalQuizzes;

    const highestScoreEl = document.getElementById('dash-highest-score');
    if (highestScoreEl) highestScoreEl.textContent = `${stats.highestScore}%`;

    const avgScoreEl = document.getElementById('dash-avg-score');
    if (avgScoreEl) avgScoreEl.textContent = `${stats.averageScore}%`;

    const totalQuestionsEl = document.getElementById('dash-total-questions');
    if (totalQuestionsEl) totalQuestionsEl.textContent = stats.totalQuestionsAnswered;

    // Render Category Performance Bars
    const catBreakdownContainer = document.getElementById('dash-category-breakdown');
    if (catBreakdownContainer) {
        catBreakdownContainer.innerHTML = '';
        const allCategories = ['cpp', 'python', 'web', 'javascript', 'gk', 'cs'];

        allCategories.forEach(key => {
            const catMeta = (typeof quizData !== 'undefined' && quizData[key]) ? quizData[key] : { name: key.toUpperCase(), color: '#3b82f6', icon: 'fa-solid fa-code' };
            const catStat = stats.categoryStats[key];
            const attempts = catStat ? catStat.count : 0;
            const avgPct = catStat ? catStat.avgPercentage : 0;
            const highPct = catStat ? catStat.highestScore : 0;

            const card = document.createElement('div');
            card.className = 'category-perf-card';
            card.innerHTML = `
                <div class="perf-card-header">
                    <div class="perf-icon-name">
                        <i class="${catMeta.icon}" style="color: ${catMeta.color};"></i>
                        <span class="perf-title">${escapeHtml(catMeta.name)}</span>
                    </div>
                    <span class="perf-badge">${attempts} ${attempts === 1 ? 'quiz' : 'quizzes'}</span>
                </div>
                <div class="perf-metrics">
                    <span>Avg: <strong>${avgPct}%</strong></span>
                    <span>Best: <strong>${highPct}%</strong></span>
                </div>
                <div class="perf-progress-track">
                    <div class="perf-progress-fill" style="width: ${avgPct}%; background-color: ${catMeta.color};"></div>
                </div>
            `;
            catBreakdownContainer.appendChild(card);
        });
    }
}

function renderDashboardHistory() {
    const history = getQuizHistory();
    const tableBody = document.getElementById('dash-history-tbody');
    const emptyState = document.getElementById('dash-empty-history');
    const tableWrapper = document.getElementById('dash-table-wrapper');

    if (!history.length) {
        if (tableWrapper) tableWrapper.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (tableWrapper) tableWrapper.style.display = 'block';

    if (tableBody) {
        tableBody.innerHTML = '';
        history.forEach((record, idx) => {
            const tr = document.createElement('tr');

            let gradeBadgeClass = 'badge-pass';
            if (record.percentage >= 80) gradeBadgeClass = 'badge-distinction';
            else if (record.percentage >= 60) gradeBadgeClass = 'badge-merit';
            else if (record.percentage < 40) gradeBadgeClass = 'badge-fail';

            tr.innerHTML = `
                <td><strong>#${history.length - idx}</strong></td>
                <td>
                    <div class="table-student-cell">
                        <i class="fa-regular fa-user"></i>
                        <span>${escapeHtml(record.studentName || 'Student')}</span>
                    </div>
                </td>
                <td>
                    <span class="table-category-tag">
                        ${escapeHtml(record.categoryName || record.categoryKey)}
                    </span>
                </td>
                <td><strong>${record.score} / ${record.totalQuestions}</strong></td>
                <td>
                    <div class="table-pct-cell">
                        <div class="mini-progress-track">
                            <div class="mini-progress-fill" style="width: ${record.percentage}%;"></div>
                        </div>
                        <span>${record.percentage}%</span>
                    </div>
                </td>
                <td>
                    <span class="table-grade-pill ${gradeBadgeClass}">
                        ${record.grade || 'N/A'} - ${record.performanceBadge || 'Pass'}
                    </span>
                </td>
                <td class="table-date-cell">${record.date || '--'}</td>
                <td class="table-actions-cell">
                    <button class="btn-table-retake" onclick="quickRetake('${record.categoryKey}')" title="Retake Quiz">
                        <i class="fa-solid fa-rotate-right"></i>
                    </button>
                    <button class="btn-table-del" onclick="handleDeleteHistoryItem('${record.id}')" title="Delete Entry">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }
}

function quickRetake(catKey) {
    setSelectedCategory(catKey);
    window.location.href = 'quiz.html';
}

function handleDeleteHistoryItem(id) {
    if (confirm('Are you sure you want to delete this quiz record?')) {
        deleteQuizHistoryItem(id);
        renderDashboardStats();
        renderDashboardHistory();
        showToast('Record deleted.', 'info');
    }
}

function setupDashboardEventListeners() {
    const clearAllBtn = document.getElementById('dash-clear-history-btn');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all quiz history? This action cannot be undone.')) {
                clearAllQuizHistory();
                renderDashboardStats();
                renderDashboardHistory();
                showToast('All quiz history cleared.', 'info');
            }
        });
    }
}

