// Food listing data
const foods = [
  {
    name: "Organic Spinach",
    category: "vegetables",
    whatsapp: "601139536189",
    discount: "10% OFF",
    quantity: "12 left",
    price: "$4.24",
    original: "$4.99",
    expiry: "July 15",
    location: "Bandar Puteri",
    image: "https://sb-assets.sgp1.cdn.digitaloceanspaces.com/product/main_image/31627/small_712cdeda-b88b-4a36-9ff5-07a025dcee19.jpg"
  },
  {
    name: "Fresh Carrots",
    category: "vegetables",
    whatsapp: "60133898249",
    discount: "30% OFF",
    quantity: "8 left",
    price: "$4.19",
    original: "$5.99",
    expiry: "July 5",
    location: "Puchong Jaya",
    image: "https://www.tasteofhome.com/wp-content/uploads/2019/01/carrots-shutterstock_789443206.jpg"
  },
  {
    name: "Yogurt",
    category: "dairy",
    whatsapp: "60124633692",
    discount: "50% OFF",
    quantity: "23 left",
    price: "$1.75",
    original: "$3.49",
    expiry: "July 7",
    location: "Subang Jaya",
    image: "https://freshsensations.com.au/cdn/shop/products/yoghurt_0f6808d6-c681-441b-b5f7-4653da57b5ae.jpg?v=1585053657"
  },
  {
    name: "Durian",
    category: "fruits",
    whatsapp: "601126123614",
    discount: "15% OFF",
    quantity: "15 left",
    price: "$8.50",
    original: "$10.35",
    expiry: "July 3",
    location: "Putra Prima",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSu0v1oa5QP0ivsgqlEg7Rui_5r4WbpKch5Rw&s"
  },
  {
    name: "Chicken Breast",
    category: "meat",
    whatsapp: "601139908681",
    discount: "25% OFF",
    quantity: "6 left",
    price: "$12.92",
    original: "$17.23",
    expiry: "Dec 30",
    location: "Putra Heights",
    image: "https://cdn1.sgliteasset.com/picknpay/images/product/product-2285515/JKYPwFYX680893bc8f1c2_1745392572.jpg"
  },
  {
    name: "Orange Juice",
    category: "juice",
    whatsapp: "601139536189",
    discount: "20% OFF",
    quantity: "20 left",
    price: "$2.79",
    original: "$3.49",
    expiry: "July 4",
    location: "Subang Jaya",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLBVrUd-j-HfF-ZYH0glK6zMrT6Zqcfh8SIw&s"
  },
  {
    name: "Bagel",
    category: "bakery",
    whatsapp: "60133898249",
    discount: "30% OFF",
    quantity: "18 left",
    price: "$3.65",
    original: "$5.21",
    expiry: "July 20",
    location: "Puchong Utama",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNslJG4sIu5WhBUlg53MfmU94lOTAF5TcUkg&s"
  },
  {
    name: "Salt",
    category: "condiments",
    whatsapp: "60124633692",
    discount: "30% OFF",
    quantity: "18 left",
    price: "$3.33",
    original: "$5.21",
    expiry: "July 18",
    location: "Puchong Utama",
    image: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/rtc/rtc10109/y/24.jpg"
  }
];

function getCurrentUser() {
  return JSON.parse(localStorage.getItem('nomorroUser'));
}

function handleContact(link) {
  const userData = localStorage.getItem('nomorroUser');
  if (!userData) {
    alert("Please log in to contact the seller.");
    window.location.href = "login.html";
  } else {
    window.open(link, "_blank");
  }
}

function editItem(id) {
  const uploads = JSON.parse(localStorage.getItem("userUploadedFoods")) || [];
  const item = uploads.find(f => f.id === id);
  if (!item) return;

  // Populate form for editing
  document.getElementById("foodName").value = item.name;
  document.getElementById("foodCategory").value = item.category;
  document.getElementById("foodPrice").value = item.price;
  document.getElementById("foodDiscount").value = item.discount;
  document.getElementById("foodQuantity").value = item.quantity;
  document.getElementById("foodExpiry").value = item.expiry;
  document.getElementById("foodLocation").value = item.location;
  document.getElementById("foodWhatsapp").value = item.whatsapp;

  alert("Edit the form and re-upload to update.");

  const remaining = uploads.filter(f => f.id !== id);
  localStorage.setItem("userUploadedFoods", JSON.stringify(remaining));
}

function deleteItem(id) {
  if (!confirm("Are you sure you want to delete this item?")) return;
  const uploads = JSON.parse(localStorage.getItem("userUploadedFoods")) || [];
  const updated = uploads.filter(f => f.id !== id);
  localStorage.setItem("userUploadedFoods", JSON.stringify(updated));
  displayFoods();
}

