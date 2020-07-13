const urlProd = "https://mylist-pjbelo.herokuapp.com";
const urlDev = "http://localhost:8080";
const urlBase = urlProd;
let isNew = true;

window.onload = () => {
  // References to HTML objects
  const tblCategories = document.getElementById("tblCategories");
  const frmCategory = document.getElementById("frmCategory");

  frmCategory.addEventListener("submit", async (event) => {
    event.preventDefault();
    const txtName = document.getElementById("txtName").value;
    const txtCategoryId = document.getElementById("txtCategoryId").value;

    // Verifica flag isNew para saber se se trata de uma adição ou de um atualização dos dados de um categoria
    let response;
    if (isNew) {
      // Adiciona Categoria
      console.log("Create Category");
      response = await fetch(`${urlBase}/categories`, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
        body: `name=${txtName}`,
      });
      const newCategoryId = response.headers.get("Location");
      console.log(response);
      const newCategory = await response.json();
    } else {
      // Atualiza Categoria
      response = await fetch(`${urlBase}/categories/${txtCategoryId}`, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "PUT",
        body: `name=${txtName}`,
      });

      const newCategory = await response.json();
    }
    isNew = true;
    document.getElementById("btn_submit").innerText =
    "Criar Categoria";
    renderCategories();
  });

  ///////////// render lista de categorias //////////////
  const renderCategories = async () => {
    frmCategory.reset();
    let strHtml = `
            <thead >
                <tr><th class='w-100 text-center bg-warning' colspan='4'>Lista de Categorias</th></tr>
                <tr class='bg-info'>
                    <th class='w-2'>#</th>
                    <th class='w-50'>Nome do categoria</th>
                    <th class='w-10 text-center'>Editar | Apagar</th>              
                </tr> 
            </thead><tbody>
        `;
    const response = await fetch(`${urlBase}/categories`);
    const categories = await response.json();

    let i = 1;
    for (const category of categories) {
      strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${category.name}</td>
                    <td class="text-center">
                        <i id='${category.category_id}' class='fas fa-edit edit'></i> | 
                        <i id='${category.category_id}' class='fas fa-trash-alt remove'></i>
                    </td>
                </tr>
            `;
      i++;
    }
    strHtml += "</tbody>";
    tblCategories.innerHTML = strHtml;

    //////////////////// Editar ////////////////////
    const btnEdit = document.getElementsByClassName("edit");
    for (let i = 0; i < btnEdit.length; i++) {
      btnEdit[i].addEventListener("click", () => {
        isNew = false;
        document.getElementById("btn_submit").innerText =
          "Atualizar Categoria";
        for (const category of categories) {
          if (category.category_id == btnEdit[i].getAttribute("id")) {
            document.getElementById("txtCategoryId").value =
              category.category_id;
            document.getElementById("txtName").value = category.name;
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
            let categoryId = btnDelete[i].getAttribute("id");
            try {
              const response = await fetch(
                `${urlBase}/categories/${categoryId}`,
                {
                  method: "DELETE",
                }
              );
              if (response.status == 204) {
                swal(
                  "Removido!",
                  "A categoria foi removida.",
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
            renderCategories();
          }
        });
      });
    }
  };
  renderCategories();
};
