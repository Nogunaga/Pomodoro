const tasks = [];
let time = 0;
let timer = null;
let timerBreak = null;
let current = null;
let statusApp = "stop";
let musicElement = new Audio();  // Elemento de audio para reproducir música

const bAdd = document.querySelector("#bAdd");
const itTask = document.querySelector("#itTask");
const form = document.querySelector("#form");

renderTasks();
renderTime();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (itTask.value !== "") {
    createTask(itTask.value);
    itTask.value = "";
    renderTasks();
  }
});

function createTask(value) {
  const newTask = {
    id: (Math.random() * 100).toString(36).slice(2),
    title: value,
    completed: false,
  };

  tasks.unshift(newTask);
}

function renderTasks() {
  const html = tasks.map((task) => {
    return `
      <div class="task">
        <div class="completed">${
          task.completed
            ? "<span class='done'>Done</span>"
            : `<button class="start-button" data-id="${task.id}">Empezar</button>`
        }</div>
        <div class="title">${task.title}</div>
      </div>`;
  });
  const tasksContainer = document.querySelector("#tasks");
  tasksContainer.innerHTML = html.join("");

  const startButtons = document.querySelectorAll(".task .start-button");
  startButtons.forEach((startButton) => {
    startButton.addEventListener("click", () => {
      if (!timer) {
        startButtonHandler(startButton.getAttribute("data-id"));
        startButton.textContent = "En progreso...";
      }
    });
  });
}

function startButtonHandler(id) {
  time = 25 * 60;
  current = id;
  const taskId = tasks.findIndex((task) => task.id === id);
  document.querySelector("#time #taskName").textContent = tasks[taskId].title;

  timer = setInterval(() => {
    timerHandler(id);
  }, 1000);
}

function timerHandler(id = null) {
  time--;
  renderTime();
  if (time === 0) {
    markComplete(id);
    clearInterval(timer);
    renderTasks();
    playMusic(); // Reproducir música cuando finalice la tarea
    startBreak();
  }
}

function markComplete(id) {
  const taskId = tasks.findIndex((task) => task.id === id);
  tasks[taskId].completed = true;
}

function startBreak() {
  time = 15 * 60;
  document.querySelector("#time #taskName").textContent = "Break";
  timerBreak = setInterval(timerBreakHandler, 1000);
}

function timerBreakHandler() {
  time--;
  renderTime();
  if (time === 0) {
    clearInterval(timerBreak);
    current = null;
    document.querySelector("#time #taskName").textContent = "";
    musicElement.pause(); // Detener la reproducción de música después del descanso
    renderTime();
  }
}

function renderTime() {
  const timeDiv = document.querySelector("#time #value");
  const minutes = parseInt(time / 60);
  const seconds = parseInt(time % 60);
  timeDiv.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
}

// Función para establecer la fuente de música (reemplazar con la URL de tu archivo de música deseado)
function setMusicSource(url) {
  musicElement.setAttribute("src", url);
}

