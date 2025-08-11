const form = document.getElementById('petForm');
const taskList = document.getElementById('taskList');
const error = document.getElementById('error');
const clock = document.getElementById('clock');
const alertSound = document.getElementById('alertSound');

// Update live clock
setInterval(() => {
  const now = new Date();
  clock.textContent = now.toLocaleTimeString();
  checkTasks(now);
}, 1000);

const tasks = [];

form.addEventListener('submit', e => {
  e.preventDefault();
  const petName = document.getElementById('petName').value.trim();
  const task = document.getElementById('task').value.trim();
  const time = document.getElementById('time').value;

  if (!petName || !task || !time) {
    error.textContent = 'All fields are required!';
    return;
  }
  error.textContent = '';

  const taskObj = { petName, task, time };
  tasks.push(taskObj);
  displayTask(taskObj);

  form.reset();
});

function displayTask(taskObj) {
  const li = document.createElement('li');
  li.innerHTML = `<span><strong>${taskObj.petName}:</strong> ${taskObj.task} at ${taskObj.time}</span>`;

  // Toggle complete
  li.addEventListener('click', () => {
    li.classList.toggle('completed');
  });

  // Delete button
  const delBtn = document.createElement('button');
  delBtn.textContent = '🗑️';
  delBtn.className = 'delete-btn';
  delBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    taskList.removeChild(li);
    const index = tasks.findIndex(t => t.time === taskObj.time && t.task === taskObj.task && t.petName === taskObj.petName);
    if (index > -1) tasks.splice(index, 1);
  });

  li.appendChild(delBtn);
  taskList.appendChild(li);
}

function checkTasks(currentTime) {
  const now = `${currentTime.getHours()}`.padStart(2, '0') + ":" + `${currentTime.getMinutes()}`.padStart(2, '0');
  tasks.forEach(t => {
    if (t.time === now) {
      alertSound.play();
    }
  });
}
