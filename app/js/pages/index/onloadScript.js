window.addEventListener("load", async () => {
  const stringDataToken = localStorage.getItem("token");
  const dataToken = JSON.parse(stringDataToken);
  const token = dataToken.token;
  const expires = dataToken.expires;

  if (token && expires > Date.now()) {
    window.location.href = "./userPage.html";
    return;
  }

  getUserCollections();
});
