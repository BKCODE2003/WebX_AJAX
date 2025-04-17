document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrationForm');
  const usernameInput = document.getElementById('username');
  const usernameError = document.getElementById('usernameError');
  const collegeInput = document.getElementById('college');
  const collegeResults = document.getElementById('collegeResults');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');
  const passwordError = document.getElementById('passwordError');
  const successMessage = document.getElementById('successMessage');
  const submitButton = document.getElementById('submitButton');

  collegeInput.addEventListener('input', function () {
    const query = this.value.toLowerCase();
    if (query.length < 2) {
      collegeResults.style.display = 'none';
      return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'colleges.json', true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        const colleges = JSON.parse(xhr.responseText);
        const filtered = colleges.filter(college =>
          college.toLowerCase().includes(query)
        );
        collegeResults.innerHTML = '';
        filtered.forEach(college => {
          const div = document.createElement('div');
          div.textContent = college;
          div.addEventListener('click', () => {
            collegeInput.value = college;
            collegeResults.style.display = 'none';
          });
          collegeResults.appendChild(div);
        });
        collegeResults.style.display = filtered.length ? 'block' : 'none';
      }
    };
    xhr.send();
  });

  document.addEventListener('click', function (e) {
    if (e.target !== collegeInput && e.target !== collegeResults) {
      collegeResults.style.display = 'none';
    }
  });

  function checkPasswordMatch() {
    if (password.value !== confirmPassword.value) {
      passwordError.textContent = 'Passwords do not match';
      return false;
    } else {
      passwordError.textContent = '';
      return true;
    }
  }

  confirmPassword.addEventListener('input', checkPasswordMatch);

  usernameInput.addEventListener('blur', () => {
    const username = usernameInput.value.trim();

    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'users.json', true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        const users = JSON.parse(xhr.responseText);
        if (users.includes(username)) {
          usernameError.textContent = 'Username already exists.';
        } else {
          usernameError.textContent = '';
        }
      }
    };
    xhr.send();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!checkPasswordMatch()) return;

    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => (data[key] = value));

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'server.php', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
      if (xhr.status === 200) {
        if (xhr.responseText === 'success') {
          successMessage.style.display = 'block';
          setTimeout(() => {
            successMessage.style.display = 'none';
            form.reset();
          }, 10000);
        } else {
          alert('Error: ' + xhr.responseText);
        }
        submitButton.disabled = false;
        submitButton.textContent = 'Register';
      }
    };
    xhr.send(JSON.stringify(data));

    submitButton.disabled = true;
    submitButton.textContent = 'Registering...';
  });
});
