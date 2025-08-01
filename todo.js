// Save a cookie
function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
}

// Read a cookie
function getCookie(name) {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r
  }, '');
}


const taskInput = document.getElementById("new-task");
const addBtn = document.getElementById("add-task");
const taskList = document.getElementById("task-list");

addBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  const li = document.createElement("li");

  // ✅ Checkbox
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.style.marginRight = "10px";
  checkbox.addEventListener("change", () => {
    span.style.textDecoration = checkbox.checked ? "line-through" : "none";
    span.style.opacity = checkbox.checked ? "0.6" : "1";
  });
  li.appendChild(checkbox);

  // 📝 Task Text
  const span = document.createElement("span");
  span.textContent = taskText;
  span.style.flex = "1";
  span.style.marginLeft = "10px";
  li.appendChild(span);

  // 🗑️ Delete icon
  const deleteIcon = document.createElement("span");
  deleteIcon.textContent = "🗑️";
  deleteIcon.style.cursor = "pointer";
  deleteIcon.addEventListener("click", () => li.remove());

  li.appendChild(deleteIcon);
  taskList.appendChild(li);
  taskInput.value = "";
  saveTasksToCookie();
});
function saveTasksToCookie() {
  const tasks = [];
  document.querySelectorAll("#task-list li").forEach(li => {
    const span = li.querySelector("span");
    const checkbox = li.querySelector("input[type='checkbox']");
    tasks.push({
      text: span.textContent,
      done: checkbox.checked
    });
  });
  setCookie("tasks", JSON.stringify(tasks), 7);
}
window.addEventListener("DOMContentLoaded", () => {
  const saved = getCookie("tasks");
  if (!saved) return;

  const tasks = JSON.parse(saved);
  tasks.forEach(task => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.style.marginRight = "10px";

    const span = document.createElement("span");
    span.textContent = task.text;
    span.style.flex = "1";
    span.style.marginLeft = "10px";

    checkbox.addEventListener("change", () => {
      span.style.textDecoration = checkbox.checked ? "line-through" : "none";
      span.style.opacity = checkbox.checked ? "0.6" : "1";
      saveTasksToCookie();
    });

    if (task.done) {
      checkbox.checked = true;
      span.style.textDecoration = "line-through";
      span.style.opacity = "0.6";
    }

    const deleteIcon = document.createElement("span");
    deleteIcon.textContent = "🗑️";
    deleteIcon.style.cursor = "pointer";
    deleteIcon.addEventListener("click", () => {
      li.remove();
      saveTasksToCookie();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteIcon);
    taskList.appendChild(li);
  });
});