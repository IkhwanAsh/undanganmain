// ======================
// CONFIG
// ======================
const ADMIN_WA = "6287874633589";

// ======================
// DATA PRODUK
// ======================
const products = [
 {id:1,name:"Kaos Pria",price:75000,cat:"pria",image:"baju1.jpg"},
 {id:2,name:"Dress Cantik",price:120000,cat:"wanita",image:"dress.jpg"},
 {id:3,name:"Jaket Hoodie",price:150000,cat:"pria",image:"hoodie pria.jpg"},
 {id:4,name:"Baju Anak",price:60000,cat:"anak",image:"dress anak.jpg"},
 {id:5,name:"Kaos Pria B",price:95000,cat:"pria",image:"baju5.jpg"},
 {id:6,name:"Blouse Elegan",price:110000,cat:"wanita",image:"blouse.jpg"},
 {id:7,name:"Setelan Anak",price:85000,cat:"anak",image:"kaos anak kartun.jpg"},
 {id:8,name:"Sweater Premium",price:140000,cat:"pria",image:"sweater premium.jpg"}
];

// ======================
// STORAGE
// ======================
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];
let loginUser = JSON.parse(localStorage.getItem("login"));

// ======================
// REGISTER
// ======================
function register(){
 let nama = document.getElementById("regNama").value;
 let hp = document.getElementById("regHp").value;
 let pass = document.getElementById("regPass").value;

 if(!nama || !hp || !pass){
  alert("Semua data wajib diisi!");
  return;
 }

 users.push({nama,hp,pass});
 localStorage.setItem("users", JSON.stringify(users));

 alert("Register berhasil!");
 location.href="login.html";
}

// ======================
// LOGIN
// ======================
function login(){
 let hp = document.getElementById("loginHp").value;
 let pass = document.getElementById("loginPass").value;

 let user = users.find(u => u.hp===hp && u.pass===pass);

 if(user){
  localStorage.setItem("login", JSON.stringify(user));
  alert("Login berhasil!");
  location.href="index.html";
 }else{
  alert("Login gagal!");
 }
}

// ======================
// LOGOUT BUTTON
// ======================
function setAuthButton(){
 let btn = document.getElementById("btnAuth");
 if(!btn) return;

 if(loginUser){
  btn.innerText = "Logout";
  btn.onclick = () => {
    localStorage.removeItem("login");
    alert("Logout berhasil!");
    location.href="login.html";
  };
 }else{
  btn.innerText = "Login";
  btn.onclick = () => {
    location.href="login.html";
  };
 }
}
setAuthButton();

// ======================
// PROTEKSI CART
// ======================
function goCart(){
 if(!loginUser){
  alert("Silakan login dulu!");
  location.href="login.html";
 }else{
  location.href="cart.html";
 }
}

// ======================
// RENDER PRODUK
// ======================
function renderProducts(list = products){
 let el = document.getElementById("productList");
 if(!el) return;

 el.innerHTML = "";

 list.forEach(p=>{
  el.innerHTML += `
  <div class="col-md-3 mb-3">
    <div class="card shadow-sm h-100">
      <img src="${p.image}" style="height:200px;object-fit:cover;">
      <div class="card-body d-flex flex-column">
        <h6>${p.name}</h6>
        <p class="text-danger">Rp ${p.price.toLocaleString()}</p>
        <button class="btn btn-danger mt-auto" onclick="addCart(${p.id})">
          🛒 Tambah
        </button>
      </div>
    </div>
  </div>`;
 });
}
renderProducts();

// ======================
// SEARCH + FILTER
// ======================
document.addEventListener("input", ()=>{
 let s = document.getElementById("search")?.value || "";
 let f = document.getElementById("filter")?.value || "all";

 let hasil = products.filter(p =>
  p.name.toLowerCase().includes(s.toLowerCase()) &&
  (f==="all" || p.cat===f)
 );

 renderProducts(hasil);
});

// ======================
// CART
// ======================
function addCart(id){
 if(!loginUser){
  alert("Login dulu!");
  location.href="login.html";
  return;
 }

 let item = products.find(p=>p.id===id);
 let exist = cart.find(c=>c.id===id);

 if(exist){
  exist.qty++;
 }else{
  cart.push({...item, qty:1});
 }

 localStorage.setItem("cart", JSON.stringify(cart));
 alert("Produk ditambahkan!");
}

// ======================
// CHANGE QTY
// ======================
function changeQty(i, change){
 cart[i].qty += change;

 if(cart[i].qty <= 0){
  cart.splice(i,1);
 }

 localStorage.setItem("cart", JSON.stringify(cart));
 renderCart();
}

