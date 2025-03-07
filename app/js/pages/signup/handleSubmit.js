const uriAPI = "https://personal-library-kjm4.onrender.com/api/v1";

const form = document.querySelector("form");

const phoneAssembler = () => {
  const phone = document.querySelector("#phone");
  const phone2 = document.querySelector("#phone2");
  const phones = [phone.value.trim()];
  if (!!phone2.value) {
    phones.push(phone2.value.trim());
  }
  return phones;
};

const birthDateValidate = () => {
  const birth = document.querySelector("#birth-date").value;

  const birthDate = new Date(birth);
  const today = new Date();

  // Zerar horas, minutos e segundos para comparar apenas as datas
  birthDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return birthDate.getTime() < today.getTime();
};

const fetchData = async (formData) => {
  const response = await fetch(`${uriAPI}/user`, {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    //exibição do modal de mensagem de erro
    handelMessageModal({
      icon: "❌",
      msg: "Erro ao criar usuário",
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
        window.location.href = "./login.html";
      }
    );
  }
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

const confirmModalContentAssembler = (formData) => {
  document.querySelector("#tbl-fullname").innerHTML =
    formData.personal_data.name;
  document.querySelector("#tbl-birthdate").innerHTML =
    formData.personal_data.birth_date;
  document.querySelector("#tbl-email").innerHTML = formData.contact.email;
  document.querySelector("#tbl-phone").innerHTML = formData.contact.phone[0];
  document.querySelector("#tbl-phone2").innerHTML =
    formData.contact.phone[1] ?? "";
  document.querySelector("#tbl-username").innerHTML = formData.username;
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
    handelMessageModal({
      icon: "⌛",
      msg: "Processado...",
      btnText: "",
      btnDisplayProp: "none",
    });

    await fetchData(formData);
  });
};

//evento de submissão do formulário
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  //Validação de igualdade entre senha e confirmar senha
  const password = document.querySelector("#password").value;
  const confirmPassword = document.querySelector("#confirm-password").value;
  if (password !== confirmPassword) {
    handelMessageModal({
      icon: "❌",
      msg: "As senhas não coincidem!",
      btnText: "Ok",
    });
    return;
  }

  //validação da data de nascimento
  if (!birthDateValidate()) {
    handelMessageModal({
      icon: "❌",
      msg: "A data de nascimento não pode ser uma data futura.",
      btnText: "Ok",
    });
    return;
  }

  //captura dos dados do formulário
  const formData = new FormData(form);
  const userData = {
    username: formData.get("username").trim(),
    password: formData.get("password"),
    contact: {
      email: formData.get("email").trim(),
      phone: phoneAssembler(),
    },
    personal_data: {
      name: formData.get("full-name"),
      birth_date: formData.get("birth-date"),
    },
  };

  //exibição do modal de confirmação
  handleConfirmModal(userData);
});