function displayFoods(filter = "all") {
  const foodGrid = document.getElementById("foodGrid");
  if (!foodGrid) return;
  
  foodGrid.innerHTML = "";

  const storedUploads = JSON.parse(localStorage.getItem("userUploadedFoods")) || [];
  const allFoods = [...foods, ...storedUploads];

  const filtered = filter === "all" ? allFoods : allFoods.filter(f => f.category === filter);
  
  const itemCountElement = document.getElementById("itemCount");
  if (itemCountElement) {
    itemCountElement.textContent = filtered.length;
  }

  const currentUser = getCurrentUser();

  filtered.forEach(food => {
    const card = document.createElement("div");
    card.className = "food-card";

    const isOwner = currentUser && food.owner === currentUser.email;

    const message = encodeURIComponent(`Hi, I'm interested in "${food.name}" (${food.category}) priced at ${food.price}. Is it still available?`);
    const whatsappLink = `https://wa.me/${food.whatsapp}?text=${message}`;

    card.innerHTML = `
      <img src="${food.image}" alt="${food.name}" />
      <div class="card-header">
        <h3>${food.name}</h3>
        <span class="category-tag">${food.category}</span>
      </div>
      <div class="price-info">
        <span class="current-price">${food.price}</span>
        ${food.original ? `<span class="original-price"><s>${food.original}</s></span>` : ""}
      </div>
      <p class="expiry-date">Expires: ${food.expiry}</p>
      <p class="location">Location: ${food.location}</p>
    `;

    const contactBtn = document.createElement("button");
    contactBtn.className = "contact-btn";
    contactBtn.textContent = "Contact Seller";
    contactBtn.addEventListener("click", () => handleContact(whatsappLink));
    card.appendChild(contactBtn);

    if (isOwner && food.id) {
      const editBtn = document.createElement("button");
      editBtn.className = "edit-btn";
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", () => editItem(food.id));
      card.appendChild(editBtn);

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => deleteItem(food.id));
      card.appendChild(deleteBtn);
    }

    foodGrid.appendChild(card);
  });
}

function getBase64(file, callback) {
  const reader = new FileReader();
  reader.onload = () => callback(reader.result);
  reader.readAsDataURL(file);
}

function setupUploadForm() {
  const uploadForm = document.getElementById("foodUploadForm");
  if (!uploadForm) return;

  uploadForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const user = getCurrentUser();
    if (!user) {
      alert("Please log in first.");
      return;
    }

    const name = document.getElementById("foodName").value;
    const category = document.getElementById("foodCategory").value;
    const price = document.getElementById("foodPrice").value;
    const expiry = document.getElementById("foodExpiry").value;
    const location = document.getElementById("foodLocation").value;
    const whatsapp = document.getElementById("foodWhatsapp").value;
    const fileInput = document.getElementById("foodImageFile");
    const file = fileInput.files[0];

    if (!name || !category || !price || !expiry || !location || !whatsapp || !file) {
      alert("Please fill in all required fields and upload an image.");
      return;
    }

    getBase64(file, (base64Image) => {
      const newFood = {
        name: name,
        category: category,
        price: price,
        discount: document.getElementById("foodDiscount").value || "",
        quantity: document.getElementById("foodQuantity").value || "",
        expiry: expiry,
        location: location,
        whatsapp: whatsapp,
        image: base64Image,
        owner: user.email,
        id: Date.now()
      };

      const uploads = JSON.parse(localStorage.getItem("userUploadedFoods")) || [];
      uploads.push(newFood);
      localStorage.setItem("userUploadedFoods", JSON.stringify(uploads));
      displayFoods();
      uploadForm.reset();
      alert("Food uploaded successfully!");
    });
  });
}

function filterCategory(cat) {
  displayFoods(cat);
}

