const foods = [
{id:1,name:"Masala Dosa",cat:"South Indian",price:80,rating:4.8,time:15,diet:"Veg",emoji:"🥞",desc:"Crispy dosa with masala potato filling and chutneys.",moods:["hungry","comfort","budget"],tags:["Indian","Comfort"],ingredients:"Rice, urad dal, potato, onion, spices"},
{id:2,name:"Paneer Tikka",cat:"North Indian",price:180,rating:4.7,time:25,diet:"Veg",emoji:"🧀",desc:"Smoky paneer cubes with peppers and mint chutney.",moods:["spicy","healthy","comfort"],tags:["Indian"],ingredients:"Paneer, capsicum, yogurt, spices"},
{id:3,name:"Chicken Biryani",cat:"North Indian",price:220,rating:4.9,time:30,diet:"Non-Veg",emoji:"🍛",desc:"Aromatic basmati rice layered with spiced chicken.",moods:["hungry","comfort","spicy"],tags:["Indian"],ingredients:"Basmati rice, chicken, onion, saffron, spices"},
{id:4,name:"Veg Hakka Noodles",cat:"Chinese",price:150,rating:4.6,time:18,diet:"Veg",emoji:"🍜",desc:"Wok-tossed noodles with crunchy vegetables.",moods:["spicy","hungry","budget"],tags:["Chinese"],ingredients:"Noodles, cabbage, carrot, spring onion, sauces"},
{id:5,name:"Chicken Noodles",cat:"Chinese",price:170,rating:4.7,time:20,diet:"Non-Veg",emoji:"🍜",desc:"Wok-tossed noodles with tender chicken and vegetables.",moods:["spicy","hungry","comfort"],tags:["Chinese"],ingredients:"Noodles, chicken, cabbage, carrot, sauces"},
{id:6,name:"Chicken Momos",cat:"Chinese",price:90,rating:4.8,time:15,diet:"Non-Veg",emoji:"🥟",desc:"Steamed dumplings filled with juicy spiced chicken.",moods:["spicy","budget","hungry"],tags:["Chinese"],ingredients:"Flour, chicken, onion, garlic, spices"},
{id:7,name:"Classic Burger",cat:"Fast Food",price:140,rating:4.5,time:15,diet:"Veg",emoji:"🍔",desc:"Loaded veggie patty, lettuce, tomato and house sauce.",moods:["comfort","hungry","budget"],tags:["Fast Food"],ingredients:"Bun, vegetable patty, lettuce, tomato, sauce"},
{id:8,name:"Chicken Pizza",cat:"Fast Food",price:240,rating:4.8,time:25,diet:"Non-Veg",emoji:"🍕",desc:"Cheesy pizza topped with seasoned chicken and herbs.",moods:["comfort","hungry"],tags:["Fast Food"],ingredients:"Pizza base, cheese, chicken, tomato, herbs"},
{id:9,name:"Fruit Bowl",cat:"Healthy Food",price:110,rating:4.6,time:10,diet:"Veg",emoji:"🍓",desc:"Fresh seasonal fruits with a light honey drizzle.",moods:["healthy","budget"],tags:["Healthy"],ingredients:"Seasonal fruits, honey, seeds"},
{id:10,name:"Paneer Salad",cat:"Healthy Food",price:160,rating:4.7,time:12,diet:"Veg",emoji:"🥗",desc:"Fresh greens, grilled paneer and a lemon dressing.",moods:["healthy"],tags:["Healthy","Indian"],ingredients:"Lettuce, paneer, cucumber, tomato, lemon"},
{id:11,name:"Gulab Jamun",cat:"Desserts",price:70,rating:4.8,time:5,diet:"Veg",emoji:"🍮",desc:"Soft milk dumplings soaked in warm cardamom syrup.",moods:["sweet","budget","comfort"],tags:["Dessert"],ingredients:"Milk solids, sugar, cardamom"},
{id:12,name:"Chocolate Cake",cat:"Desserts",price:130,rating:4.9,time:8,diet:"Veg",emoji:"🍰",desc:"Moist chocolate cake with a smooth cocoa glaze.",moods:["sweet","comfort"],tags:["Dessert"],ingredients:"Flour, cocoa, sugar, butter, chocolate"},
{id:13,name:"Mango Lassi",cat:"Beverages",price:90,rating:4.7,time:5,diet:"Veg",emoji:"🥭",desc:"Creamy yogurt drink blended with ripe mango.",moods:["sweet","healthy","comfort"],tags:["Indian"],ingredients:"Mango, yogurt, milk, cardamom"},
{id:14,name:"Lime Soda",cat:"Beverages",price:40,rating:4.5,time:3,diet:"Veg",emoji:"🥤",desc:"Refreshing fizzy lime drink, sweet or salted.",moods:["budget","spicy","hungry"],tags:["Beverage"],ingredients:"Lime, soda, sugar or salt"},
{id:15,name:"Idli Sambar",cat:"South Indian",price:70,rating:4.7,time:10,diet:"Veg",emoji:"🍚",desc:"Soft steamed idlis served with hot vegetable sambar.",moods:["healthy","budget","comfort"],tags:["Indian","Healthy"],ingredients:"Rice, urad dal, lentils, vegetables"},
{id:16,name:"Chilli Chicken",cat:"Chinese",price:210,rating:4.8,time:25,diet:"Non-Veg",emoji:"🍗",desc:"Crispy chicken tossed in a bold chilli sauce.",moods:["spicy","hungry"],tags:["Chinese"],ingredients:"Chicken, capsicum, chilli, soy sauce"}
];

