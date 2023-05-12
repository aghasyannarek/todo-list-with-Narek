function showLoading() {
  return new Promise((res) => {
    const loading = document.getElementById("loading");
    loading.style.display = "block";
    setTimeout(() => {
      loading.style.display = "none";
      res();
    }, 1000);
  });
}

function getTasksFromLocalStorage() {
const listElements = JSON.parse(localStorage.getItem("tasks") ?? `[]`);
return listElements;
}

function setTasksToLocalStorage(newTasks) {
localStorage.setItem("tasks", JSON.stringify(newTasks));
}

function createNewTask({ id, isCompleted, textContent, onClick, }) {
  const li = document.createElement("li");
  li.setAttribute("data-id", id);
  if (isCompleted) {
    li.classList.add("completed");
  }
  li.appendChild(document.createTextNode(textContent));
  li.addEventListener("click", onClick);

  return li;
}


const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    searchButton.click();
  }
});


const taskInput = document.getElementById("taskInput");

taskInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    addButton.click();
  }
});