const handleCloseModal = (modalName, formName) => {
  if (modalName) {
    const nodeForms = document.querySelectorAll(formName);
    nodeForms.forEach((node) => node.reset());
  }
  const nodes = document.querySelectorAll(modalName);
  nodes.forEach((node) => (node.style.display = "none"));
};

const cancelBtn = document.querySelectorAll(".btn-cancel");
cancelBtn.forEach((btn) =>
  btn.addEventListener("click", (event) => {
    event.preventDefault();

    handleCloseModal(".modal", "form");
  })
);
const uriAPI = "https://personal-library-kjm4.onrender.com/api/v1";

const saveCollection = async (formData) => {
  const stringDataToken = localStorage.getItem("token");
  const dataToken = JSON.parse(stringDataToken);
  const token = dataToken.token;

  const response = await fetch(`${uriAPI}/collection`, {
    method: "post",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    //exibição do modal de mensagem de erro
    handelMessageModal({
      icon: "❌",
      msg: "Erro ao criar Coleção",
      btnText: "tentar novamente",
    });
  } else {
    //exibição do modal de mensagem de sucesso
    handelMessageModal(
      {
        icon: "✔",
        msg: "Sucesso",
        btnText: "ok",
      },
      () => {
        // função com redirecionamento para página de login
        handleCloseModal();
        window.location.href = "./userPage.html";
      }
    );
  }
};

const fetchBooks = async () => {
  const inputSearch = document.querySelector("#find-book").value;
  if (!inputSearch) {
    return;
  }

  const queryParams = new URLSearchParams([
    ["title", inputSearch],
    ["take", 10],
  ]);
  const searchURL = new URL(`${uriAPI}/book/search?${queryParams}`);

  const result = await fetch(searchURL);
  if (!result.ok) {
    console.log(result);
    return;
  }

  const books = await result.json();
  return books;
};

const handelMessageModal = (
  { icon, msg, btnText, btnDisplayProp = "block" },
  action = () => {}
) => {
  //inserção das informações da mensagem e seus respoectivos campos
  const modal = document.querySelector(".msg-modal");
  const actionBtn = document.querySelector(".action-btn");
  const popupIcon = document.querySelector(".popup-icon");
  const popupMsg = document.querySelector(".popup-message");

  popupIcon.innerHTML = icon;
  popupMsg.innerHTML = msg;
  actionBtn.innerHTML = btnText;
  actionBtn.style.display = btnDisplayProp;

  //evento de clique no botão do modal de mensagem
  actionBtn.addEventListener("click", () => {
    action();
    modal.style.display = "none";
  });

  modal.style.display = "flex";
};

const createElements = (books) => {
  const tBody = document.createElement("tbody");
  tBody.className = "book-list";

  books.forEach((book, index) => {
    const row = document.createElement("tr");
    row.className = "row-list";

    const indexCol = document.createElement("td");
    indexCol.className = "index-row";
    indexCol.innerHTML = index + 1;

    const bookCol = document.createElement("td");
    bookCol.className = "element-row";
    bookCol.innerHTML = `${book.title}, ${book.publication_year}`;

    row.appendChild(indexCol);
    row.appendChild(bookCol);
    tBody.appendChild(row);
  });

  return tBody;
};

const bookSelection = () => {
  const rows = document.querySelectorAll(".row-list");
  rows.forEach((row) => {
    row.addEventListener("click", () => {
      if (row.classList.contains("is-selected")) {
        row.classList.remove("is-selected");
      } else {
        row.classList.add("is-selected");
      }
    });
  });
};

const handleSearchBook = (collectionData) => {
  const btnSearchInput = document.querySelector("#btn-find-book");

  btnSearchInput.addEventListener("click", async () => {
    const books = await fetchBooks();

    //criação da table com livros retornados pela api
    const foundBooksList = document.querySelector("#found-books-list");
    if (foundBooksList.childElementCount > 0) {
      foundBooksList.removeChild(foundBooksList.firstElementChild);
    }
    const tableBody = createElements(books);
    foundBooksList.appendChild(tableBody);

    bookSelection();
    const addBookToCollection = document.querySelector("#submit-collection");
    addBookToCollection.addEventListener("click", async (event) => {
      event.preventDefault();

      const selectedRows = document.querySelectorAll(".is-selected");
      const bookNames = [];
      selectedRows.forEach((row) => {
        bookNames.push(row.lastElementChild.innerHTML.split(",")[0]);
      });

      const selectedBooks = books.filter((book) =>
        bookNames.includes(book.title)
      );
      collectionData.books_collection = selectedBooks.map((book) => ({
        book_id: book._id,
        status: "Leitura pendente",
      }));

      //exibição do modal de mensagem: prossando...
      handelMessageModal({
        icon: "⌛",
        msg: "Processado...",
        btnText: "",
        btnDisplayProp: "none",
      });

      await saveCollection(collectionData);

      handleCloseModal(".modal", "form");
    });
  });
};

const createCollectionModal = document.querySelector(".create-collection");
createCollectionModal.addEventListener("submit", async (event) => {
  event.preventDefault();

  const form = document.querySelector("#create-collection-form");
  const formData = new FormData(form);
  const collectionData = {
    title: formData.get("title"),
    description: formData.get("description"),
    visibility: formData.get("visibility"),
    books_collection: [],
  };

  document.querySelector(".add-book-collection").style.display = "flex";
  handleSearchBook(collectionData);
});
