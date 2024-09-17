let currentQuestionIndex = 0;
let userAnswers = [];
let selectedLanguage = '';

// Load questions from JSON
fetch('questions.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('Loaded questions data:', data);  // Debugging line
    showLanguageOptions(data.questions);
  })
  .catch(error => console.error('Error loading questions:', error));

// Show language options for user to select
function showLanguageOptions(questions) {
  const languageOptions = document.getElementById("options");
  languageOptions.innerHTML = `
    <button class="btn-option" onclick="startQuiz('zh')">中文</button>
    <button class="btn-option" onclick="startQuiz('ko')">한국어</button>
    <button class="btn-option" onclick="startQuiz('tr')">Türkçe</button>
    <button class="btn-option" onclick="startQuiz('ja')">日本語</button>
  `;
}

// Start quiz in the selected language
function startQuiz(language) {
  selectedLanguage = language;

  // Fetch the questions for the chosen language
  fetch('questions.json')
    .then(response => response.json())
    .then(data => {
      const questions = data.questions[language];
      showQuestion(questions);
    });
}

// Display the current question
function showQuestion(questions) {
  const currentQuestion = questions[currentQuestionIndex];
  const optionsDiv = document.getElementById("options");

  // If it's the last thank-you note question (no options), show it directly
  if (currentQuestion.options.length === 0) {
    document.getElementById("questionText").innerText = currentQuestion.question;
    
    // Add button to show the summary
    optionsDiv.innerHTML = `<button class="btn-option" onclick="showSummary()">Show Your Choices</button>`;
    return;
  }

  // Otherwise, show normal question options
  document.getElementById("questionText").innerText = currentQuestion.question;
  optionsDiv.innerHTML = "";
  
  currentQuestion.options.forEach(option => {
    const btn = document.createElement("button");
    btn.classList.add("btn-option");
    btn.innerText = option;
    btn.onclick = () => selectOption(option, questions);
    optionsDiv.appendChild(btn);
  });
}

// Handle option selection and move to the next question
function selectOption(option, questions) {
  userAnswers[currentQuestionIndex] = option;
  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    showQuestion(questions);
  }
}

// Show summary of answers in English
function showSummary() {
  fetch('questions.json')
    .then(response => response.json())
    .then(data => {
      const questions = data.questions[selectedLanguage];
      
      // Map userAnswers to their English equivalents
      const summary = userAnswers.map((answer, index) => {
        const question = questions[index];
        const answerIndex = question.options.indexOf(answer);
        const englishAnswer = question.en_options[answerIndex]; // Get the English version
        return `Question ${index + 1}: ${englishAnswer}`;
      }).join("<br>");

      // Display the summary in English
      document.getElementById("questionText").innerHTML = `<h2>Your Choices:</h2><p>${summary}</p>`;
      document.getElementById("options").innerHTML = "";
    })
    .catch(error => console.error('Error loading questions for summary:', error));
}

