const cancelBtn = document.querySelector(".btn-cancel");

cancelBtn.addEventListener("click", (event) => {
  event.preventDefault();

  document.querySelector("form").reset();
});
