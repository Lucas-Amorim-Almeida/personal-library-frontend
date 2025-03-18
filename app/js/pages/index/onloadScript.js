window.addEventListener("load", async () => {
  if (localStorage.getItem("token")) {
    window.location.href = "./userPage.html";
    return;
  }

  getUserCollections();
});
