/**
 * Smart Quiz Application - Question Bank
 * Contains 10+ high-quality questions for each of the 6 categories.
 * Each question has: id, question, options (4 choices), answer (0-based index), and explanation.
 */

const quizData = {
    // 1. C++ Programming
    cpp: {
        name: "C++ Programming",
        icon: "fa-solid fa-code",
        color: "#00599C",
        description: "Test your knowledge of C++ syntax, OOP concepts, pointers, and memory management.",
        timeLimit: 600, // 10 minutes in seconds
        questions: [
            {
                id: 1,
                question: "Which of the following concepts is NOT a core pillar of Object-Oriented Programming (OOP) in C++?",
                options: ["Encapsulation", "Compilation", "Inheritance", "Polymorphism"],
                answer: 1,
                explanation: "The four core pillars of OOP are Encapsulation, Abstraction, Inheritance, and Polymorphism. Compilation is a translation process, not an OOP pillar."
            },
            {
                id: 2,
                question: "What is the correct syntax to output 'Hello World' in C++?",
                options: ["cout << 'Hello World';", "System.out.print('Hello World');", "Console.WriteLine('Hello World');", "print('Hello World')"],
                answer: 0,
                explanation: "In C++, standard console output is performed using 'std::cout' along with the stream insertion operator '<<'."
            },
            {
                id: 3,
                question: "Which keyword is used to allocate memory dynamically on the heap in C++?",
                options: ["malloc", "alloc", "new", "create"],
                answer: 2,
                explanation: "'new' is the C++ operator used to allocate memory dynamically and invoke constructors. 'malloc' is from C."
            },
            {
                id: 4,
                question: "What does the 'virtual' keyword specify when used before a member function in a base class?",
                options: [
                    "The function cannot be overridden",
                    "The function supports runtime polymorphism (dynamic dispatch)",
                    "The function is executed during compilation",
                    "The function can only access private members"
                ],
                answer: 1,
                explanation: "'virtual' tells the compiler to use dynamic binding (vtable) so the most derived class's override is executed at runtime."
            },
            {
                id: 5,
                question: "What is the size of an empty class in C++ (typically)?",
                options: ["0 bytes", "1 byte", "4 bytes", "Depends on the compiler, usually 8 bytes"],
                answer: 1,
                explanation: "In C++, an empty class has a non-zero size (typically 1 byte) to ensure that distinct objects of that class have distinct memory addresses."
            },
            {
                id: 6,
                question: "Which of the following operators cannot be overloaded in C++?",
                options: ["+", "==", ":: (Scope Resolution)", "[]"],
                answer: 2,
                explanation: "Operators that cannot be overloaded in C++ include the scope resolution operator '::', member selection '.', pointer-to-member '.*', and ternary '?:'."
            },
            {
                id: 7,
                question: "What happens if a pointer is freed twice using 'delete'?",
                options: [
                    "Nothing, it is ignored safely",
                    "It causes Undefined Behavior (Double Free error)",
                    "The operating system reallocates it",
                    "The program pauses and asks for permission"
                ],
                answer: 1,
                explanation: "Deleting the same memory block twice leads to undefined behavior, frequently causing heap corruption crashes known as a double free."
            },
            {
                id: 8,
                question: "Which header file is required to use std::vector in C++?",
                options: ["<array>", "<vector>", "<list>", "<algorithm>"],
                answer: 1,
                explanation: "The '<vector>' header file must be included to use the dynamic array container std::vector from the Standard Template Library (STL)."
            },
            {
                id: 9,
                question: "What is the purpose of the 'const' keyword after a member function declaration (e.g., void display() const)?",
                options: [
                    "It prevents the function from returning a value",
                    "It indicates the function will not modify any member variables of the object",
                    "It makes the function static",
                    "It allows the function to be called only once"
                ],
                answer: 1,
                explanation: "A const member function promises not to modify any non-mutable data members of the calling object."
            },
            {
                id: 10,
                question: "What is the default access specifier for members of a 'class' in C++?",
                options: ["public", "protected", "private", "internal"],
                answer: 2,
                explanation: "In C++, class members are 'private' by default, whereas struct members are 'public' by default."
            }
        ]
    },

    // 2. Python Programming
    python: {
        name: "Python Programming",
        icon: "fa-brands fa-python",
        color: "#3776AB",
        description: "Explore Python data types, functions, list comprehensions, and control flow.",
        timeLimit: 600,
        questions: [
            {
                id: 1,
                question: "Which of the following data types is IMMUTABLE in Python?",
                options: ["List", "Dictionary", "Tuple", "Set"],
                answer: 2,
                explanation: "Tuples, integers, floats, strings, and frozensets are immutable in Python; their contents cannot be modified in-place after creation."
            },
            {
                id: 2,
                question: "What will be the output of: print(type(5 / 2)) in Python 3?",
                options: ["<class 'int'>", "<class 'float'>", "<class 'double'>", "<class 'number'>"],
                answer: 1,
                explanation: "In Python 3, the single division operator '/' always returns a floating-point number (e.g., 2.5), which is of type float."
            },
            {
                id: 3,
                question: "Which keyword is used to create a generator function in Python?",
                options: ["return", "generate", "yield", "produce"],
                answer: 2,
                explanation: "The 'yield' keyword pauses function execution and emits a value to the caller, turning a standard function into a generator."
            },
            {
                id: 4,
                question: "What will print('Python'[::-1]) output?",
                options: ["Python", "nohtyP", "P", "SyntaxError"],
                answer: 1,
                explanation: "The slice syntax [::-1] uses a step of -1 to reverse any sequence, reversing 'Python' to 'nohtyP'."
            },
            {
                id: 5,
                question: "How do you define a function that accepts any number of positional arguments?",
                options: ["def func(args*):", "def func(*args):", "def func(**kwargs):", "def func(&args):"],
                answer: 1,
                explanation: "'*args' packs any arbitrary number of positional arguments into a tuple inside the function."
            },
            {
                id: 6,
                question: "What is the output of bool([]) in Python?",
                options: ["True", "False", "None", "Error"],
                answer: 1,
                explanation: "In Python, empty sequences (empty list [], string '', tuple (), dict {}) evaluate to False in a boolean context."
            },
            {
                id: 7,
                question: "Which built-in module is used in Python to work with regular expressions?",
                options: ["regex", "pyregex", "re", "string"],
                answer: 2,
                explanation: "The 're' module is Python's standard library module for regular expression pattern matching operations."
            },
            {
                id: 8,
                question: "What is the difference between '==' and 'is' in Python?",
                options: [
                    "'==' checks memory address, 'is' checks value",
                    "'==' checks value equality, 'is' checks object identity (same memory address)",
                    "There is no difference between them",
                    "'is' works only for numbers, '==' works for strings"
                ],
                answer: 1,
                explanation: "'==' checks whether the values of two objects are equal, while 'is' checks whether both operands refer to the exact same object in memory."
            },
            {
                id: 9,
                question: "Which method is used to remove and return the last item from a Python list?",
                options: ["remove()", "delete()", "pop()", "discard()"],
                answer: 2,
                explanation: "'list.pop()' removes and returns the item at the given index (defaulting to the last item if no index is supplied)."
            },
            {
                id: 10,
                question: "What is PEP 8 in the Python ecosystem?",
                options: [
                    "A Python compiler version",
                    "The official style guide for writing Python code",
                    "A package manager replacement for pip",
                    "A security vulnerability protocol"
                ],
                answer: 1,
                explanation: "PEP 8 (Python Enhancement Proposal 8) is the standard style guide providing conventions and guidelines for writing readable Python code."
            }
        ]
    },

    // 3. HTML and CSS
    web: {
        name: "HTML and CSS",
        icon: "fa-brands fa-html5",
        color: "#E34F26",
        description: "Master semantic HTML5 markup, CSS Flexbox, Grid, styling, and responsive design.",
        timeLimit: 600,
        questions: [
            {
                id: 1,
                question: "What does HTML stand for?",
                options: [
                    "Hyper Transfer Markup Language",
                    "Hyper Text Markup Language",
                    "High Tech Modern Language",
                    "Hyperlink and Text Marking Language"
                ],
                answer: 1,
                explanation: "HTML stands for HyperText Markup Language, the standard authoring language used to build documents on the World Wide Web."
            },
            {
                id: 2,
                question: "Which HTML5 semantic element is most appropriate for a self-contained composition (like a blog post or news story)?",
                options: ["<section>", "<div>", "<article>", "<aside>"],
                answer: 2,
                explanation: "The '<article>' element represents a complete, self-contained composition in a document that is independently distributable."
            },
            {
                id: 3,
                question: "In the CSS Box Model, which layer is immediately outside the padding?",
                options: ["Content", "Margin", "Border", "Outline"],
                answer: 2,
                explanation: "From inside out, the CSS Box Model consists of: Content -> Padding -> Border -> Margin."
            },
            {
                id: 4,
                question: "Which CSS property and value will make a container distribute child elements along the main axis using Flexbox?",
                options: ["align-items", "justify-content", "align-content", "flex-wrap"],
                answer: 1,
                explanation: "'justify-content' aligns flex items along the main axis (horizontal by default), while 'align-items' controls alignment on the cross axis."
            },
            {
                id: 5,
                question: "What does the CSS rule 'box-sizing: border-box;' do?",
                options: [
                    "Adds an extra decorative border to all containers",
                    "Includes padding and border within the specified element width and height",
                    "Removes all margins from the element",
                    "Hides the border when screen size is small"
                ],
                answer: 1,
                explanation: "'border-box' tells the browser to include padding and border in the element's total width and height, preventing layout breakage."
            },
            {
                id: 6,
                question: "Which HTML attribute is used to provide alternate text for screen readers and when images fail to load?",
                options: ["title", "src", "alt", "caption"],
                answer: 2,
                explanation: "The 'alt' attribute provides an alternative text description for accessibility and fallback display if the image cannot be loaded."
            },
            {
                id: 7,
                question: "Which CSS unit is relative to the font-size of the root (<html>) element?",
                options: ["em", "rem", "vh", "%"],
                answer: 1,
                explanation: "'rem' stands for 'root em'. It is relative to the font-size of the root <html> tag, unlike 'em' which is relative to the parent element."
            },
            {
                id: 8,
                question: "Which of the following selectors has the HIGHEST specificity in CSS?",
                options: [
                    "#nav (ID selector)",
                    ".nav-item (Class selector)",
                    "header nav a (Element selector sequence)",
                    "* (Universal selector)"
                ],
                answer: 0,
                explanation: "ID selectors (#id) carry a specificity weight of (0,1,0,0), which overrides class selectors (0,0,1,0) and element selectors (0,0,0,1)."
            },
            {
                id: 9,
                question: "What is the purpose of the HTML '<meta name='viewport'>' tag?",
                options: [
                    "To enable 3D graphics rendering",
                    "To control the layout viewport on mobile browsers for responsive design",
                    "To preload all stylesheets",
                    "To track user scrolling behavior"
                ],
                answer: 1,
                explanation: "The viewport meta tag instructs mobile browsers to render the page at the device's screen width rather than zooming out like a desktop page."
            },
            {
                id: 10,
                question: "Which CSS display property creates a two-dimensional grid-based layout system with columns and rows?",
                options: ["display: flex", "display: inline-block", "display: grid", "display: table"],
                answer: 2,
                explanation: "'display: grid' initiates CSS Grid Layout, which is specifically designed for 2D layouts (handling both rows and columns simultaneously)."
            }
        ]
    },

    // 4. JavaScript
    javascript: {
        name: "JavaScript",
        icon: "fa-brands fa-js",
        color: "#F7DF1E",
        description: "Test your JavaScript ES6+, DOM manipulation, asynchronous programming, and scope skills.",
        timeLimit: 600,
        questions: [
            {
                id: 1,
                question: "What is the key difference between 'let' and 'var' in JavaScript?",
                options: [
                    "'var' is block-scoped, while 'let' is function-scoped",
                    "'let' is block-scoped, while 'var' is function-scoped",
                    "'let' can be redeclared in the same scope, 'var' cannot",
                    "There is no functional difference"
                ],
                answer: 1,
                explanation: "'let' and 'const' introduced in ES6 are block-scoped ({ }), whereas 'var' is function-scoped (or globally scoped) and suffers from variable hoisting quirks."
            },
            {
                id: 2,
                question: "What does the expression '2' + 2 - 1 evaluate to in JavaScript?",
                options: ["21", "3", "22", "NaN"],
                answer: 0,
                explanation: "'2' + 2 results in string concatenation '22'. Then '22' - 1 triggers numeric subtraction, giving the number 21."
            },
            {
                id: 3,
                question: "Which built-in method converts a JavaScript object into a JSON formatted string?",
                options: ["JSON.parse()", "JSON.stringify()", "JSON.objectify()", "JSON.toString()"],
                answer: 1,
                explanation: "'JSON.stringify()' serializes JavaScript objects/arrays into a valid JSON string. 'JSON.parse()' does the reverse."
            },
            {
                id: 4,
                question: "What is a closure in JavaScript?",
                options: [
                    "A function wrapped inside a try/catch block",
                    "A function bundled together with references to its surrounding lexical state (lexical environment)",
                    "A method to automatically close browser tabs",
                    "A variable declared with the const keyword"
                ],
                answer: 1,
                explanation: "A closure gives an inner function access to its outer function's scope even after the outer function has finished executing."
            },
            {
                id: 5,
                question: "Which method is used to attach an event handler to a DOM element without overwriting existing handlers?",
                options: ["element.attach()", "element.onclick = func", "element.addEventListener()", "element.registerEvent()"],
                answer: 2,
                explanation: "'addEventListener()' allows adding multiple listeners to a single event without overwriting existing event handlers."
            },
            {
                id: 6,
                question: "What will 'typeof null' return in JavaScript?",
                options: ["'null'", "'undefined'", "'object'", "'boolean'"],
                answer: 2,
                explanation: "In JavaScript, 'typeof null' returns 'object'. This is a historical bug in the initial language design that remains for backward compatibility."
            },
            {
                id: 7,
                question: "Which Promise method resolves when ALL promises in an iterable have resolved, or rejects if ANY promise rejects?",
                options: ["Promise.any()", "Promise.race()", "Promise.all()", "Promise.allSettled()"],
                answer: 2,
                explanation: "'Promise.all()' waits for all input promises to resolve and returns an array of results. If any promise rejects, it immediately rejects."
            },
            {
                id: 8,
                question: "What will the following code output: console.log([] == false)?",
                options: ["true", "false", "TypeError", "undefined"],
                answer: 0,
                explanation: "Due to abstract equality coercion, [] is coerced to an empty string '', which then coerces to 0. false also coerces to 0, so 0 == 0 evaluates to true."
            },
            {
                id: 9,
                question: "How do you store data persistently across browser sessions in the client's browser?",
                options: ["sessionStorage", "localStorage", "cookie with 0 expiry", "window.cache"],
                answer: 1,
                explanation: "'localStorage' persists key-value data with no expiration time, keeping data intact even when the browser or tab is closed."
            },
            {
                id: 10,
                question: "What is the purpose of the 'map()' method on JavaScript arrays?",
                options: [
                    "It filters items based on a boolean condition",
                    "It creates a new array populated with the results of calling a provided function on every element",
                    "It modifies the original array in-place by reversing it",
                    "It checks if any element in the array is true"
                ],
                answer: 1,
                explanation: "'Array.prototype.map()' transforms each element of an array using a callback function and returns a brand-new array without mutating the original."
            }
        ]
    },

    // 5. General Knowledge
    gk: {
        name: "General Knowledge",
        icon: "fa-solid fa-earth-americas",
        color: "#2ECC71",
        description: "Sharpen your general awareness on world geography, science, history, and famous inventions.",
        timeLimit: 600,
        questions: [
            {
                id: 1,
                question: "Which planet in our solar system is known as the 'Red Planet'?",
                options: ["Venus", "Mars", "Jupiter", "Saturn"],
                answer: 1,
                explanation: "Mars is called the Red Planet because iron minerals in the Martian soil oxidize (rust), giving the surface a reddish appearance."
            },
            {
                id: 2,
                question: "Who is officially credited with inventing the World Wide Web in 1989?",
                options: ["Alan Turing", "Tim Berners-Lee", "Bill Gates", "Steve Jobs"],
                answer: 1,
                explanation: "Sir Tim Berners-Lee invented the World Wide Web in 1989 while working at CERN to facilitate information sharing among scientists."
            },
            {
                id: 3,
                question: "What is the chemical symbol for the element Gold?",
                options: ["Ag", "Au", "Fe", "Gd"],
                answer: 1,
                explanation: "'Au' is the chemical symbol for gold, derived from the Latin word 'Aurum', meaning 'shining dawn'."
            },
            {
                id: 4,
                question: "What is the largest ocean on Earth by surface area?",
                options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
                answer: 2,
                explanation: "The Pacific Ocean is the largest and deepest ocean on Earth, covering more than 30% of the Earth's surface."
            },
            {
                id: 5,
                question: "In which year did the Apollo 11 mission successfully land the first humans on the Moon?",
                options: ["1965", "1969", "1972", "1975"],
                answer: 1,
                explanation: "On July 20, 1969, American astronauts Neil Armstrong and Buzz Aldrin landed on the Moon during NASA's Apollo 11 mission."
            },
            {
                id: 6,
                question: "Which organ in the human body is responsible for pumping blood throughout the circulatory system?",
                options: ["Lungs", "Brain", "Heart", "Liver"],
                answer: 2,
                explanation: "The heart acts as a muscular pump that continuously circulates blood, oxygen, and nutrients to every part of the human body."
            },
            {
                id: 7,
                question: "Who wrote the famous play 'Romeo and Juliet'?",
                options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"],
                answer: 1,
                explanation: "William Shakespeare wrote the tragic romance 'Romeo and Juliet' in the late 16th century."
            },
            {
                id: 8,
                question: "What gas do green plants absorb from the atmosphere during photosynthesis?",
                options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Methane"],
                answer: 1,
                explanation: "Plants take in Carbon Dioxide (CO2) and water, using sunlight to produce glucose and release Oxygen as a byproduct."
            },
            {
                id: 9,
                question: "What is the highest mountain peak above sea level on Earth?",
                options: ["K2", "Mount Kilimanjaro", "Mount Everest", "Kangchenjunga"],
                answer: 2,
                explanation: "Mount Everest, located in the Himalayas on the border between Nepal and China, is the tallest peak at 8,848.86 meters."
            },
            {
                id: 10,
                question: "Which country gifted the Statue of Liberty to the United States in the late 19th century?",
                options: ["United Kingdom", "France", "Germany", "Italy"],
                answer: 1,
                explanation: "The Statue of Liberty was a gift from the people of France to the United States to celebrate their alliance during the American Revolution."
            }
        ]
    },

    // 6. Computer Fundamentals
    cs: {
        name: "Computer Fundamentals",
        icon: "fa-solid fa-microchip",
        color: "#9B59B6",
        description: "Assess your foundation in operating systems, CPU architecture, networking, and memory.",
        timeLimit: 600,
        questions: [
            {
                id: 1,
                question: "Which component is widely known as the 'Brain of the Computer'?",
                options: ["Hard Disk Drive (HDD)", "Central Processing Unit (CPU)", "Random Access Memory (RAM)", "Motherboard"],
                answer: 1,
                explanation: "The CPU (Central Processing Unit) performs basic arithmetic, logic, controlling, and input/output operations, acting as the brain."
            },
            {
                id: 2,
                question: "What is the decimal equivalent of the 4-bit binary number 1010?",
                options: ["8", "10", "12", "14"],
                answer: 1,
                explanation: "Binary 1010 = (1 * 2^3) + (0 * 2^2) + (1 * 2^1) + (0 * 2^0) = 8 + 0 + 2 + 0 = 10."
            },
            {
                id: 3,
                question: "Which type of computer memory is VOLATILE, meaning it loses data when power is turned off?",
                options: ["ROM (Read Only Memory)", "SSD", "RAM (Random Access Memory)", "Hard Disk"],
                answer: 2,
                explanation: "RAM is volatile memory; it requires electrical power to maintain its state and is cleared when the computer shuts down."
            },
            {
                id: 4,
                question: "What does the acronym 'DNS' stand for in computer networking?",
                options: [
                    "Dynamic Network System",
                    "Domain Name System",
                    "Data Node Service",
                    "Distributed Numeric Server"
                ],
                answer: 1,
                explanation: "DNS stands for Domain Name System. It translates human-friendly domain names (like google.com) into computer-readable IP addresses."
            },
            {
                id: 5,
                question: "Which layer of the OSI model is responsible for routing packets across different networks?",
                options: ["Data Link Layer", "Network Layer", "Transport Layer", "Application Layer"],
                answer: 1,
                explanation: "The Network Layer (Layer 3) handles logical addressing (IP addresses) and path determination (routing) between different networks."
            },
            {
                id: 6,
                question: "How many bits make up 1 Byte?",
                options: ["4 bits", "8 bits", "16 bits", "32 bits"],
                answer: 1,
                explanation: "One byte consists of 8 bits. A group of 4 bits is known as a nibble."
            },
            {
                id: 7,
                question: "What is the primary role of an Operating System (OS)?",
                options: [
                    "To design graphics and edit video files",
                    "To act as an intermediary between computer hardware and user software applications",
                    "To increase internet broadband speed",
                    "To cool down the processor chip"
                ],
                answer: 1,
                explanation: "An Operating System manages computer hardware resources (CPU, memory, storage, devices) and provides common services for software programs."
            },
            {
                id: 8,
                question: "Which data structure operates on a Last-In, First-Out (LIFO) principle?",
                options: ["Queue", "Stack", "Array", "Linked List"],
                answer: 1,
                explanation: "A Stack follows the LIFO (Last In First Out) principle, where the most recently added element is the first one removed."
            },
            {
                id: 9,
                question: "What is the standard port number used for secure HTTPS web traffic?",
                options: ["80", "21", "443", "8080"],
                answer: 2,
                explanation: "Port 443 is the standard port assigned for encrypted HTTPS communication. Standard unencrypted HTTP uses port 80."
            },
            {
                id: 10,
                question: "What does GUI stand for in computing?",
                options: [
                    "General User Interface",
                    "Graphical User Interface",
                    "Global Utility Integrator",
                    "Gigabit Unit Interchange"
                ],
                answer: 1,
                explanation: "GUI stands for Graphical User Interface, which allows users to interact with electronic devices through visual icons and audio indicators."
            }
        ]
    }
};