function searchFoods() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;
  
  const query = searchInput.value.toLowerCase();
  const storedUploads = JSON.parse(localStorage.getItem("userUploadedFoods")) || [];
  const allFoods = [...foods, ...storedUploads];
  const results = allFoods.filter(f => f.name.toLowerCase().includes(query));
  
  const foodGrid = document.getElementById("foodGrid");
  if (!foodGrid) return;
  
  foodGrid.innerHTML = "";
  
  const itemCountElement = document.getElementById("itemCount");
  if (itemCountElement) {
    itemCountElement.textContent = results.length;
  }

  const currentUser = getCurrentUser();

  results.forEach(food => {
    const card = document.createElement("div");
    card.className = "food-card";

    const isOwner = currentUser && food.owner === currentUser.email;
    const message = encodeURIComponent(`Hi, I'm interested in "${food.name}" (${food.category}) priced at ${food.price}. Is it still available?`);
    const whatsappLink = `https://wa.me/${food.whatsapp}?text=${message}`;

    card.innerHTML = `
      <img src="${food.image}" alt="${food.name}" />
      <div class="card-header">
        <h3>${food.name}</h3>
        <span class="category-tag">${food.category}</span>
      </div>
      <div class="price-info">
        <span class="current-price">${food.price}</span>
        ${food.original ? `<span class="original-price"><s>${food.original}</s></span>` : ""}
      </div>
      <p class="expiry-date">Expires: ${food.expiry}</p>
      <p class="location">Location: ${food.location}</p>
    `;

    const contactBtn = document.createElement("button");
    contactBtn.className = "contact-btn";
    contactBtn.textContent = "Contact Seller";
    contactBtn.addEventListener("click", () => handleContact(whatsappLink));
    card.appendChild(contactBtn);

    if (isOwner && food.id) {
      const editBtn = document.createElement("button");
      editBtn.className = "edit-btn";
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", () => editItem(food.id));
      card.appendChild(editBtn);

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => deleteItem(food.id));
      card.appendChild(deleteBtn);
    }

    foodGrid.appendChild(card);
  });
}

function resetChat() {
  chatInit();
}

function chatInit() {
  const chatbox = document.getElementById("chatbox");
  const options = document.getElementById("options");
  
  if (!chatbox || !options) return;
  
  chatbox.innerHTML = "<p>👋 Hello! How can I help you today?</p>";
  options.innerHTML = "";

  const questions = [
    "How do I find the best discounts?",
    "Can I reserve items before pickup?",
    "How to contact the seller?"
  ];

  questions.forEach((q) => {
    const btn = document.createElement("button");
    btn.textContent = q;
    btn.addEventListener("click", () => respondToUser(q));
    options.appendChild(btn);
  });
}

function respondToUser(question) {
  const chatbox = document.getElementById("chatbox");
  if (!chatbox) return;
  
  chatbox.innerHTML += `<p><strong>You:</strong> ${question}</p>`;

  let response = "";
  switch (question) {
    case "How do I find the best discounts?":
      response = "Discounts are shown directly in each food card, look for the percentage off next to the price.";
      break;
    case "Can I reserve items before pickup?":
      response = "Yes! Use the 'Contact Seller' button to reserve your items.";
      break;
    case "How to contact the seller?":
      response = "Just click the 'Contact Seller' button on any food card to start a WhatsApp chat.";
      break;
    default:
      response = "Sorry, I don't have an answer for that yet.";
  }

  chatbox.innerHTML += `<p><strong>AI:</strong> ${response}</p>`;
  chatbox.scrollTop = chatbox.scrollHeight;
}

// Authentication functions
function checkLoginStatus() {
  const userData = localStorage.getItem('nomorroUser');
  const loginBtn = document.getElementById('loginBtn');
  const userProfile = document.getElementById('userProfile');
  
  if (userData && loginBtn && userProfile) {
    const user = JSON.parse(userData);
    showLoggedInState(user.name);
  }
}

function showLoggedInState(userName) {
  const loginBtn = document.getElementById('loginBtn');
  const userProfile = document.getElementById('userProfile');
  const welcomeText = document.getElementById('welcomeText');
  
  if (loginBtn) loginBtn.style.display = 'none';
  if (userProfile) userProfile.style.display = 'flex';
  if (welcomeText) welcomeText.textContent = `Hello, ${userName}!`;
}

function logout() {
  localStorage.removeItem('nomorroUser');
  const loginBtn = document.getElementById('loginBtn');
  const userProfile = document.getElementById('userProfile');
  
  if (loginBtn) loginBtn.style.display = 'block';
  if (userProfile) userProfile.style.display = 'none';
}

// Setup expiry date formatting
function setupExpiryDateFormatting() {
  const expiryInput = document.getElementById("foodExpiry");
  if (expiryInput) {
    expiryInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "").slice(0, 6);
      if (value.length >= 5)
        e.target.value = value.replace(/(\d{2})(\d{2})(\d{2})/, "$1/$2/$3");
      else if (value.length >= 3)
        e.target.value = value.replace(/(\d{2})(\d{2})/, "$1/$2");
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM loaded, initializing surplus market page...");
  
  // Initialize authentication
  checkLoginStatus();
  
  // Display foods immediately
  displayFoods("all");
  
  // Initialize chatbot
  chatInit();
  
  // Setup form handlers
  setupUploadForm();
  setupExpiryDateFormatting();
  
  console.log("Surplus market page initialized successfully");
});

// Also initialize on window load as backup
window.addEventListener('load', function() {
  console.log("Window loaded, ensuring everything is displayed...");
  displayFoods("all");
  checkLoginStatus();
});