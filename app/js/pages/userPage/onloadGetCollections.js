window.addEventListener("load", async () => {
  const userID = localStorage.getItem("userID");
  const token = localStorage.getItem("token");
  const url = `https://personal-library-kjm4.onrender.com/api/v1/collection/user/${userID.slice(
    1,
    userID.length - 1
  )}`;
  const userCollections = fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token.slice(1, token.length - 1)}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
});