// ======================
// RENDER CART
// ======================
function renderCart(){
 let el = document.getElementById("cartList");
 let totalEl = document.getElementById("total");

 if(!el) return;

 el.innerHTML = "";
 let total = 0;

 cart.forEach((c,i)=>{
  let sub = c.price * c.qty;
  total += sub;

  el.innerHTML += `
  <div class="cart-card d-flex justify-content-between align-items-center">

    <div class="d-flex align-items-center gap-3">
      <img src="${c.image}" style="width:70px;height:70px;border-radius:10px;">
      <div>
        <b>${c.name}</b><br>
        <small>Rp ${c.price.toLocaleString()}</small>
      </div>
    </div>

    <div class="d-flex gap-2">
      <button onclick="changeQty(${i},-1)">-</button>
      <b>${c.qty}</b>
      <button onclick="changeQty(${i},1)">+</button>
    </div>

    <div><b>Rp ${sub.toLocaleString()}</b></div>

  </div>`;
 });

 if(totalEl){
  totalEl.innerText = "Total: Rp " + total.toLocaleString();
 }
}
document.addEventListener("DOMContentLoaded", renderCart);

// ======================
// CHECKOUT
// ======================
function checkout(){
 let cart = JSON.parse(localStorage.getItem("cart")) || [];

 let nama = document.getElementById("nama")?.value;
 let alamat = document.getElementById("alamat")?.value;

 if(!nama || !alamat){
  alert("Nama & alamat wajib!");
  return;
 }

 let msg = "Halo, saya ingin pesan:%0A";

 cart.forEach(c=>{
  msg += `- ${c.name} (${c.qty})%0A`;
 });

 let total = cart.reduce((a,b)=>a + b.price*b.qty,0);

 msg += `%0ATotal: Rp ${total.toLocaleString()}%0A`;
 msg += `Nama: ${nama}%0A`;
 msg += `Alamat: ${encodeURIComponent(alamat)}`;

 window.open(`https://wa.me/${ADMIN_WA}?text=${msg}`);
}

// ======================
// VIRTUAL TRY ON (IMPROVED)
// ======================

const upload = document.getElementById("uploadFoto");
const fotoUser = document.getElementById("fotoUser");
const baju = document.getElementById("bajuOverlay");
const pilihBaju = document.getElementById("pilihBaju");

let scale = 1;

// ======================
// UPLOAD FOTO
// ======================
upload?.addEventListener("change", function(e){
 const file = e.target.files[0];
 if(!file) return;

 const reader = new FileReader();

 reader.onload = function(ev){
  fotoUser.src = ev.target.result;

  fotoUser.onload = () => {
   autoFitClothes();
  };
 };

 reader.readAsDataURL(file);
});

// ======================
// PILIH BAJU
// ======================
pilihBaju?.addEventListener("change", function(){
 baju.src = this.value;
 autoFitClothes();
});

// ======================
// AUTO FIT (BIAR LEBIH REALISTIS)
// ======================
function autoFitClothes(){
 if(!fotoUser.src || !baju.src) return;

 // posisi tengah
 baju.style.left = "50%";
 baju.style.top = "45%";

 // ukuran berdasarkan tinggi foto
 let tinggi = fotoUser.clientHeight;

 baju.style.width = (tinggi * 0.6) + "px";

 // reset scale
 scale = 1;
 baju.style.transform = "translate(-50%, -50%) scale(1)";
}

// ======================
// DRAG BAJU
// ======================
let isDragging = false;
let offsetX, offsetY;

baju?.addEventListener("mousedown", (e)=>{
 isDragging = true;

 offsetX = e.clientX - baju.offsetLeft;
 offsetY = e.clientY - baju.offsetTop;

 baju.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e)=>{
 if(!isDragging) return;

 baju.style.left = (e.clientX - offsetX) + "px";
 baju.style.top = (e.clientY - offsetY) + "px";
});

document.addEventListener("mouseup", ()=>{
 isDragging = false;
 baju.style.cursor = "grab";
});

// ======================
// ZOOM SCROLL
// ======================
baju?.addEventListener("wheel", function(e){
 e.preventDefault();

 scale += e.deltaY * -0.001;
 scale = Math.min(Math.max(0.5, scale), 3);

 baju.style.transform = `translate(-50%, -50%) scale(${scale})`;
});

// ======================
// DOUBLE CLICK RESET
// ======================
baju?.addEventListener("dblclick", ()=>{
 autoFitClothes();
});