
const $ = (id) => document.getElementById(id);
const skills = [
  ["JavaScript", "Async, closures, event loop"],
  ["Angular", "RxJS, change detection"],
  ["React", "Hooks, state, rendering"],
  ["Vue", "Reactivity, components"],
  ["HTML & CSS", "Accessibility, responsive UI"],
  ["Node.js", "APIs, streams, event loop"],
  ["NestJS", "Modules, guards, DI"],
  ["Java", "Collections, concurrency"],
  ["Python", "Core, APIs, data"],
  ["MySQL", "Joins, indexes, queries"],
  ["MongoDB", "Aggregation, indexes"],
  ["System Design", "Scalability, reliability"],
  ["RAG & GenAI", "Embeddings, retrieval"],
  ["DSA", "Arrays, maps, complexity"]
];

const problemBank = {
  twoSum: {
    title: "Two Sum",
    description: "Given nums = [2,7,11,15] and target = 9, return the indices of two numbers that add up to the target. Aim for O(n).",
    starter: "function twoSum(nums, target) {\n  // Write your solution\n}\n\nconsole.log(twoSum([2, 7, 11, 15], 9));",
    test: "twoSum([2, 7, 11, 15], 9)"
  },
  duplicates: {
    title: "Find duplicates",
    description: "Return the unique values that appear more than once in an array.",
    starter: "function findDuplicates(nums) {\n  // Write your solution\n}\n\nconsole.log(findDuplicates([1, 2, 3, 2, 4, 1]));",
    test: "findDuplicates([1, 2, 3, 2, 4, 1])"
  },
  frequency: {
    title: "Character frequency",
    description: "Count the frequency of each character in a string.",
    starter: "function charFrequency(str) {\n  // Write your solution\n}\n\nconsole.log(charFrequency('banana'));",
    test: "charFrequency('banana')"
  },
  palindrome: {
    title: "Palindrome check",
    description: "Return true when a string reads the same forwards and backwards, ignoring case.",
    starter: "function isPalindrome(str) {\n  // Write your solution\n}\n\nconsole.log(isPalindrome('Level'));",
    test: "isPalindrome('Level')"
  },
  thirdLargest: {
    title: "Third-largest distinct number",
    description: "Return the third-largest distinct number, or the largest when fewer than three distinct values exist.",
    starter: "function thirdLargest(nums) {\n  // Write your solution\n}\n\nconsole.log(thirdLargest([4, 2, 9, 7, 9, 5]));",
    test: "thirdLargest([4, 2, 9, 7, 9, 5])"
  }
};

let selectedSkill = "JavaScript";
let timerSeconds = 15 * 60;
let timerInterval = null;
let answered = Number(localStorage.getItem("if-answered") || 0);
let questionCache = {};

function setView(view) {
  document.querySelectorAll(".view").forEach(el => el.classList.add("hidden"));
  $(view + "View").classList.remove("hidden");
  document.querySelectorAll(".nav-link").forEach(el =>
    el.classList.toggle("active", el.dataset.view === view)
  );
  const titles = {
    home: "Good progress starts small.",
    practice: "Practice with purpose.",
    dsa: "Build problem-solving confidence.",
    settings: "Set up your AI coach."
  };
  $("pageTitle").textContent = titles[view] || "InterviewForge";
  $("sidebar").classList.remove("open");
}

function renderSkills() {
  $("skillGrid").innerHTML = "";
  skills.forEach(([name, desc]) => {
    const btn = document.createElement("button");
    btn.className = "skill-card" + (name === selectedSkill ? " selected" : "");
    btn.innerHTML = `<strong></strong><span></span>`;
    btn.querySelector("strong").textContent = name;
    btn.querySelector("span").textContent = desc;
    btn.addEventListener("click", () => selectSkill(name));
    $("skillGrid").appendChild(btn);
  });
}

function selectSkill(skill) {
  selectedSkill = skill;
  $("currentSkill").textContent = skill;
  $("dailyTopic").textContent = skill + " interview practice";
  $("skillSelect").value = skill;
  renderSkills();
}

function addQuestionCards(container, questions) {
  container.innerHTML = "";
  questions.forEach((q, index) => {
    const card = document.createElement("article");
    card.className = "question-card";
    const title = document.createElement("h3");
    title.textContent = `${index + 1}. ${q.question || q.title || "Interview question"}`;
    const tag = document.createElement("span");
    tag.className = "pill";
    tag.textContent = q.type || "Interview question";
    const input = document.createElement("textarea");
    input.placeholder = "Write your answer here...";
    input.setAttribute("aria-label", "Your answer");
    const answerBtn = document.createElement("button");
    answerBtn.className = "soft-btn";
    answerBtn.textContent = "Reveal answer guide";
    const answer = document.createElement("div");
    answer.className = "answer hidden";
    answer.textContent = q.answer || q.answerGuide || "Explain the concept, give a real-world example, and discuss trade-offs.";
    answerBtn.addEventListener("click", () => {
      answer.classList.toggle("hidden");
      answerBtn.textContent = answer.classList.contains("hidden") ? "Reveal answer guide" : "Hide answer guide";
      if (!answer.classList.contains("hidden")) {
        answered++;
        localStorage.setItem("if-answered", String(answered));
        $("answeredCount").textContent = answered;
      }
    });
    card.append(tag, title, input, answerBtn, answer);
    container.appendChild(card);
  });
}