let cart = JSON.parse(localStorage.getItem("gm_cart") || "[]");
let favorites = JSON.parse(localStorage.getItem("gm_favorites") || "[]");
let lastOrder = JSON.parse(localStorage.getItem("gm_lastOrder") || "null");
let selectedCategory = "All", searchTerm = "", selectedMood = "";
let builderState = {mood:"",diet:"",category:"",budget:"",hunger:"",time:""};
let builderStep = 0;

const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const money = n => `₹${n.toLocaleString("en-IN")}`;
function save(){localStorage.setItem("gm_cart",JSON.stringify(cart));localStorage.setItem("gm_favorites",JSON.stringify(favorites));}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}

function renderFoods(list=foods){
  const grid=$("#foodGrid"), no=$("#noResults");
  grid.innerHTML="";
  if(!list.length){no.classList.remove("hidden");return}
  no.classList.add("hidden");
  list.forEach(f=>grid.appendChild(foodCard(f)));
}
function foodCard(f, match=null){
  const el=document.createElement("article");el.className="food-card";
  const fav=favorites.includes(f.id);
  el.innerHTML=`<div class="food-img"><span>${f.emoji}</span><span class="veg-dot" title="${f.diet}"></span><button class="heart ${fav?"active":""}" data-fav="${f.id}">${fav?"♥":"♡"}</button>${match!==null?`<span class="match-badge">${match}% Match</span>`:""}</div>
  <div class="food-body"><div class="food-top"><span class="food-name">${f.name}</span><span class="rating">★ ${f.rating}</span></div>
  <p class="food-desc">${f.desc}</p><div class="food-meta"><span>${f.cat}</span><span>⏱ ${f.time} min</span></div>
  <div class="food-bottom"><span class="price">${money(f.price)}</span><button class="add-btn" data-add="${f.id}">+ Add</button></div></div>`;
  el.addEventListener("click",e=>{if(e.target.closest("[data-add]")){addToCart(f.id);return}if(e.target.closest("[data-fav]")){toggleFavorite(f.id);return}openFood(f)});
  return el;
}
function filtered(){
  return foods.filter(f=>(selectedCategory==="All"||f.cat===selectedCategory)&&(!searchTerm||f.name.toLowerCase().includes(searchTerm.toLowerCase())));
}
function updateFood(){renderFoods(filtered())}
function toggleFavorite(id){favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];save();renderFavorites();updateFood();toast(favorites.includes(id)?"Added to favorites":"Removed from favorites")}
function renderFavorites(){
  const grid=$("#favoritesGrid"), empty=$("#favoritesEmpty"), list=foods.filter(f=>favorites.includes(f.id));
  grid.innerHTML="";list.forEach(f=>grid.appendChild(foodCard(f)));
  empty.classList.toggle("hidden",list.length>0);
}
function addToCart(id,qty=1){const item=cart.find(x=>x.id===id);if(item)item.qty+=qty;else cart.push({id,qty});save();renderCart();toast("Added to your cart ✦")}
function removeFromCart(id){cart=cart.filter(x=>x.id!==id);save();renderCart()}
function changeQty(id,delta){const item=cart.find(x=>x.id===id);if(!item)return;item.qty+=delta;if(item.qty<=0)removeFromCart(id);else{save();renderCart()}}
function cartDetails(){return cart.map(x=>({...foods.find(f=>f.id===x.id),qty:x.qty})).filter(Boolean)}
function renderCart(){
  const items=cartDetails(), box=$("#cartItems"), empty=$("#cartEmpty"), summary=$("#cartSummary");
  box.innerHTML="";
  empty.style.display=items.length?"none":"block";summary.style.display=items.length?"block":"none";
  let subtotal=0,count=0;
  items.forEach(f=>{subtotal+=f.price*f.qty;count+=f.qty;const row=document.createElement("div");row.className="cart-line";row.innerHTML=`<div class="cart-thumb">${f.emoji}</div><div><h4>${f.name}</h4><small>${money(f.price)}</small><div class="qty"><button data-minus="${f.id}">−</button><b>${f.qty}</b><button data-plus="${f.id}">+</button></div><button class="remove" data-remove="${f.id}">Remove</button></div><strong>${money(f.price*f.qty)}</strong>`;box.appendChild(row)});
  box.querySelectorAll("[data-minus]").forEach(b=>b.onclick=()=>changeQty(+b.dataset.minus,-1));
  box.querySelectorAll("[data-plus]").forEach(b=>b.onclick=()=>changeQty(+b.dataset.plus,1));
  box.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>removeFromCart(+b.dataset.remove));
  const delivery=subtotal>=299?0:(subtotal?30:0);
  $("#subtotal").textContent=money(subtotal);$("#delivery").textContent=delivery?money(delivery):"FREE";$("#grandTotal").textContent=money(subtotal+delivery);$("#cartCount").textContent=count;
}
function openCart(){$("#cartDrawer").classList.add("open");$("#cartOverlay").classList.add("open")}
function closeCart(){$("#cartDrawer").classList.remove("open");$("#cartOverlay").classList.remove("open")}
function openModal(id){$("#"+id).classList.add("open")}
function closeModal(id){$("#"+id).classList.remove("open")}
function openFood(f){
  $("#foodDetail").innerHTML=`<div class="detail-layout"><div class="detail-image">${f.emoji}</div><div><span class="eyebrow">${f.cat.toUpperCase()}</span><h2>${f.name}</h2><div class="detail-price">${money(f.price)} · ★ ${f.rating}</div><p class="detail-desc">${f.desc}</p><p class="ingredients"><b>Ingredients:</b> ${f.ingredients}</p><p class="detail-desc">⏱ Ready in about ${f.time} minutes · ${f.diet}</p><button class="primary-btn wide" id="detailAdd">Add to Cart</button></div></div>`;
  $("#detailAdd").onclick=()=>{addToCart(f.id);closeModal("foodModal")};openModal("foodModal");
}

