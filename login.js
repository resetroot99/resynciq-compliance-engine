document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  // You can replace this with a real authentication API call.
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  if (username && password) {
    // On successful login, redirect to the dashboard.
    window.location.href = 'dashboard.html';
  } else {
    alert('Invalid credentials');
  }
}); 