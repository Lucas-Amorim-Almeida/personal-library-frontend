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

const cancelBtn = document.querySelector(".btn-cancel");
cancelBtn.addEventListener("click", (event) => {
  event.preventDefault();

  handelMsgModal(
    {
      icon: "❗",
      msg: "Você será redirecionado para a Home...",
      btnText: "Ok",
    },
    () => {
      document.querySelector("form").reset();
      window.location.href = "./userPage.html";
    }
  );
});