function calcMatch(f){
  let score=50;
  if(builderState.mood&&f.moods.includes(builderState.mood))score+=22;
  if(builderState.diet&&builderState.diet!=="Any"&&f.diet===builderState.diet)score+=12;
  if(builderState.category&&builderState.category!=="Any"){
    const c=builderState.category;
    if((c==="Indian"&&["South Indian","North Indian"].includes(f.cat))||f.cat===c|| (c==="Healthy"&&f.cat==="Healthy Food")||(c==="Dessert"&&f.cat==="Desserts"))score+=9;
  }
  if(builderState.budget){
    const b=+builderState.budget;
    if((b===100&&f.price<=100)||(b===200&&f.price<=200&&f.price>70)||(b===300&&f.price<=300&&f.price>150)||(b===301&&f.price>=300))score+=8;
  }
  if(builderState.hunger==="light"&&f.price<=130)score+=4;
  if(builderState.hunger==="medium"&&f.price>80&&f.price<=220)score+=4;
  if(builderState.hunger==="very"&&f.price>=140)score+=5;
  if(builderState.time!=="any"&&f.time<=+builderState.time)score+=7;
  return Math.min(99,Math.max(55,score));
}
function renderMatch(){
  const candidates=foods.map(f=>({f,score:calcMatch(f)})).sort((a,b)=>b.score-a.score).slice(0,3);
  $("#matchCards").innerHTML="";
  candidates.forEach(x=>{const d=document.createElement("div");d.className="match-card";d.innerHTML=`<div class="match-score">${x.score}%</div><div class="food-img">${x.f.emoji}</div><b>${x.f.name}</b><p class="food-desc">${x.f.desc}</p><button class="add-btn" data-match-add="${x.f.id}">+ Add ${money(x.f.price)}</button>`;d.querySelector("button").onclick=()=>addToCart(x.f.id);$("#matchCards").appendChild(d)});
}
function updateBuilder(){
  $$(".builder-step").forEach((s,i)=>s.classList.toggle("active",i===builderStep));
  $("#builderProgress").style.width=`${((builderStep+1)/6)*100}%`;
  $("#builderBack").style.visibility=builderStep===0?"hidden":"visible";
  $("#builderNext").textContent=builderStep===5?"Find My Match →":"Next →";
}
function chooseBuilder(btn){
  const parent=btn.closest("[data-key]");parent.querySelectorAll("button").forEach(b=>b.classList.remove("selected"));btn.classList.add("selected");builderState[parent.dataset.key]=btn.dataset.value;
}
function submitBuilder(){
  if(Object.values(builderState).some(v=>!v)){toast("Choose one option in each step");return}
  renderMatch();$("#matchResult").classList.remove("hidden");$("#builderNext").disabled=true;$("#builderNext").textContent="Match Found ✓";$("#matchResult").scrollIntoView({behavior:"smooth",block:"center"});
}
function resetBuilder(){builderState={mood:"",diet:"",category:"",budget:"",hunger:"",time:""};builderStep=0;$("#builderNext").disabled=false;$$(".option-grid button").forEach(b=>b.classList.remove("selected"));$("#matchResult").classList.add("hidden");updateBuilder()}

