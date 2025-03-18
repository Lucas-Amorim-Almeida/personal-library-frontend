const setTag = (data) => {
  if (!data.visibility) {
    return;
  }

  const tag = document.createElement("span");
  tag.className = data.visibility === "private" ? "ep--lock" : "ep--unlock";

  return tag;
};

const setCover = (data) => {
  const coverWrapper = document.createElement("div");
  coverWrapper.className = "image-wrapper";

  if (Object.keys(data).includes("cover_url")) {
    const coverImage = document.createElement("img");
    coverImage.src = data.cover_url;
    //adicionar alt

    coverWrapper.appendChild(coverImage);
  } else {
    const imgNotSupported = document.createElement("span");
    imgNotSupported.className = "ic--outline-image-not-supported image";
    //colocar alt="Imagem representativa de uma coleção"

    coverWrapper.appendChild(imgNotSupported);
  }

  return coverWrapper;
};

const setCardData = (data) => {
  const title = document.createElement("h3");
  title.innerHTML = data.title ?? "";
  return title;
};

const createCardElement = (data) => {
  const cardTag = document.createElement("div");
  cardTag.className = "card-tag";
  cardTag.appendChild(setTag(data));

  const cardImage = document.createElement("div");
  cardImage.className = "card-image";
  cardImage.appendChild(setCover(data));

  const cardData = document.createElement("div");
  cardData.className = "card-data";
  cardData.appendChild(setCardData(data));

  const card = document.createElement("div");
  card.className = "card";
  card.appendChild(cardTag);
  card.appendChild(cardImage);
  card.appendChild(cardData);

  return card;
};

const handleShowCollections = (collections) => {
  const collectionContainer = document.querySelector(".collections-container");
  collections.forEach((collection) => {
    const collectionCard = createCardElement(collection);
    collectionContainer.appendChild(collectionCard);
  });
};

const getUserCollections = async () => {
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
    .then((data) => {
      handleShowCollections(data);
    })
    .catch((error) => console.log(error));
};

window.addEventListener("load", async () => {
  if (!localStorage.getItem("token")) {
    window.location.href = "./login.html";
    return;
  }

  getUserCollections();
});
