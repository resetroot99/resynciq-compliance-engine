function showLogin() {
    document.getElementById("loginModal").style.display = "block";
}

function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (username === "trial" && password === "test123") {
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid login. Use trial credentials: trial / test123");
    }
} 