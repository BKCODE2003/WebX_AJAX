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
  
      fetch('colleges.json')
        .then(res => res.json())
        .then(colleges => {
          const filtered = colleges.filter(college => college.toLowerCase().includes(query));
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
        });
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
      fetch('users.json')
        .then(res => res.json())
        .then(users => {
          if (users.includes(username)) {
            usernameError.textContent = 'Username already exists.';
          } else {
            usernameError.textContent = '';
          }
        });
    });
  
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!checkPasswordMatch()) return;
  
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
  
      fetch('server.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(res => res.text())
        .then(msg => {
          if (msg === 'success') {
            successMessage.style.display = 'block';
            form.reset();
            setTimeout(() => successMessage.style.display = 'none', 3000);
          } else {
            alert('Error: ' + msg);
          }
          submitButton.disabled = false;
          submitButton.textContent = 'Register';
        });
  
      submitButton.disabled = true;
      submitButton.textContent = 'Registering...';
    });
  });
  