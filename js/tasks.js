function handleTaskClick(e) {
  const currentTask = e.currentTarget;

  currentTask.classList.toggle("completed");
  const currentTaskId = currentTask.getAttribute("data-id");

  const tasks = getTasksFromLocalStorage();

  const updatedTasks = tasks.map((task) =>
    task.id === currentTaskId
      ? {
          ...task,
          isCompleted: currentTask.classList.contains("completed"),
        }
      : task
  );

  setTasksToLocalStorage(updatedTasks);
}

function handleEditTaskClick(e) {
  const currentTask = e.currentTarget;
  const currentTaskId = currentTask.getAttribute("data-id");
  const tasks = getTasksFromLocalStorage();
  const currentTaskObj = tasks.find((task) => task.id === currentTaskId);

  const editTaskInput = document.getElementById("editTaskInput");
  editTaskInput.value = currentTaskObj.textContent;

  const modal = document.getElementById("modal");
  modal.style.display = "block";
}

function handleTaskClick(e) {
  handleEditTaskClick(e);
}

function handleEditFormSubmit(e) {
  e.preventDefault();
  const editTaskInput = document.getElementById("editTaskInput");
  const tasks = getTasksFromLocalStorage();
  const currentTaskId = document.getElementById("modal").getAttribute("data-id");

  const updatedTasks = tasks.map((task) =>
    task.id === currentTaskId ? { ...task, textContent: editTaskInput.value } : task
  );

  setTasksToLocalStorage(updatedTasks);
  renderTasks(updatedTasks);

  const modal = document.getElementById("modal");
  modal.style.display = "none";
}

function handleCancelEditClick() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
}

const editForm = document.getElementById("editForm");
editForm.addEventListener("submit", handleEditFormSubmit);

const cancelEditButton = document.getElementById("cancelEditButton");
cancelEditButton.addEventListener("click", handleCancelEditClick);


function createNewTask({ id, isCompleted, textContent, onClick, handleEditClick }) {
  const li = document.createElement("li");
  li.setAttribute("data-id", id);
  if (isCompleted) {
    li.classList.add("completed");
  }
  li.appendChild(document.createTextNode(textContent));
  li.addEventListener("click", onClick);
  li.addEventListener("dblclick", handleEditClick);

  return li;
}

async function getWeather() {
  const apiKey = '289fa4de5f0876e68a81e6a23efbf46f';
  const city = 'Yerevan';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    const data = await response.json();
    return {
      temperature: data.main.temp,
      description: data.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}


async function addTask() {
  const input = document.getElementById("taskInput");
  if (!input.value.length) return;

  const tasksList = document.getElementById("tasksList");
  const newTaskId = Math.random().toString();

  const newTask = createNewTask({
    id: newTaskId,
    textContent: input.value,
    onClick: handleTaskClick,
  });

  const tasks = getTasksFromLocalStorage();

  setTasksToLocalStorage([
    {
      id: newTaskId,
      isCompleted: false,
      textContent: input.value,
    },
    ...tasks,
  ]);

  await showLoading();

  tasksList.prepend(newTask);
  input.value = "";
}

async function toggleList() {
  const tasksList = document.getElementById("tasksList");
  const toggleButton = document.getElementById("toggleButton");

  if (tasksList.style.display === "none") {
    await showLoading();
    const tasks = getTasksFromLocalStorage();

    const searchInput = document.getElementById("searchInput");
    const searchTerm = searchInput.value.toLowerCase();

    tasksList.innerHTML = "";
    tasks.forEach((task) => {
      if (task.textContent.toLowerCase().includes(searchTerm)) {
        const tasksListElement = createNewTask({
          ...task,
          onClick: handleTaskClick,
        });
        tasksList.appendChild(tasksListElement);
      }
    });

    tasksList.style.display = "block";
    toggleButton.textContent = "Hide List";
  } else {
    tasksList.style.display = "none";
    toggleButton.textContent = "Show List";
  }
}

const addButton = document.getElementById("addButton");
const toggleButton = document.getElementById("toggleButton");

addButton.addEventListener("click", addTask);
toggleButton.addEventListener("click", toggleList);

async function handleSearchClick() {
  const searchInput = document.getElementById("searchInput");
  const searchText = searchInput.value.toLowerCase();

  const tasks = getTasksFromLocalStorage();

  const filteredTasks = tasks.filter((task) =>
    task.textContent.toLowerCase().includes(searchText)
  );

  const tasksList = document.getElementById("tasksList");

  tasksList.innerHTML = "";

  filteredTasks.forEach((task) => {
    const tasksListElement = createNewTask({
      ...task,
      onClick: handleTaskClick,
    });
    tasksList.appendChild(tasksListElement);
  });
}

const searchButton = document.getElementById("searchButton");

searchButton.addEventListener("click", handleSearchClick);