/**
 * Fisher-Yates array shuffle helper
 * @param {Array} array 
 * @returns {Array} Shuffled shallow copy of the array
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Retrieves and prepares questions for a quiz session.
 * Clones data, optionally shuffles question order and option choices while keeping correct answer index aligned.
 * @param {string} categoryKey - Key for category (e.g. 'cpp', 'python')
 * @param {boolean} randomizeQuestions - Whether to shuffle question order
 * @param {boolean} randomizeOptions - Whether to shuffle 4 options per question
 * @returns {Array} Array of question objects ready for the quiz
 */
function prepareQuizQuestions(categoryKey, randomizeQuestions = true, randomizeOptions = true) {
    const category = quizData[categoryKey];
    if (!category || !category.questions) {
        return [];
    }

    // Deep clone questions
    let prepared = category.questions.map((q, idx) => {
        let currentOptions = [...q.options];
        let correctText = q.options[q.answer];
        let currentAnswerIndex = q.answer;

        if (randomizeOptions) {
            // Shuffle options
            currentOptions = shuffleArray(currentOptions);
            // Re-identify correct answer index
            currentAnswerIndex = currentOptions.indexOf(correctText);
        }

        return {
            id: q.id || idx + 1,
            originalIndex: idx,
            question: q.question,
            options: currentOptions,
            answer: currentAnswerIndex,
            correctText: correctText,
            explanation: q.explanation
        };
    });

    if (randomizeQuestions) {
        prepared = shuffleArray(prepared);
    }

    return prepared;
}