function combo(){
  const combo=[foods.find(f=>f.id===5),foods.find(f=>f.id===6),foods.find(f=>f.id===14)];
  combo.forEach(f=>addToCart(f.id));
}
function openCheckout(){
  if(!cart.length){toast("Your cart is empty");return}
  closeCart();const items=cartDetails();let subtotal=items.reduce((s,f)=>s+f.price*f.qty,0),delivery=subtotal>=299?0:30;
  $("#checkoutSummary").innerHTML=items.map(f=>`<div><span>${f.emoji} ${f.name} × ${f.qty}</span><b>${money(f.price*f.qty)}</b></div>`).join("")+`<div><span>Delivery</span><b>${delivery?"₹30":"FREE"}</b></div><div><strong>Total</strong><strong>${money(subtotal+delivery)}</strong></div>`;
  $("#formError").textContent="";openModal("checkoutModal");
}
function placeOrder(e){
  e.preventDefault();const name=$("#customerName").value.trim(),phone=$("#customerPhone").value.trim(),address=$("#customerAddress").value.trim();
  if(!name||!/^[0-9]{10}$/.test(phone)||!address){$("#formError").textContent="Please enter a valid name, 10-digit mobile number and delivery address.";return}
  const items=cartDetails(),subtotal=items.reduce((s,f)=>s+f.price*f.qty,0),delivery=subtotal>=299?0:30;
  lastOrder={id:"GM"+Date.now().toString().slice(-6),name,phone,address,items,total:subtotal+delivery,time:new Date().toLocaleString()};
  localStorage.setItem("gm_lastOrder",JSON.stringify(lastOrder));cart=[];save();renderCart();closeModal("checkoutModal");$("#checkoutForm").reset();renderOrder();toast("Order confirmed! 🎉");setTimeout(()=>$("#orders").scrollIntoView({behavior:"smooth"}),300);
}
function renderOrder(){
  const area=$("#orderArea");
  if(!lastOrder){area.className="order-empty";area.innerHTML=`<div>🛵</div><h3>No recent orders</h3><p>Your placed order will appear here.</p>`;return}
  area.className="order-card";area.innerHTML=`<div class="order-top"><div><span class="eyebrow">ORDER CONFIRMED</span><h3>Thanks, ${lastOrder.name}!</h3></div><span class="order-id">#${lastOrder.id}</span></div>
  <p class="order-id">${lastOrder.time}</p><div class="tracking">${["🛒 Order Placed","👨‍🍳 Preparing","📦 Packed","🛵 Out for Delivery","🏠 Delivered"].map((x,i)=>`<div class="track-step ${i===0?"done":""}"><div class="circle">${x.split(" ")[0]}</div>${x.substring(x.indexOf(" ")+1)}</div>`).join("")}</div>
  <div class="order-meta"><div><small>Total</small><b>${money(lastOrder.total)}</b></div><div><small>Items</small><b>${lastOrder.items.reduce((a,x)=>a+x.qty,0)}</b></div><div><small>Deliver to</small><b>${lastOrder.address}</b></div></div>`;
}


