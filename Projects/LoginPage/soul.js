function openTab(evt, tabName) {
    const tabContent = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }

    const tabButtons = document.getElementsByClassName("tab-btn");
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove("active");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
}

function validateLoginForm() {
    const username = document.getElementById("Uname").value;
    const password = document.getElementById("Pass").value;

    if (username.trim() === "") {
        showModal("Please enter your username.");
        return false;
    }

    if (password.trim() === "") {
        showModal("Please enter your password.");
        return false;
    }

    if (password.length < 6) {
        showModal("Password must be at least 6 characters long.");
        return false;
    }

    return true;
}

function validateSignUpForm() {
    const username = document.getElementById("SignUpUname").value;
    const email = document.getElementById("SignUpEmail").value;
    const password = document.getElementById("SignUpPass").value;
    const confirmPassword = document.getElementById("SignUpConfirmPass").value;


    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    if (username.trim() === "" || !alphanumericRegex.test(username)) {
        showModal("Please enter a valid username (alphanumeric characters only).");
        return false;
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim() === "" || !emailRegex.test(email)) {
        showModal("Please enter a valid email address.");
        return false;
    }


    const passwordStrengthRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/;
    if (password.trim() === "" || !passwordStrengthRegex.test(password)) {
        showModal("Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, and one digit.");
        return false;
    }

    if (confirmPassword.trim() === "") {
        showModal("Please confirm your password.");
        return false;
    }

    if (password !== confirmPassword) {
        showModal("Passwords do not match.");
        return false;
    }


    const termsAndConditionsChecked = document.getElementById("termsAndConditions").checked;
    if (!termsAndConditionsChecked) {
        showModal("Please accept the Terms and Conditions to proceed with the sign-up.");
        return false;
    }

    return true;
}

function forgotPassword() {
    const username = document.getElementById("ForgotUname").value;
    if (username.trim() === "") {
        showModal("Please enter your username to reset the password.");
        return false;
    }

    showModal("Password reset link has been sent to the email associated with the username: " + username);
    return false;
}

function showModal(message) {
    document.getElementById("modalMessage").innerText = message;
    const modal = document.getElementById("myModal");
    modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById("myModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};