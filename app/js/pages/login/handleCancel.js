const cancelBtn = document.querySelector(".btn-cancel");

cancelBtn.addEventListener("click", (event) => {
  event.preventDefault();

  const loginForm = document.querySelector("#login-form");
  loginForm.reset();
});
