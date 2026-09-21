const addForm      = document.getElementById('addForm');
const nameInput     = document.getElementById('nameInput');
const idInput       = document.getElementById('idInput');
const deptInput     = document.getElementById('deptInput');
const statusInput   = document.getElementById('statusInput');

const studentsList  = document.getElementById('studentsList');
const emptyState    = document.getElementById('emptyState');
const searchInput   = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');

const statTotal    = document.getElementById('statTotal');
const statActive   = document.getElementById('statActive');
const statInactive = document.getElementById('statInactive');

const darkToggle = document.getElementById('darkToggle');
const darkIcon   = document.getElementById('darkIcon');
const darkLabel  = document.getElementById('darkLabel');

let students = [];
let currentFilter = 'all';
let searchTerm = '';

addForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const studentId = idInput.value.trim();
  const department = deptInput.value.trim();
  const status = statusInput.value;

  if (!name || !studentId) {
    nameInput.focus();
    return;
  }

  students.push({
    id: crypto.randomUUID(),
    name,
    studentId,
    department: department || '—',
    status
  });

  addForm.reset();
  render();
});

searchInput.addEventListener('input', function (event) {
  searchTerm = event.target.value.trim().toLowerCase();
  render();
});

filterButtons.forEach(function (btn) {
  btn.addEventListener('click', function () {
    filterButtons.forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    currentFilter = btn.getAttribute('data-filter');
    render();
  });
});

darkToggle.addEventListener('click', function () {
  const root = document.documentElement;
  const isDark = root.getAttribute('data-theme') === 'dark';
  root.setAttribute('data-theme', isDark ? 'light' : 'dark');
  darkIcon.textContent = isDark ? '🌙' : '☀️';
  darkLabel.textContent = isDark ? 'Dark mode' : 'Light mode';
  darkToggle.setAttribute('aria-pressed', String(!isDark));
});

function render() {
  const visible = students.filter(function (s) {
    const matchesFilter = currentFilter === 'all' || s.status === currentFilter;
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm) ||
      s.studentId.toLowerCase().includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  studentsList.textContent = '';

  if (visible.length === 0) {
    emptyState.classList.remove('hidden');
    studentsList.classList.add('hidden');
  } else {
    emptyState.classList.add('hidden');
    studentsList.classList.remove('hidden');
  }

  visible.forEach(function (student) {
    studentsList.appendChild(buildStudentCard(student));
  });

  updateStats();
}

function buildStudentCard(student) {
  const card = document.createElement('div');
  card.className = 'student-card';
  card.setAttribute('data-id', student.id);

  const nameEl = document.createElement('h3');
  nameEl.textContent = student.name;

  const idEl = document.createElement('p');
  idEl.className = 'meta-line';
  idEl.textContent = 'ID: ' + student.studentId;

  const deptEl = document.createElement('p');
  deptEl.className = 'meta-line';
  deptEl.textContent = 'Department: ' + student.department;

  const badge = document.createElement('span');
  badge.className = 'badge ' + student.status;
  badge.textContent = student.status === 'active' ? 'Active' : 'Inactive';

  const actions = document.createElement('div');
  actions.className = 'student-actions';

  const toggleBtn = document.createElement('button');
  toggleBtn.type = 'button';
  toggleBtn.className = 'toggle-btn';
  toggleBtn.textContent = 'Toggle Status';
  toggleBtn.addEventListener('click', function () {
    toggleStatus(student.id);
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', function () {
    deleteStudent(student.id);
  });

  actions.appendChild(toggleBtn);
  actions.appendChild(deleteBtn);

  card.appendChild(nameEl);
  card.appendChild(idEl);
  card.appendChild(deptEl);
  card.appendChild(badge);
  card.appendChild(actions);

  return card;
}

function toggleStatus(id) {
  const student = students.find(function (s) { return s.id === id; });
  if (!student) return;
  student.status = student.status === 'active' ? 'inactive' : 'active';
  render();
}

function deleteStudent(id) {
  students = students.filter(function (s) { return s.id !== id; });
  render();
}

function updateStats() {
  const total = students.length;
  const active = students.filter(function (s) { return s.status === 'active'; }).length;
  const inactive = total - active;

  statTotal.textContent = total;
  statActive.textContent = active;
  statInactive.textContent = inactive;
}

render();