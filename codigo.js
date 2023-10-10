const url='https://retoolapi.dev/GDHCXq/productos/';
var fila =
  "<tr><td class='id'></td><td class='foto'></td><td class='price'></td><td class='title'></td><td class='description'></td><td class='category'></td><td><a class='btn btn-danger' id='btnEliminar'>Eliminar</a></td></tr>";
var productos = null;
function codigoCat(catstr) {
  var code = "null";
  switch (catstr) {
    case "electronicos":
      code = "c1";
      break;
    case "joyeria":
      code = "c2";
      break;
    case "caballeros":
      code = "c3";
      break;
    case "damas":
      code = "c4";
      break;
  }
  return code;
}
var orden = 0;

function listarProductos(productos) {
  var precio = document.getElementById("price");
  precio.setAttribute("onclick", "orden*=-1;listarProductos(productos);");
  var num = productos.length;
  var formularioP= document.getElementById("formularioP");
  var listado = document.getElementById("listado");
  listado.style.display="none";
  var ids, titles, prices, descriptions, categories, fotos;
  var tbody = document.getElementById("tbody"),
    nfila = 0;
  tbody.innerHTML = "";
  var catcode;
  for (i = 0; i < num; i++) tbody.innerHTML += fila;
  var tr;
  ids = document.getElementsByClassName("id");
  titles = document.getElementsByClassName("title");
  descriptions = document.getElementsByClassName("description");
  categories = document.getElementsByClassName("category");
  fotos = document.getElementsByClassName("foto");
  prices = document.getElementsByClassName("price");

  if (orden === 0) {
    orden = -1;
    precio.innerHTML = "Precio";
  } else if (orden == 1) {
    ordenarAsc(productos, "price");
    precio.innerHTML = "Precio A";
    precio.style.color = "darkgreen";
  } else if (orden == -1) {
    ordenarDesc(productos, "price");
    precio.innerHTML = "Precio D";
    precio.style.color = "blue";
  }
  formularioP.style.display = "block";

  listado.style.display = "block";
  for (nfila = 0; nfila < num; nfila++) {
    ids[nfila].innerHTML = productos[nfila].id;
    titles[nfila].innerHTML = productos[nfila].title;
    descriptions[nfila].innerHTML = productos[nfila].description;
    categories[nfila].innerHTML = productos[nfila].category;
    catcode = codigoCat(productos[nfila].category);
    tr = categories[nfila].parentElement;
    tr.setAttribute("class", catcode);
    prices[nfila].innerHTML = "$" + productos[nfila].price;
    fotos[nfila].innerHTML = "<img src='" + productos[nfila].image + "'>";
    fotos[nfila].firstChild.setAttribute(
      "onclick",
      "window.open('" + productos[nfila].image + "');"
    );
  }
}

function obtenerProductos() {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      productos = data;
      productos.forEach(
        function(producto){
          producto.price=parseFloat(producto.price);
        }
      );
      listarProductos(data)});
    }

function ordenarDesc(p_array_json, p_key) {
  p_array_json.sort(function (a, b) {
    if (a[p_key] > b[p_key]) return -1;
    if (a[p_key] < b[p_key]) return 1;
    return 0;
  });
}

function ordenarAsc(p_array_json, p_key) {
  p_array_json.sort(function (a, b) {
    if (a[p_key] > b[p_key]) return 1;
    if (a[p_key] < b[p_key]) return -1;
    return 0;
  });
}
function agregarProducto(){
  const body_json = {
    image: document.getElementById("UrlImagen").value,
    title: document.getElementById("titulo").value,
    price: document.getElementById("precio").value,
    description: document.getElementById("descripcion").value,
    category: document.getElementById("categoria").value
};

fetch(url, {
    method: "POST",
    body: JSON.stringify(body_json),
    headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json; charset=UTF-8'
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error('Ocurrió un error al agregar el producto.');
    }
    // Si la solicitud POST es exitosa, llama a obtenerProductos()
    obtenerProductos();
    return response.json();
})
.then(data => {
    swal("Agregado", "Su producto fue agregado con éxito!", "success");
    document.getElementById("titulo").value = '';
    document.getElementById("UrlImagen").value = '';
    document.getElementById("descripcion").value = '';
    document.getElementById("precio").value = '';
    document.getElementById("categoria").value = '';
})
.catch(error => {
    console.error('Error:', error);
});
var formularioP= document.getElementById("formularioP");
var listado=document.getElementById("listado");
formularioP.style.display = "none";

  listado.style.display = "none";
}

//eliminar
const on=(element,event,selector,handler)=>{
  element.addEventListener(event,e => {
    if(e.target.closest(selector)){
      handler(e);
    }
  })
}
on(document, 'click', '#btnEliminar', e => {
  const fila = e.target.parentNode.parentNode;
  var id = fila.firstElementChild.innerHTML;
  console.log(id);
  fetch(url+id,{method:'Delete'
  }).then(res => {
    fila.remove();
    res.json()}
  ).then(data => {
    swal('El producto ha sido eliminado.');
  })
});