const getToken = () => {
  const stringDataToken = localStorage.getItem("token");
  const dataToken = JSON.parse(stringDataToken);

  if (dataToken.expires < Date.now()) {
    window.location.href = "./login.html";
    return;
  }

  return dataToken.token;
};

const handleShowCollectionData = (data) => {
  const collection = document.querySelector(".test");
  const collectionData = document.createElement("p");
  collection.innerHTML = JSON.stringify(data);
  collection.appendChild(collectionData);
};

window.addEventListener("load", () => {
  const token = getToken();
  const stringQuery = window.location.search;
  const uriParmas = new URLSearchParams(stringQuery);
  const collectionID = uriParmas.get("id");

  const url = `https://personal-library-kjm4.onrender.com/api/v1/collection/${collectionID}`;
  const collectionData = fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((data) => {
      handleShowCollectionData(data);
    });
});
