const urlProd = "https://mylist-pjbelo.herokuapp.com";
const urlDev = "http://localhost:8080";
const urlBase = urlProd;
let isNew = true;

window.onload = () => {
  // References to HTML objects
  const tblStates = document.getElementById("tblStates");
  const frmState = document.getElementById("frmState");

  frmState.addEventListener("submit", async (event) => {
    event.preventDefault();
    const txtName = document.getElementById("txtName").value;
    const txtStateId = document.getElementById("txtStateId").value;

    // Verifica flag isNew para saber se se trata de uma adição ou de um atualização dos dados de um estado
    let response;
    if (isNew) {
      // Adiciona Estado
      console.log("Create State");
      response = await fetch(`${urlBase}/states`, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
        body: `name=${txtName}`,
      });
      const newStateId = response.headers.get("Location");
      console.log(response);
      const newState = await response.json();
    } else {
      // Atualiza Estado
      response = await fetch(`${urlBase}/states/${txtStateId}`, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "PUT",
        body: `name=${txtName}`,
      });

      const newState = await response.json();
    }
    isNew = true;
    document.getElementById("btn_submit").innerText =
    "Criar Estado";
    renderStates();
  });

  ///////////// render lista de estados //////////////
  const renderStates = async () => {
    frmState.reset();
    let strHtml = `
            <thead >
                <tr><th class='w-100 text-center bg-warning' colspan='4'>Lista de Estados</th></tr>
                <tr class='bg-info'>
                    <th class='w-2'>#</th>
                    <th class='w-50'>Nome do estado</th>
                    <th class='w-10 text-center'>Editar | Apagar</th>              
                </tr> 
            </thead><tbody>
        `;
    const response = await fetch(`${urlBase}/states`);
    const states = await response.json();

    let i = 1;
    for (const state of states) {
      strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${state.name}</td>
                    <td class="text-center">
                        <i id='${state.state_id}' class='fas fa-edit edit'></i> | 
                        <i id='${state.state_id}' class='fas fa-trash-alt remove'></i>
                    </td>
                </tr>
            `;
      i++;
    }
    strHtml += "</tbody>";
    tblStates.innerHTML = strHtml;

    //////////////////// Editar ////////////////////
    const btnEdit = document.getElementsByClassName("edit");
    for (let i = 0; i < btnEdit.length; i++) {
      btnEdit[i].addEventListener("click", () => {
        isNew = false;
        document.getElementById("btn_submit").innerText =
          "Atualizar Estado";
        for (const state of states) {
          if (state.state_id == btnEdit[i].getAttribute("id")) {
            document.getElementById("txtStateId").value =
              state.state_id;
            document.getElementById("txtName").value = state.name;
          }
        }
      });
    }

    ///////////////// Apagar //////////////////
    const btnDelete = document.getElementsByClassName("remove");
    for (let i = 0; i < btnDelete.length; i++) {
      btnDelete[i].addEventListener("click", () => {
        swal({
          title: "Tem a certeza?",
          text: "Não será possível reverter a remoção!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancelar",
          confirmButtonText: "Remover",
        }).then(async (result) => {
          if (result.value) {
            let stateId = btnDelete[i].getAttribute("id");
            try {
              const response = await fetch(
                `${urlBase}/states/${stateId}`,
                {
                  method: "DELETE",
                }
              );
              if (response.status == 204) {
                swal(
                  "Removido!",
                  "O estado foi removido da Conferência.",
                  "success"
                );
              }
            } catch (err) {
              swal({
                type: "error",
                title: "Erro",
                text: err,
              });
            }
            renderStates();
          }
        });
      });
    }
  };
  renderStates();
};
