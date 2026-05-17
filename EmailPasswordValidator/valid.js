let email = document.querySelector("#email");
let password = document.querySelector("#password");
let form = document.querySelector(".form-box");
let resetBtn = document.querySelector("#resetBtn");

form.addEventListener("submit", function(details){

    details.preventDefault();
    
    document.querySelectorAll(".errorText").forEach(function(error){
        error.textContent = "";
        error.style.display = "none";
        error.style.color = "";
    });

    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    let emailValid = emailRegex.test(email.value);
    let passwordValid = passwordRegex.test(password.value);

    let isValid = true;

    if (emailValid === false) {
        document.querySelector("#emailError").style.color = "rgb(200, 0, 90)";
        document.querySelector("#emailError").textContent = "Please enter a valid email address.";
        document.querySelector("#emailError").style.display = "block";
        isValid = false;
    }

    if (passwordValid === false) {
        document.querySelector("#passwordError").style.color = "rgb(200, 0, 90)";
        document.querySelector("#passwordError").textContent = "Please enter a valid password.";
        document.querySelector("#passwordError").style.display = "block";
        isValid = false;
    }

    if (isValid === true) {
        document.querySelectorAll(".errorText").forEach(function(error){
            error.style.color = "rgb(0, 100, 0)";
            error.textContent = "✅ Valid";
            error.style.display = "block";
        });
    }

    
});
