# 🎓 Smart Quiz Application

A responsive, interactive, and beginner-friendly web-based quiz platform built for first-year engineering students using **HTML5, CSS3, and modern Vanilla JavaScript** with **LocalStorage** persistence.

---

## 📁 Project Folder Structure

```text
Smart-Quiz/
│
├── index.html          # Application landing page with category showcase & stats
├── student.html        # Student registration & quiz category selection
├── quiz.html           # Live interactive quiz arena with timer & palette
├── result.html         # Performance summary, score ring & detailed explanations
├── dashboard.html      # Comprehensive analytics, history table & category meters
│
├── css/
│   └── style.css       # Complete stylesheet with Dark/Light theme & responsive design
│
├── js/
│   ├── questions.js    # Question bank (60+ questions across 6 categories)
│   ├── app.js          # Core utilities: LocalStorage, theme toggle, toasts, dashboard
│   ├── quiz.js         # Quiz engine: timer, question rendering, answers & submit modal
│   └── result.js       # Results engine: circular score ring, confetti & review filter
│
└── assets/
    └── images/
        ├── logo.svg    # Vector application logo
        └── favicon.svg # Browser tab favicon
```

---

## 🚀 How to Run the Application

No build tools, Node.js, or complex setups are required! This is a pure front-end web application.

### Option 1: Direct File Launch (Easiest)
1. Open the `Smart-Quiz` folder in your file explorer.
2. Double-click `index.html` to open it in your default web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari).

### Option 2: Using VS Code Live Server (Recommended for Development)
1. Open Visual Studio Code.
2. Open the `Smart-Quiz` folder (`File` -> `Open Folder...`).
3. If you have the **Live Server** extension installed, right-click `index.html` and click **"Open with Live Server"**.
4. The application will open at `http://127.0.0.1:5500/index.html` with instant live-reloading.

---

## 💡 How the Application Works (Beginner Guide)

### 1. Data Layer (`questions.js`)
- Contains a structured JavaScript object (`quizData`) organized into 6 categories:
  - `cpp`: C++ Programming
  - `python`: Python Programming
  - `web`: HTML and CSS
  - `javascript`: JavaScript
  - `gk`: General Knowledge
  - `cs`: Computer Fundamentals
- Each question is represented as:
  ```javascript
  {
    id: 1,
    question: "What is a closure in JavaScript?",
    options: ["Option A", "Option B", "Option C", "Option D"],
    answer: 1, // 0-based index of correct option
    explanation: "A closure gives an inner function access to..."
  }
  ```
- Includes the `prepareQuizQuestions()` function which utilizes the **Fisher-Yates Shuffle Algorithm** to randomize both the order of questions and the order of answer choices every time a quiz starts while accurately keeping track of the correct answer index.

### 2. State & Storage Layer (`app.js`)
- Utilizes the browser's native `window.localStorage` to persist data without requiring a backend server or database:
  - `smartQuiz_theme`: Stores `'light'` or `'dark'`.
  - `smartQuiz_user`: Stores student profile (`{ name, branch }`).
  - `smartQuiz_selectedCategory`: Stores current category key (e.g., `'python'`).
  - `smartQuiz_history`: Stores an array of all completed quiz attempts with scores, percentages, dates, and full answer logs.
  - `smartQuiz_currentResult`: Holds the latest quiz outcome for `result.html`.

### 3. Quiz Engine (`quiz.js`)
- Runs on `quiz.html`.
- Loads questions dynamically from the question bank.
- Manages an active countdown timer (`setInterval`) and triggers automatic submission if the timer reaches 0.
- Allows jumping between questions using the visual **Question Palette** (1–10).
- Prevents accidental submission through a modal confirmation dialog warning about any unanswered questions.

### 4. Results & Review Engine (`result.js`)
- Renders an animated SVG circular score gauge and grade pill (`A+`, `A`, `B`, `C`, `D`).
- Launches celebration confetti particles on canvas for passing marks (≥ 60%).
- Displays a detailed question-by-question review highlighting:
  - Your selected answer (green if correct, red if incorrect).
  - The correct answer.
  - Educational explanation note for each question.
- Provides interactive filter tabs (`All`, `Correct`, `Incorrect`, `Skipped`).

### 5. Analytics Dashboard (`dashboard.html` + `app.js`)
- Displays aggregate metrics: Total Quizzes Attempted, Highest Score, Average Score, and Total Questions Solved.
- Renders animated progress meters for each category.
- Displays a searchable history table with options to retake any past quiz or delete individual/all records.

---

## 🛠️ How to Add Your Own Questions

To add more questions or a new category, open `js/questions.js`:

1. Locate the category object (e.g. `python`).
2. Add a new question object to the `questions` array:
```javascript
{
    id: 11,
    question: "What is the output of print(2 ** 3) in Python?",
    options: ["5", "6", "8", "9"],
    answer: 2, // '8' is at index 2
    explanation: "The '**' operator calculates exponentiation (2 cubed = 8)."
}
```

---

## ✅ Testing Checklist

- [x] All 5 pages navigate smoothly without broken links.
- [x] Dark Mode / Light Mode toggle works and persists across page reloads.
- [x] Student name validation prevents empty submissions.
- [x] Timer counts down accurately from 10:00 to 00:00.
- [x] Answer selection highlights choice and updates question navigator dots.
- [x] Modal popup warns when unanswered questions remain.
- [x] Results display accurate scores, percentage, and grade.
- [x] Explanations appear for every question on the result review.
- [x] Dashboard computes and displays average score and recent quiz records.
- [x] Mobile and tablet layouts adapt cleanly with responsive breakpoints.