function initInteractions(){
  const byId = id => document.getElementById(id);

  byId("cartBtn")?.addEventListener("click", openCart);
  byId("closeCart")?.addEventListener("click", closeCart);
  byId("cartOverlay")?.addEventListener("click", closeCart);
  byId("cartExplore")?.addEventListener("click",()=>{closeCart();byId("explore")?.scrollIntoView({behavior:"smooth"});});
  byId("clearCart")?.addEventListener("click",()=>{cart=[];save();renderCart();toast("Cart cleared");});
  byId("checkoutBtn")?.addEventListener("click",openCheckout);

  $$("[data-close]").forEach(b=>b.addEventListener("click",()=>closeModal(b.dataset.close)));
  $$(".modal-backdrop").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)closeModal(m.id)}));

  byId("foodSearch")?.addEventListener("input",e=>{searchTerm=e.target.value;updateFood();});
  byId("heroSearch")?.addEventListener("input",e=>{searchTerm=e.target.value;byId("foodSearch").value=e.target.value;updateFood();});
  byId("heroSearchBtn")?.addEventListener("click",()=>{byId("explore")?.scrollIntoView({behavior:"smooth"});updateFood();});
  byId("viewAllBtn")?.addEventListener("click",()=>{selectedCategory="All";searchTerm="";byId("foodSearch").value="";updateFood();byId("explore")?.scrollIntoView({behavior:"smooth"});});

  $$(".chip").forEach(c=>c.addEventListener("click",()=>{
    $$(".chip").forEach(x=>x.classList.remove("active"));
    c.classList.add("active");
    selectedCategory=c.dataset.category;
    updateFood();
  }));

  // Mood cards: choose a mood and immediately show matching foods.
  $$(".mood-card").forEach(c=>c.addEventListener("click",()=>{
    selectedMood=c.dataset.mood;
    $$(".mood-card").forEach(x=>x.classList.remove("selected"));
    c.classList.add("selected");
    searchTerm="";selectedCategory="All";byId("foodSearch").value="";
    renderFoods(foods.filter(f=>f.moods.includes(selectedMood)));
    byId("explore")?.scrollIntoView({behavior:"smooth"});
  }));

  // Builder uses event delegation so every option remains clickable.
  // Food-card Add/Favorite clicks are handled inside foodCard(), so they are
  // intentionally not handled again here (avoids double toggles/adds).
  document.addEventListener("click",e=>{
    const option=e.target.closest(".option-grid button");
    if(option){
      e.preventDefault();
      chooseBuilder(option);
    }
  });

  byId("builderNext")?.addEventListener("click",()=>{
    if(builderStep<5){
      const key=["mood","diet","category","budget","hunger","time"][builderStep];
      if(!builderState[key]){toast("Please choose an option");return;}
      builderStep++;
      updateBuilder();
    }else submitBuilder();
  });
  byId("builderBack")?.addEventListener("click",()=>{if(builderStep>0){builderStep--;updateBuilder();}});
  byId("rebuildBtn")?.addEventListener("click",resetBuilder);
  byId("comboBtn")?.addEventListener("click",()=>{combo();openCart();toast("Smart Combo added ✦");});

  $$(".offer-card").forEach(c=>c.addEventListener("click",()=>{
    toast(c.dataset.offer==="50"?"Offer saved: GOOD50":c.dataset.offer==="free"?"Free delivery unlocked above ₹299":"Smart Combo is ready");
    if(c.dataset.offer==="combo")combo();
  }));

  byId("checkoutForm")?.addEventListener("submit",placeOrder);
  byId("menuBtn")?.addEventListener("click",()=>{
    const nav=$(".desktop-nav");
    if(!nav)return;
    nav.classList.toggle("mobile-open");
  });

  // Food-detail cards are handled inside foodCard().
  // Prevent a missing optional element from breaking the rest of the UI.
  renderFoods();
  renderFavorites();
  renderCart();
  renderOrder();
  updateBuilder();
}

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",initInteractions);
}else{
  initInteractions();
}
