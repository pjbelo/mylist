const urlProd = "https://mylist-pjbelo.herokuapp.com";
const urlDev = "http://localhost:8080";
const urlBase = urlProd;

async function showModal(id){
  const modal_el = document.getElementById("myListModal");
  const response = await fetch(`${urlBase}/list2/${id}`);
  const product = await response.json();

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

  document.getElementById("txtListId").value = id;
  document.getElementById("txtProductId").value = product[0].product_id;
  document.getElementById("txtProduct").value = product[0].name;
  document.getElementById("txtStateId").value = product[0].state_id;
  document.getElementById("txtCategory").value = product[0].category_name;
  document.getElementById("txtDescription").value = product[0].description;
  document.getElementById("txtAlternatives").value = product[0].alternatives;
  document.getElementById("txtPhoto").value = product[0].photo;

  $('#myListModal').modal();

}

window.onload = () => {
  // References to HTML objects
  const btnMyList = document.getElementById("btnMyList");
  const tblMyList = document.getElementById("tblMyList");

  frmProduct.addEventListener("submit", async (event) => {
    event.preventDefault();
    const txtListId = document.getElementById("txtListId").value;
    const txtProductId = document.getElementById("txtProductId").value;
    const txtStateId = document.getElementById("txtStateId").value;

      /////////////// Atualizar 
      response = await fetch(`${urlBase}/list/${txtListId}`, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "PUT",
        body: `product_id=${txtProductId}&state_id=${txtStateId}`,
      });

      const newProduct = await response.json();
    
    renderProducts();
  });

  const renderProducts = async () => {
    let strHtml = `
            <thead >
                <tr class='bg-info'>
                    <th class='w-2'>#</th>
                    <th class='w-50'>Produto</th>
                    <th class='w-38'>Estado</th>              
                </tr> 
            </thead><tbody>
        `;
    const response = await fetch(`${urlBase}/list2`);
    const products = await response.json();
    let i = 1;
    for (const product of products) {
      strHtml += `
                <tr class="clickable-row" style="cursor:pointer" onclick="showModal(${product.list_id})" >
                    <td>${i}</td>
                    <td>${product.name}</td>
                    <td>${product.state_name}</td>
                </tr>
            `;
      i++;
    }
    strHtml += "</tbody>";
    tblMyList.innerHTML = strHtml;

  };
  renderProducts();
};
