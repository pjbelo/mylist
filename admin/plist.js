const urlProd = "https://mylist-pjbelo.herokuapp.com";
const urlDev = "http://localhost:8080";
const urlBase = urlProd;
let isNew = true;


window.onload = () => {
  // References to HTML objects
  const tblProducts = document.getElementById("tblProducts");
  const frmProduct = document.getElementById("frmProduct");

  frmProduct.addEventListener("submit", async (event) => {
    event.preventDefault();
    const txtListId = document.getElementById("txtListId").value;
    const txtProductId = document.getElementById("txtProductId").value;
    const txtStateId = document.getElementById("txtStateId").value;

    // Verifica flag isNew para saber se se trata de uma adição ou de um atualização dos dados de um membro
    let response;
    if (isNew) {
      //////////////// Criar
      response = await fetch(`${urlBase}/list`, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
        body: `product_id=${txtProductId}&state_id=${txtStateId}`,
      });
    } else {
      /////////////// Atualizar 
      response = await fetch(`${urlBase}/list/${txtListId}`, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "PUT",
        body: `product_id=${txtProductId}&state_id=${txtStateId}`,
      });

      const newProduct = await response.json();
    }
    isNew = true;
    renderProducts();
  });

  const renderProducts = async () => {
    frmProduct.reset();
    let strHtml = `
            <thead>
                <tr class='bg-info'>
                    <th scope="col">#</th>
                    <th scope="col">Produto</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Categoria</th>
                    <th scope="col" class="text-center">Editar | Remover</th>
                </tr> 
            </thead>
            <tbody>
        `;

    // ler produtos da lista: /products2 inclui também nomes das categorias
    const response = await fetch(`${urlBase}/products2`);
    const products = await response.json();

    // populate select products
    var prod_ele = document.getElementById("txtProductId");
    prod_ele.innerHTML = "<option value=''>Selecione um produto</option>";
    for (const product of products) {
      prod_ele.innerHTML =
        prod_ele.innerHTML +
        '<option value="' +
        product.product_id +
        '">' +
        product.name +
        "</option>";
    }


    //ler estados
    const response2 = await fetch(`${urlBase}/states`);
    const states = await response2.json();

    // populate select state
    var st_ele = document.getElementById("txtStateId");
    st_ele.innerHTML = "<option value=''>Selecione um estado</option>";
    for (const state of states) {
      st_ele.innerHTML =
        st_ele.innerHTML +
        '<option value="' +
        state.state_id +
        '">' +
        state.name +
        "</option>";
    }


    // ler produtos da lista: /list2 inclui também nomes
    const response3 = await fetch(`${urlBase}/list2`);
    const list_products = await response3.json();

    let i = 1;
    let state;
    let state_name;
    for (const product of list_products) {
      state = states.find(el => el.state_id == product.state_id);
      state_name = state ? state.name : "";
      start_date = product.startDate ? product.startDate : "";
      strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${product.name}</td>
                    <td>${product.state_name}</td>
                    <td>${product.category_name}</td>
                    <td class="text-center">
                        <i id='${product.list_id}' class='fas fa-edit edit'></i> |
                        <i id='${product.list_id}' class='fas fa-trash-alt remove'></i>
                    </td>
                </tr>
            `;
      i++;
    }
    strHtml += "</tbody>";
    tblProducts.innerHTML = strHtml;

    ///////////// Editar
    const btnEdit = document.getElementsByClassName("edit");
    for (let i = 0; i < btnEdit.length; i++) {
      btnEdit[i].addEventListener("click", () => {
        isNew = false;

        for (const product of list_products) {
          if (product.list_id == btnEdit[i].getAttribute("id")) {
            document.getElementById("txtListId").value = product.list_id;
            document.getElementById("txtProductId").value = product.product_id;
            document.getElementById("txtStateId").value = product.state_id;
          }
        }
      });
    }

    ////////////////// Remover
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
            let listid = btnDelete[i].getAttribute("id");
            try {
              const response = await fetch(`${urlBase}/list/${listid}`, {
                method: "DELETE",
              });
              if (response.status == 204) {
                swal(
                  "Removido!",
                  "O produto foi removido.",
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
            renderProducts();
          }
        });
      });
    }
  };
  renderProducts();
};
