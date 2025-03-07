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

const fetchData = async (formData) => {
  const uriAPI = "https://personal-library-kjm4.onrender.com/api/v1";

  handelMessageModal({
    icon: "⌛",
    msg: "Processando...",
    btnText: "",
    btnDisplayProp: "none",
  });

  const response = await fetch(`${uriAPI}/user/login`, {
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
      msg: "Erro ao logar",
      btnText: "tentar novamente",
    });
    return;
  }

  const user = await response.json();

  localStorage.setItem("token", JSON.stringify(user.token));
  localStorage.setItem("username", JSON.stringify(user.username));

  //exibição do modal de mensagem de sucesso
  setTimeout(
    () =>
      handelMessageModal(
        {
          icon: "✔",
          msg: "Sucesso ao fazer login!",
          btnText: "ok",
        },
        () => {
          // função com redirecionamento para página de login
          window.location.href = "./userPage.html";
        }
      ),
    3000
  );
};

const loginForm = document.querySelector("#login-form");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(loginForm);
  const userData = {
    username: formData.get("username"),
    password: formData.get("password"),
  };

  fetchData(userData);
});
