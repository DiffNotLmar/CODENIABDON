
let students = [];


document.addEventListener('DOMContentLoaded', function() {
    loadStudents();
    setupEventListeners();
    displayAllStudents();
});


function setupEventListeners() {
    
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });

    
    document.getElementById('studentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addStudent();
    });

    
    document.getElementById('editForm').addEventListener('submit', function(e) {
        e.preventDefault();
        updateStudent();
    });

    
    document.querySelector('.close').addEventListener('click', closeEditModal);

    
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('editModal');
        if (e.target === modal) {
            closeEditModal();
        }
    });

    
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchStudent();
        }
    });
}


function loadStudents() {
    const stored = localStorage.getItem('students');
    students = stored ? JSON.parse(stored) : [];
}


function saveStudents() {
    localStorage.setItem('students', JSON.stringify(students));
}


function switchTab(tabName) {
    
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));

    
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(btn => btn.classList.remove('active'));

    
    document.getElementById(tabName).classList.add('active');

    
    event.target.classList.add('active');

    
    if (tabName === 'view-students') {
        displayAllStudents();
    }
}


function addStudent() {
    const studentId = document.getElementById('studentId').value.trim();
    const studentName = document.getElementById('studentName').value.trim();
    const studentCourse = document.getElementById('studentCourse').value.trim();
    const studentYear = document.getElementById('studentYear').value;
    const studentAge = document.getElementById('studentAge').value;

    const messageDiv = document.getElementById('addMessage');

    
    if (!studentId || !studentName || !studentCourse || !studentYear || !studentAge) {
        showMessage('Please fill all fields', 'error', messageDiv);
        return;
    }

    
    if (students.find(s => s.id === studentId)) {
        showMessage('Student ID already exists!', 'error', messageDiv);
        return;
    }

  
    const newStudent = {
        id: studentId,
        name: studentName,
        course: studentCourse,
        year: studentYear,
        age: parseInt(studentAge),
        dateAdded: new Date().toLocaleDateString()
    };

    
    students.push(newStudent);
    saveStudents();

    
    document.getElementById('studentForm').reset();

    
    showMessage('Student added successfully!', 'success', messageDiv);

    
    setTimeout(() => {
        messageDiv.classList.remove('success', 'error');
    }, 3000);
}


function displayAllStudents() {
    const container = document.getElementById('studentsContainer');

    if (students.length === 0) {
        container.innerHTML = '<p class="empty-message">No students found. Add a student to get started.</p>';
        return;
    }

    container.innerHTML = students.map(student => `
        <div class="student-card">
            <div class="student-info">
                <div class="info-field">
                    <span class="info-label">Student ID</span>
                    <span class="info-value">${escapeHTML(student.id)}</span>
                </div>
                <div class="info-field">
                    <span class="info-label">Name</span>
                    <span class="info-value">${escapeHTML(student.name)}</span>
                </div>
                <div class="info-field">
                    <span class="info-label">Course</span>
                    <span class="info-value">${escapeHTML(student.course)}</span>
                </div>
                <div class="info-field">
                    <span class="info-label">Year Level</span>
                    <span class="info-value">${escapeHTML(student.year)}</span>
                </div>
                <div class="info-field">
                    <span class="info-label">Age</span>
                    <span class="info-value">${student.age} years</span>
                </div>
                <div class="info-field">
                    <span class="info-label">Date Added</span>
                    <span class="info-value">${student.dateAdded}</span>
                </div>
            </div>
            <div class="student-actions">
                <button class="btn btn-warning" onclick="openEditModal('${escapeHTML(student.id)}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteStudent('${escapeHTML(student.id)}')">Delete</button>
            </div>
        </div>
    `).join('');
}


function searchStudent() {
    const searchOption = document.getElementById('searchOption').value;
    const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
    const resultsDiv = document.getElementById('searchResults');

    if (!searchInput) {
        resultsDiv.innerHTML = '<p class="empty-message">Enter a search term to find students.</p>';
        return;
    }

    let results = [];

    if (searchOption === 'id') {
        results = students.filter(s => s.id.toLowerCase().includes(searchInput));
    } else if (searchOption === 'name') {
        results = students.filter(s => s.name.toLowerCase().includes(searchInput));
    }

    if (results.length === 0) {
        resultsDiv.innerHTML = '<p class="empty-message">No students found matching your search.</p>';
        return;
    }

    resultsDiv.innerHTML = results.map(student => `
        <div class="student-card">
            <div class="student-info">
                <div class="info-field">
                    <span class="info-label">Student ID</span>
                    <span class="info-value">${escapeHTML(student.id)}</span>
                </div>
                <div class="info-field">
                    <span class="info-label">Name</span>
                    <span class="info-value">${escapeHTML(student.name)}</span>
                </div>
                <div class="info-field">
                    <span class="info-label">Course</span>
                    <span class="info-value">${escapeHTML(student.course)}</span>
                </div>
                <div class="info-field">
                    <span class="info-label">Year Level</span>
                    <span class="info-value">${escapeHTML(student.year)}</span>
                </div>
                <div class="info-field">
                    <span class="info-label">Age</span>
                    <span class="info-value">${student.age} years</span>
                </div>
                <div class="info-field">
                    <span class="info-label">Date Added</span>
                    <span class="info-value">${student.dateAdded}</span>
                </div>
            </div>
            <div class="student-actions">
                <button class="btn btn-warning" onclick="openEditModal('${escapeHTML(student.id)}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteStudent('${escapeHTML(student.id)}')">Delete</button>
            </div>
        </div>
    `).join('');
}


function openEditModal(studentId) {
    const student = students.find(s => s.id === studentId);

    if (!student) {
        alert('Student not found!');
        return;
    }

    
    document.getElementById('editStudentId').value = student.id;
    document.getElementById('editStudentName').value = student.name;
    document.getElementById('editStudentCourse').value = student.course;
    document.getElementById('editStudentYear').value = student.year;
    document.getElementById('editStudentAge').value = student.age;

    
    document.getElementById('editModal').classList.add('active');
}


function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
}


function updateStudent() {
    const studentId = document.getElementById('editStudentId').value;
    const studentName = document.getElementById('editStudentName').value.trim();
    const studentCourse = document.getElementById('editStudentCourse').value.trim();
    const studentYear = document.getElementById('editStudentYear').value;
    const studentAge = document.getElementById('editStudentAge').value;

    if (!studentName || !studentCourse || !studentYear || !studentAge) {
        alert('Please fill all fields!');
        return;
    }

    
    const student = students.find(s => s.id === studentId);
    if (student) {
        student.name = studentName;
        student.course = studentCourse;
        student.year = studentYear;
        student.age = parseInt(studentAge);

        saveStudents();
        displayAllStudents();
        closeEditModal();
        alert('Student updated successfully!');
    }
}


function deleteStudent(studentId) {
    if (confirm('Are you sure you want to delete this student?')) {
        students = students.filter(s => s.id !== studentId);
        saveStudents();
        displayAllStudents();
        document.getElementById('searchResults').innerHTML = '';
        alert('Student deleted successfully!');
    }
}


function showMessage(message, type, element) {
    element.textContent = message;
    element.className = `message ${type}`;
}


function escapeHTML(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
