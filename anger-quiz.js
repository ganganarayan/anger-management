emailjs.init("SZh3_nsOvf3rWB8aT"); // Replace with your actual user ID

const questions = [
  "I get irritated when things don’t go as planned.",
  "I’ve said or done things in anger that I later regretted.",
  "I feel angry when people don’t meet my expectations.",
  "When I’m under pressure, I lose my temper easily.",
  "I hold onto anger for a long time and replay situations in my head.",
  "People close to me say I need to work on my anger.",
  "I feel a strong urge to control people or situations around me.",
  "I have trouble calming down once I get angry.",
  "My anger affects my relationships at work or home.",
  "I feel guilty or exhausted after an episode of anger."
];

let scores = [];
let currentIndex = 0;
let userName = "";
let userEmail = "";

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const startBtn = document.getElementById("start-btn");
const resultEl = document.getElementById("result");
const quizContainer = document.getElementById("quiz-container");
const userInput = document.getElementById("user-input");

startBtn.addEventListener("click", () => {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();

  if (name === "" || email === "") {
    alert("Please enter your name and email.");
    return;
  }

  if (!validateEmail(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  userName = name;
  userEmail = email;

  userInput.classList.add("hidden");
  quizContainer.classList.remove("hidden");
  renderQuestion();
});

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function renderQuestion() {
  questionEl.textContent = questions[currentIndex];
  optionsEl.innerHTML = '';
  for (let i = 1; i <= 5; i++) {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = `${i} – ${['Never','Rarely','Sometimes','Often','Always'][i - 1]}`;
    btn.onclick = () => {
      document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      scores[currentIndex] = i;
    };
    optionsEl.appendChild(btn);
  }
}

nextBtn.addEventListener("click", () => {
  if (typeof scores[currentIndex] === "undefined") {
    alert("Please select an option.");
    return;
  }
  currentIndex++;
  if (currentIndex < questions.length) {
    renderQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  quizContainer.classList.add("hidden");
  const total = scores.reduce((a, b) => a + b, 0);
  let interpretation = '';
  if (total <= 19) interpretation = "🟢 Emotionally Steady";
  else if (total <= 29) interpretation = "🟡 Mild Anger Tendencies";
  else if (total <= 39) interpretation = "🟠 Moderate Anger Issues";
  else interpretation = "🔴 Severe Anger Patterns";

  resultEl.innerHTML = `<p>Your Score: <strong>${total}/50</strong></p><p>${interpretation}</p>`;
  resultEl.classList.remove("hidden");

  sendEmail(total, interpretation);
}

function sendEmail(score, interpretation) {
  emailjs.send("service_kv35xvu", "template_2wfn188", {
    name: userName,
    email: userEmail,
    score: score,
    interpretation: interpretation
  }).then(() => {
    console.log("✅ Email sent successfully");
  }).catch(error => {
    console.error("❌ Email failed to send", error);
  });
}
