const uriAPI = "https://personal-library-kjm4.onrender.com/api/v1";

const form = document.querySelector("form");

const fetchData = async (formData) => {
  const stringDataToken = localStorage.getItem("token");
  const dataToken = JSON.parse(stringDataToken);
  const token = dataToken.token;

  const response = await fetch(`${uriAPI}/book`, {
    method: "post",
    headers: {
      "Content-type": "application/json",
      //deve-se remover as aspas que vem no token salvo no localStorage
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    //exibição do modal de mensagem de erro
    handelMsgModal({
      icon: "❌",
      msg: "Erro ao adicionar Livro",
      btnText: "tentar novamente",
    });
  } else {
    //exibição do modal de mensagem de sucesso
    console.log(await response.json());
    handelMsgModal(
      {
        icon: "✔",
        msg: "Sucesso",
        btnText: "ok",
      },
      () => {
        // função com redirecionamento para página de login
        window.location.href = "./userPage.html";
      }
    );
  }
};

const handelMsgModal = (
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

const confirmModalContentAssembler = (formData) => {
  document.querySelector("#tbl-title").innerHTML = formData.title;
  document.querySelector("#tbl-author").innerHTML = formData.author.join("; ");
  document.querySelector("#tbl-year").innerHTML = formData.publication_year;
  document.querySelector("#tbl-edition").innerHTML = formData.edition;
  document.querySelector("#tbl-volume").innerHTML = formData.volume ?? "";
  document.querySelector("#tbl-publisher").innerHTML = formData.publisher;
  document.querySelector("#tbl-city").innerHTML = formData.publication_location;
  document.querySelector("#tbl-isbn").innerHTML = formData.isbn;
  document.querySelector("#tbl-genre").innerHTML = formData.genre.join("; ");
};

const handleConfirmModal = (formData) => {
  const confirmModal = document.querySelector(".confirm-modal");
  confirmModalContentAssembler(formData);

  //exibir o modal de confimação de dados
  confirmModal.style.display = "flex";

  //evento do botão cancelar
  document
    .querySelector("#cancel-submit")
    .addEventListener("click", () => (confirmModal.style.display = "none"));

  //evendo do botão submeter
  document.querySelector("#submit-data").addEventListener("click", async () => {
    //fechamento do modal
    confirmModal.style.display = "none";

    //exibição do modal de mensagem: prossando...
    const actionBtn = document.querySelector(".action-btn");
    handelMsgModal({
      icon: "⌛",
      msg: "Processado...",
      btnText: "",
      btnDisplayProp: "none",
    });

    await fetchData(formData);
  });
};

const validateData = (formData) => {
  //validação do ano de publicação
  if (
    formData.publication_year < 0 &&
    formData.publication_year > new Date().getFullYear()
  ) {
    handelMsgModal(
      {
        icon: "❌",
        msg: "A data de publicação inválida.",
        btnText: "Tentar novamente",
      },
      () => {
        const inputField = document.querySelector("#year");
        inputField.innerHTML = "";
        inputField.focus();
      }
    );
    return false;
  }

  //validação de volume
  if (formData.volume && formData.volume < 0) {
    handelMsgModal(
      {
        icon: "❌",
        msg: "O volume inválido.",
        btnText: "Tentar novamente",
      },
      () => {
        const inputField = document.querySelector("#volume");
        inputField.innerHTML = "";
        inputField.focus();
      }
    );
    return false;
  }

  //validaçao dos generos
  if (formData.genre.length === 0) {
    handelMsgModal({
      icon: "❌",
      msg: "Selecione pelo menos um genero.",
      btnText: "Tentar novamente",
    });
    return false;
  }

  //validação de volume
  if (!formData.volume) {
    delete formData.volume;
  }
  //validação de isbn
  if (!formData.isbn) {
    delete formData.isbn;
  }

  return true;
};

//evento de submissão do formulário
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  //captura dos dados do formulário
  const formData = new FormData(form);
  const bookData = {
    title: formData.get("title"),
    author: formData.get("author").split("; "),
    publication_year: parseInt(formData.get("year")),
    edition: formData.get("edition"),
    volume: parseInt(formData.get("volume")) ?? undefined,
    publisher: formData.get("publisher"),
    publication_location: formData.get("publication-place"),
    isbn: formData.get("isbn") ?? undefined,
    genre: formData.getAll("genres"),
  };

  //exibição do modal de confirmação após validação
  if (validateData(bookData)) {
    handleConfirmModal(bookData);
  }
});
