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
    const txtProduct = document.getElementById("txtProduct").value;
    const txtCategory = document.getElementById("txtCategory").value;
    const txtProductId = document.getElementById("txtProductId").value;
    const txtDescription = document.getElementById("txtDescription").value;
    const txtAlternatives = document.getElementById("txtAlternatives").value;
    const txtPhoto = document.getElementById("txtPhoto").value;

    // Verifica flag isNew para saber se se trata de uma adição ou de um atualização dos dados de um membro
    let response;
    if (isNew) {
      //////////////// Criar
      response = await fetch(`${urlBase}/products`, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
        body: `name=${txtProduct}&category_id=${txtCategory}&description=${txtDescription}&alternatives=${txtAlternatives}&photo=${txtPhoto}`,
      });
    } else {
      /////////////// Atualizar 
      response = await fetch(`${urlBase}/products/${txtProductId}`, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "PUT",
        body: `name=${txtProduct}&category_id=${txtCategory}&description=${txtDescription}&alternatives=${txtAlternatives}&photo=${txtPhoto}`,
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
                    <th scope="col">Descrição</th>
                    <th scope="col">Categoria</th>
                    <th scope="col" class="text-center">Editar | Apagar</th>
                </tr> 
            </thead>
            <tbody>
        `;

    // ler produtos: /products2 inclui também nome da categoria
    const response = await fetch(`${urlBase}/products2`);
    const products = await response.json();

    //ler categorias
    const response2 = await fetch(`${urlBase}/categories`);
    const categories = await response2.json();

    // populate select category
    var ele = document.getElementById("txtCategory");
    for (const category of categories) {
      ele.innerHTML =
        ele.innerHTML +
        '<option value="' +
        category.category_id +
        '">' +
        category.name +
        "</option>";
    }

    let i = 1;
    let category;
    let category_name;
    for (const product of products) {
      category = categories.find(el => el.category_id == product.category_id);
      category_name = category ? category.name : "";
      start_date = product.startDate ? product.startDate : "";
      strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${product.name}</td>
                    <td>${product.description}</td>
                    <td>${product.category_name}</td>
                    <td class="text-center">
                        <i id='${product.product_id}' class='fas fa-edit edit'></i> |
                        <i id='${product.product_id}' class='fas fa-trash-alt remove'></i>
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

        for (const product of products) {
          if (product.product_id == btnEdit[i].getAttribute("id")) {
            document.getElementById("txtProductId").value = product.product_id;
            document.getElementById("txtProduct").value = product.name;
            document.getElementById("txtCategory").value = product.category_id;
            document.getElementById("txtDescription").value = product.description;
            document.getElementById("txtAlternatives").value = product.alternatives;
            document.getElementById("txtPhoto").value = product.photo;
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
            let productId = btnDelete[i].getAttribute("id");
            try {
              const response = await fetch(`${urlBase}/products/${productId}`, {
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