async function generateQuestions(skill, difficulty, experience, company, container) {
  const apiKey = sessionStorage.getItem("if-groq-key");
  const model = sessionStorage.getItem("if-groq-model") || "llama-3.3-70b-versatile";
  if (!apiKey) {
    container.innerHTML = "<p class='muted'>Add your Groq API key in AI Settings to generate fresh questions. A small offline practice set is available below.</p>";
    addQuestionCards(container, [
      { question: `Explain a real-world ${skill} problem you solved.`, answer: "Describe the context, your approach, trade-offs, outcome, and what you would improve." },
      { question: `What are common performance issues in ${skill}?`, answer: "Explain how you identify bottlenecks, measure performance, and verify the fix." },
      { question: `How would you debug a production issue involving ${skill}?`, answer: "Check impact, logs and metrics, reproduce safely, isolate root cause, fix, test, and monitor." }
    ]);
    return;
  }

  const button = container.parentElement.querySelector("button");
  if (button) { button.disabled = true; button.textContent = "Generating questions…"; }

  try {
    const prompt = `Create exactly 5 original technical interview questions for a ${experience} experienced ${skill} developer interviewing at a ${company}. Difficulty: ${difficulty}. Include practical production scenarios and at least one coding/debugging question where relevant. Return ONLY valid JSON array with objects: {"question":"...","answer":"concise but useful answer guide","type":"Concept|Scenario|Coding|Debugging"}.`;
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You are a practical technical interviewer and coach. Return valid JSON only." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq returned ${response.status}. ${errorText.slice(0, 250)}`);
    }
    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || "";
    content = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    const questions = JSON.parse(content);
    if (!Array.isArray(questions)) throw new Error("The AI response was not a question list.");
    addQuestionCards(container, questions);
    questionCache[skill] = questions;
  } catch (err) {
    container.innerHTML = "";
    const msg = document.createElement("p");
    msg.className = "muted";
    msg.textContent = "Could not generate questions: " + err.message;
    container.appendChild(msg);
  } finally {
    if (button) { button.disabled = false; button.textContent = "Generate questions with Groq AI"; }
  }
}

function updateTimer() {
  const min = String(Math.floor(timerSeconds / 60)).padStart(2, "0");
  const sec = String(timerSeconds % 60).padStart(2, "0");
  $("timerDisplay").textContent = `${min}:${sec}`;
}

function startTimer() {
  if (timerInterval) return;
  if (timerSeconds <= 0) timerSeconds = 15 * 60;
  timerInterval = setInterval(() => {
    timerSeconds = Math.max(0, timerSeconds - 1);
    updateTimer();
    if (timerSeconds === 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      alert("Practice session complete. Take a short break!");
    }
  }, 1000);
}

function renderProblem() {
  const problem = problemBank[$("problemSelect").value];
  $("problemDescription").textContent = problem.description;
  $("codeEditor").value = problem.starter;
  $("codeOutput").textContent = "Your output will appear here.";
}

function runUserCode() {
  const code = $("codeEditor").value;
  const output = [];
  const originalLog = console.log;
  const safeConsole = {
    log: (...args) => output.push(args.map(v => {
      try { return typeof v === "string" ? v : JSON.stringify(v); }
      catch { return String(v); }
    }).join(" "))
  };

  try {
    // This is a convenience runner for personal local practice, not a secure sandbox.
    const run = new Function("console", `"use strict"; ${code}`);
    run(safeConsole);
    $("codeOutput").textContent = output.join("\n") || "Code executed. No console output.";
  } catch (err) {
    $("codeOutput").textContent = `${err.name}: ${err.message}`;
  } finally {
    console.log = originalLog;
  }
}

document.querySelectorAll(".nav-link").forEach(btn =>
  btn.addEventListener("click", () => setView(btn.dataset.view))
);
$("menuBtn").addEventListener("click", () => $("sidebar").classList.toggle("open"));
$("focusBtn").addEventListener("click", () => document.body.classList.toggle("focus-mode"));
$("startDaily").addEventListener("click", () => {
  setView("home");
  $("questionArea").scrollIntoView({ behavior: "smooth", block: "start" });
});
$("generateBtn").addEventListener("click", () =>
  generateQuestions(selectedSkill, "Medium", "3-5 years", "MNC", $("questionArea"))
);
$("skillGenerateBtn").addEventListener("click", () =>
  generateQuestions(
    $("skillSelect").value,
    $("difficultySelect").value,
    $("experienceSelect").value,
    $("companySelect").value,
    $("skillQuestionArea")
  )
);
$("skillSelect").addEventListener("change", e => selectSkill(e.target.value));
$("timerStart").addEventListener("click", startTimer);
$("timerPause").addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
});
$("timerReset").addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
  timerSeconds = 15 * 60;
  updateTimer();
});
$("problemSelect").addEventListener("change", renderProblem);
$("runCode").addEventListener("click", runUserCode);
$("resetCode").addEventListener("click", renderProblem);
$("saveSettings").addEventListener("click", () => {
  const key = $("apiKeyInput").value.trim();
  const model = $("modelInput").value.trim() || "llama-3.3-70b-versatile";
  if (!key) {
    $("settingsMessage").textContent = "Enter a Groq API key first.";
    return;
  }
  sessionStorage.setItem("if-groq-key", key);
  sessionStorage.setItem("if-groq-model", model);
  $("apiKeyInput").value = "";
  $("settingsMessage").textContent = "Saved for this browser tab. Avoid using this setup for public deployment.";
});

$("answeredCount").textContent = answered;
renderSkills();
renderProblem();
updateTimer();
