// Admin Portal Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is admin
    const currentUserData = localStorage.getItem('currentUser');
    if (!currentUserData) {
        // If user is not logged in, redirect to index page
        window.location.href = 'index.html';
        return;
    }
    
    // Parse user data
    const currentUser = JSON.parse(currentUserData);
    
    // For demo purposes, we'll assume the admin is logged in
    // In a real application, you would check for admin privileges
    
    // Update user info on the page
    const userNameElements = document.querySelectorAll('.user-details h3');
    const userEmailElements = document.querySelectorAll('.user-details p');
    
    userNameElements.forEach(element => {
        element.textContent = "Администратор";
    });
    
    userEmailElements.forEach(element => {
        element.textContent = "admin@electromarket.ru";
    });
    
    // Update user avatar initials
    const userAvatar = document.querySelector('.user-avatar span');
    if (userAvatar) {
        userAvatar.textContent = "АД";
    }
    
    // Update cart count
    const cartCountElement = document.querySelector('.cart-count');
    const cartCount = localStorage.getItem('cartCount') || 0;
    cartCountElement.textContent = cartCount;
    
    // Tab switching
    const tabLinks = document.querySelectorAll('.admin-navigation a[data-tab]');
    const tabContents = document.querySelectorAll('.admin-tab');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all tabs and links
            tabLinks.forEach(link => link.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to current tab and link
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // Load data for the selected tab
            switch(tabId) {
                case 'dashboard':
                    loadDashboardData();
                    break;
                case 'products':
                    loadProductsData();
                    break;
                case 'orders':
                    loadOrdersData();
                    break;
                case 'users':
                    loadUsersData();
                    break;
                case 'promocodes':
                    loadPromocodesData();
                    break;
            }
        });
    });
    
    // Load initial dashboard data
    loadDashboardData();
    
    // Product management
    const addProductBtn = document.getElementById('add-product-btn');
    const productModal = document.getElementById('product-modal');
    const productForm = document.getElementById('product-form');
    const closeProductModal = productModal.querySelector('.close-modal');
    
    // Open product modal for adding
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function() {
            // Reset form
            productForm.reset();
            document.getElementById('product-id').value = '';
            document.getElementById('product-modal-title').textContent = 'Добавить товар';
            
            // Reset dynamic fields
            resetDynamicFields();
            
            productModal.style.display = 'flex';
        });
    }
    
    // Close product modal
    if (closeProductModal) {
        closeProductModal.addEventListener('click', function() {
            productModal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    productModal.addEventListener('click', function(e) {
        if (e.target === productModal) {
            productModal.style.display = 'none';
        }
    });
    
    // Add event listeners for dynamic form elements
    addDynamicFieldListeners();
    
    // Handle product form submission
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const productId = document.getElementById('product-id').value;
            const productName = document.getElementById('product-name').value;
            const productFullName = document.getElementById('product-full-name').value;
            const productCategory = document.getElementById('product-category').value;
            const productPrice = document.getElementById('product-price').value;
            const productOldPrice = document.getElementById('product-old-price').value;
            const productDiscount = document.getElementById('product-discount').value;
            const productStock = document.getElementById('product-stock').value;
            const productDescription = document.getElementById('product-description').value;
            const productFullDescription = document.getElementById('product-full-description').value;
            
            // Get specifications
            const specs = [];
            document.querySelectorAll('#product-specs-container .spec-row').forEach(row => {
                const name = row.querySelector('.spec-name').value;
                const value = row.querySelector('.spec-value').value;
                if (name && value) {
                    specs.push({name, value});
                }
            });
            
            // Get technical parameters
            const params = [];
            document.querySelectorAll('#technical-parameters-container .param-row').forEach(row => {
                const name = row.querySelector('.param-name').value;
                const value = row.querySelector('.param-value').value;
                if (name && value) {
                    params.push({name, value});
                }
            });
            
            // Get documents
            const documents = [];
            document.querySelectorAll('#documents-container .document-row').forEach(row => {
                const name = row.querySelector('.document-name').value;
                const link = row.querySelector('.document-link').value;
                if (name && link) {
                    documents.push({name, link});
                }
            });
            
            // Get analogs
            const analogs = [];
            document.querySelectorAll('#analogs-container .analog-row').forEach(row => {
                const name = row.querySelector('.analog-name').value;
                const link = row.querySelector('.analog-link').value;
                if (name && link) {
                    analogs.push({name, link});
                }
            });
            
            // Get delivery methods
            const deliveryMethods = [];
            document.querySelectorAll('#delivery-methods-container .delivery-row').forEach(row => {
                const name = row.querySelector('.delivery-name').value;
                const description = row.querySelector('.delivery-description').value;
                if (name && description) {
                    deliveryMethods.push({name, description});
                }
            });
            
            // Validate form
            if (!productName || !productCategory || !productPrice || !productStock) {
                alert('Пожалуйста, заполните все обязательные поля');
                return;
            }
            
            // In a real implementation, this would send a request to the server
            if (productId) {
                alert('Товар успешно обновлен');
            } else {
                alert('Товар успешно добавлен');
            }
            
            // Close modal
            productModal.style.display = 'none';
            
            // Reload products data
            loadProductsData();
        });
    }
    
    // Promocode management
    const addPromocodeBtn = document.getElementById('add-promocode-btn');
    const promocodeModal = document.getElementById('promocode-modal');
    const promocodeForm = document.getElementById('promocode-form');
    const closePromocodeModal = promocodeModal.querySelector('.close-modal');
    
    // Open promocode modal for adding
    if (addPromocodeBtn) {
        addPromocodeBtn.addEventListener('click', function() {
            // Reset form
            promocodeForm.reset();
            document.getElementById('promocode-id').value = '';
            document.getElementById('promocode-modal-title').textContent = 'Добавить промокод';
            promocodeModal.style.display = 'flex';
        });
    }
    
    // Close promocode modal
    if (closePromocodeModal) {
        closePromocodeModal.addEventListener('click', function() {
            promocodeModal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    promocodeModal.addEventListener('click', function(e) {
        if (e.target === promocodeModal) {
            promocodeModal.style.display = 'none';
        }
    });
    
    // Handle promocode form submission
    if (promocodeForm) {
        promocodeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const promocodeId = document.getElementById('promocode-id').value;
            const promocodeCode = document.getElementById('promocode-code').value;
            const promocodeDiscount = document.getElementById('promocode-discount').value;
            const promocodeType = document.getElementById('promocode-type').value;
            const promocodeUsageLimit = document.getElementById('promocode-usage-limit').value;
            const promocodeExpiry = document.getElementById('promocode-expiry').value;
            
            // Validate form
            if (!promocodeCode || !promocodeDiscount || !promocodeType || !promocodeUsageLimit || !promocodeExpiry) {
                alert('Пожалуйста, заполните все обязательные поля');
                return;
            }
            
            // In a real implementation, this would send a request to the server
            if (promocodeId) {
                alert('Промокод успешно обновлен');
            } else {
                alert('Промокод успешно добавлен');
            }
            
            // Close modal
            promocodeModal.style.display = 'none';
            
            // Reload promocodes data
            loadPromocodesData();
        });
    }
    
    // Logout button
    const adminLogoutBtn = document.getElementById('admin-logout-btn');
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (confirm('Вы уверены, что хотите выйти?')) {
                // Use the logoutUser function from script.js to properly log out
                if (typeof logoutUser === 'function') {
                    logoutUser();
                } else {
                    // Fallback if logoutUser function is not available
                    localStorage.removeItem('currentUser');
                    localStorage.removeItem('userLoggedIn');
                    localStorage.removeItem('userEmail');
                    localStorage.removeItem('userName');
                    window.location.href = 'index.html';
                }
            }
        });
    }
    
    // Product search and filtering
    const productSearch = document.getElementById('product-search');
    const productCategoryFilter = document.getElementById('product-category-filter');
    
    if (productSearch) {
        productSearch.addEventListener('input', loadProductsData);
    }
    
    if (productCategoryFilter) {
        productCategoryFilter.addEventListener('change', loadProductsData);
    }
    
    // Order search and filtering
    const orderStatusFilter = document.getElementById('order-status-filter');
    const orderSearch = document.getElementById('order-search');
    
    if (orderStatusFilter) {
        orderStatusFilter.addEventListener('change', loadOrdersData);
    }
    
    if (orderSearch) {
        orderSearch.addEventListener('input', loadOrdersData);
    }
    
    // User search
    const userSearch = document.getElementById('user-search');
    
    if (userSearch) {
        userSearch.addEventListener('input', loadUsersData);
    }
});

// Load dashboard data
function loadDashboardData() {
    // In a real implementation, this would fetch data from the server
    // For demo purposes, we'll use dummy data
    
    // Update summary cards
    document.getElementById('total-products').textContent = '142';
    document.getElementById('total-orders').textContent = '86';
    document.getElementById('total-users').textContent = '254';
    document.getElementById('total-promocodes').textContent = '12';
    
    // Add click event listeners to summary cards for navigation
    document.querySelector('.summary-card:nth-child(1)').addEventListener('click', function() {
        navigateToTab('products');
    });
    
    document.querySelector('.summary-card:nth-child(2)').addEventListener('click', function() {
        navigateToTab('orders');
    });
    
    document.querySelector('.summary-card:nth-child(3)').addEventListener('click', function() {
        navigateToTab('users');
    });
    
    document.querySelector('.summary-card:nth-child(4)').addEventListener('click', function() {
        navigateToTab('promocodes');
    });
    
    // Update activity list
    const activityList = document.getElementById('activity-list');
    activityList.innerHTML = `
        <div class="activity-item">
            <div class="activity-icon">📦</div>
            <div class="activity-details">
                <p>Добавлен новый товар: Резистор 10 кОм</p>
                <span class="activity-date">15 апреля 2025, 14:30</span>
            </div>
        </div>
        <div class="activity-item">
            <div class="activity-icon">🛒</div>
            <div class="activity-details">
                <p>Заказ №1259 оформлен</p>
                <span class="activity-date">15 апреля 2025, 12:15</span>
            </div>
        </div>
        <div class="activity-item">
            <div class="activity-icon">🏷️</div>
            <div class="activity-details">
                <p>Создан промокод SPRING2025</p>
                <span class="activity-date">14 апреля 2025, 16:45</span>
            </div>
        </div>
        <div class="activity-item">
            <div class="activity-icon">👤</div>
            <div class="activity-details">
                <p>Новый пользователь зарегистрирован</p>
                <span class="activity-date">14 апреля 2025, 10:20</span>
            </div>
        </div>
    `;
}

// Load products data
function loadProductsData() {
    // In a real implementation, this would fetch data from the server
    // For demo purposes, we'll use dummy data
    
    const searchQuery = document.getElementById('product-search') ? document.getElementById('product-search').value.toLowerCase() : '';
    const categoryFilter = document.getElementById('product-category-filter') ? document.getElementById('product-category-filter').value : 'all';
    
    // Dummy products data
    const products = [
        { id: 1, name: 'Резистор 1 кОм', category: 'resistors', price: 0.50, stock: 1000, image: 'images/placeholder.svg' },
        { id: 2, name: 'Конденсатор 100 мкФ', category: 'capacitors', price: 1.20, stock: 500, image: 'images/placeholder.svg' },
        { id: 3, name: 'Arduino Uno R3', category: 'ics', price: 750.00, stock: 25, image: 'images/placeholder.svg' },
        { id: 4, name: 'Светодиод RGB', category: 'leds', price: 3.50, stock: 200, image: 'images/placeholder.svg' },
        { id: 5, name: 'Резистор 10 кОм', category: 'resistors', price: 0.45, stock: 800, image: 'images/placeholder.svg' },
        { id: 6, name: 'Конденсатор 10 мкФ', category: 'capacitors', price: 0.80, stock: 600, image: 'images/placeholder.svg' }
    ];
    
    // Filter products based on search and category
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery);
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });
    
    // Update products table
    const productsTableBody = document.getElementById('products-table-body');
    productsTableBody.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${product.image}" alt="${product.name}" class="table-image"></td>
            <td>${product.name}</td>
            <td>${getCategoryName(product.category)}</td>
            <td>${product.price.toFixed(2)} ₽</td>
            <td>${product.stock} шт.</td>
            <td>
                <button class="btn-small btn-edit" data-id="${product.id}">Редактировать</button>
                <button class="btn-small btn-delete" data-id="${product.id}">Удалить</button>
            </td>
        `;
        productsTableBody.appendChild(row);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.btn-edit').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            editProduct(productId);
        });
    });
    
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            deleteProduct(productId);
        });
    });
}

// Load orders data
function loadOrdersData() {
    // In a real implementation, this would fetch data from the server
    // For demo purposes, we'll use dummy data
    
    const statusFilter = document.getElementById('order-status-filter') ? document.getElementById('order-status-filter').value : 'all';
    const searchQuery = document.getElementById('order-search') ? document.getElementById('order-search').value.toLowerCase() : '';
    
    // Dummy orders data
    const orders = [
        { id: 1258, customer: 'Иван Петров', date: '17.04.2025', amount: 2500.00, status: 'shipped' },
        { id: 1259, customer: 'Мария Сидорова', date: '18.04.2025', amount: 1200.50, status: 'processing' },
        { id: 1260, customer: 'Алексей Иванов', date: '18.04.2025', amount: 4500.75, status: 'pending' },
        { id: 1261, customer: 'Елена Козлова', date: '19.04.2025', amount: 850.25, status: 'delivered' }
    ];
    
    // Filter orders based on status and search
    const filteredOrders = orders.filter(order => {
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        const matchesSearch = !searchQuery || order.id.toString().includes(searchQuery);
        return matchesStatus && matchesSearch;
    });
    
    // Update orders table
    const ordersTableBody = document.getElementById('orders-table-body');
    ordersTableBody.innerHTML = '';
    
    filteredOrders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>№${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.date}</td>
            <td>${order.amount.toFixed(2)} ₽</td>
            <td><span class="status ${order.status}">${getStatusName(order.status)}</span></td>
            <td>
                <button class="btn-small btn-view" data-id="${order.id}">Просмотр</button>
            </td>
        `;
        ordersTableBody.appendChild(row);
    });
    
    // Add event listeners to view buttons
    document.querySelectorAll('.btn-view').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.getAttribute('data-id');
            viewOrder(orderId);
        });
    });
}

// Load users data
function loadUsersData() {
    // In a real implementation, this would fetch data from the server
    // For demo purposes, we'll use dummy data
    
    const searchQuery = document.getElementById('user-search') ? document.getElementById('user-search').value.toLowerCase() : '';
    
    // Dummy users data
    const users = [
        { id: 1, name: 'Иван Петров', email: 'ivan@example.com', registered: '15.03.2025', status: 'active' },
        { id: 2, name: 'Мария Сидорова', email: 'maria@example.com', registered: '18.03.2025', status: 'active' },
        { id: 3, name: 'Алексей Иванов', email: 'alexey@example.com', registered: '22.03.2025', status: 'inactive' },
        { id: 4, name: 'Елена Козлова', email: 'elena@example.com', registered: '01.04.2025', status: 'active' }
    ];
    
    // Filter users based on search
    const filteredUsers = users.filter(user => {
        return user.name.toLowerCase().includes(searchQuery) || user.email.toLowerCase().includes(searchQuery);
    });
    
    // Update users table
    const usersTableBody = document.getElementById('users-table-body');
    usersTableBody.innerHTML = '';
    
    filteredUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.registered}</td>
            <td><span class="status ${user.status}">${getStatusName(user.status)}</span></td>
            <td>
                <button class="btn-small btn-edit" data-id="${user.id}">Редактировать</button>
                <button class="btn-small btn-delete" data-id="${user.id}">Удалить</button>
            </td>
        `;
        usersTableBody.appendChild(row);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.btn-edit').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-id');
            editUser(userId);
        });
    });
    
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-id');
            deleteUser(userId);
        });
    });
}

// Load promocodes data
function loadPromocodesData() {
    // In a real implementation, this would fetch data from the server
    // For demo purposes, we'll use dummy data
    
    // Dummy promocodes data
    const promocodes = [
        { id: 1, code: 'SPRING2025', discount: 15, type: 'percentage', usage: 25, limit: 100, expiry: '30.06.2025', status: 'active' },
        { id: 2, code: 'NEWUSER10', discount: 10, type: 'percentage', usage: 42, limit: 50, expiry: '31.05.2025', status: 'active' },
        { id: 3, code: 'WELCOME500', discount: 500, type: 'fixed', usage: 8, limit: 20, expiry: '15.05.2025', status: 'expired' }
    ];
    
    // Update promocodes table
    const promocodesTableBody = document.getElementById('promocodes-table-body');
    promocodesTableBody.innerHTML = '';
    
    promocodes.forEach(promocode => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${promocode.code}</td>
            <td>${promocode.discount}${promocode.type === 'percentage' ? '%' : ' ₽'}</td>
            <td>${promocode.type === 'percentage' ? 'Процент' : 'Фиксированная сумма'}</td>
            <td>${promocode.usage}/${promocode.limit}</td>
            <td>${promocode.expiry}</td>
            <td><span class="status ${promocode.status}">${getStatusName(promocode.status)}</span></td>
            <td>
                <button class="btn-small btn-edit" data-id="${promocode.id}">Редактировать</button>
                <button class="btn-small btn-delete" data-id="${promocode.id}">Удалить</button>
            </td>
        `;
        promocodesTableBody.appendChild(row);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.btn-edit').forEach(button => {
        button.addEventListener('click', function() {
            const promocodeId = this.getAttribute('data-id');
            editPromocode(promocodeId);
        });
    });
    
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', function() {
            const promocodeId = this.getAttribute('data-id');
            deletePromocode(promocodeId);
        });
    });
}

// Helper functions
function getCategoryName(category) {
    const categories = {
        'resistors': 'Резисторы',
        'capacitors': 'Конденсаторы',
        'ics': 'Микросхемы',
        'leds': 'Светодиоды'
    };
    return categories[category] || category;
}

function getStatusName(status) {
    const statuses = {
        'pending': 'В обработке',
        'processing': 'Обрабатывается',
        'shipped': 'Отправлен',
        'delivered': 'Доставлен',
        'cancelled': 'Отменен',
        'active': 'Активен',
        'inactive': 'Неактивен',
        'expired': 'Истёк'
    };
    return statuses[status] || status;
}

// Product management functions
function editProduct(productId) {
    // In a real implementation, this would fetch product data from the server
    // For demo purposes, we'll use dummy data
    
    // Set form values
    document.getElementById('product-id').value = productId;
    document.getElementById('product-name').value = 'Резистор 1 кОм';
    document.getElementById('product-full-name').value = 'Резистор 1 кОм, металлопленочный';
    document.getElementById('product-category').value = 'resistors';
    document.getElementById('product-price').value = '0.50';
    document.getElementById('product-old-price').value = '0.75';
    document.getElementById('product-discount').value = '25';
    document.getElementById('product-stock').value = '1000';
    document.getElementById('product-description').value = 'Металлопленочный резистор 1 кОм, 0.25 Вт';
    document.getElementById('product-full-description').value = 'Металлопленочные резисторы серии MR25 используются в цепях с высокой точностью и стабильностью характеристик. Они обладают низким уровнем шума и excellent частотными характеристиками, что делает их идеальными для применения в аудио и прецизионных измерительных приборах. Резисторы соответствуют стандартам IEC 60115 и имеют сертификат соответствия RoHS.';
    
    // Reset and populate specifications
    const specsContainer = document.getElementById('product-specs-container');
    specsContainer.innerHTML = '';
    const specs = [
        {name: "Тип", value: "Металлопленочный"},
        {name: "Сопротивление", value: "1 кОм"},
        {name: "Мощность", value: "0.25 Вт"},
        {name: "Допуск", value: "±1%"},
        {name: "Температурный коэффициент", value: "±100 ppm/°C"}
    ];
    
    specs.forEach(spec => {
        const newRow = document.createElement('div');
        newRow.className = 'spec-row';
        newRow.innerHTML = `
            <input type="text" class="spec-name" value="${spec.name}">
            <input type="text" class="spec-value" value="${spec.value}">
            <button type="button" class="btn-small btn-remove-spec">-</button>
        `;
        specsContainer.appendChild(newRow);
        
        // Add event listener to remove button
        newRow.querySelector('.btn-remove-spec').addEventListener('click', function() {
            if (specsContainer.querySelectorAll('.spec-row').length > 1) {
                specsContainer.removeChild(newRow);
            }
        });
    });
    
    // Add one empty row for new specification
    const emptySpecRow = document.createElement('div');
    emptySpecRow.className = 'spec-row';
    emptySpecRow.innerHTML = `
        <input type="text" class="spec-name" placeholder="Название характеристики">
        <input type="text" class="spec-value" placeholder="Значение">
        <button type="button" class="btn-small btn-remove-spec">-</button>
    `;
    specsContainer.appendChild(emptySpecRow);
    
    // Add event listener to remove button for empty row
    emptySpecRow.querySelector('.btn-remove-spec').addEventListener('click', function() {
        if (specsContainer.querySelectorAll('.spec-row').length > 1) {
            specsContainer.removeChild(emptySpecRow);
        }
    });
    
    // Update modal title
    document.getElementById('product-modal-title').textContent = 'Редактировать товар';
    
    // Show modal
    document.getElementById('product-modal').style.display = 'flex';
}

function deleteProduct(productId) {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
        // In a real implementation, this would send a request to the server
        alert('Товар успешно удален');
        loadProductsData();
    }
}

// Order management functions
function viewOrder(orderId) {
    // In a real implementation, this would fetch order details from the server
    alert(`Просмотр заказа №${orderId}`);
}

// User management functions
function editUser(userId) {
    // In a real implementation, this would fetch user data from the server
    // For demo purposes, we'll use dummy data
    
    alert(`Редактирование пользователя ID: ${userId}`);
}

function deleteUser(userId) {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
        // In a real implementation, this would send a request to the server
        alert('Пользователь успешно удален');
        loadUsersData();
    }
}

// Promocode management functions
function editPromocode(promocodeId) {
    // In a real implementation, this would fetch promocode data from the server
    // For demo purposes, we'll use dummy data
    
    // Set form values
    document.getElementById('promocode-id').value = promocodeId;
    document.getElementById('promocode-code').value = 'SPRING2025';
    document.getElementById('promocode-discount').value = '15';
    document.getElementById('promocode-type').value = 'percentage';
    document.getElementById('promocode-usage-limit').value = '100';
    document.getElementById('promocode-expiry').value = '2025-06-30';
    
    // Update modal title
    document.getElementById('promocode-modal-title').textContent = 'Редактировать промокод';
    
    // Show modal
    document.getElementById('promocode-modal').style.display = 'flex';
}

function deletePromocode(promocodeId) {
    if (confirm('Вы уверены, что хотите удалить этот промокод?')) {
        // In a real implementation, this would send a request to the server
        alert('Промокод успешно удален');
        loadPromocodesData();
    }
}

// Function to navigate to a specific tab
function navigateToTab(tabId) {
    // Remove active class from all tabs and links
    const tabLinks = document.querySelectorAll('.admin-navigation a[data-tab]');
    const tabContents = document.querySelectorAll('.admin-tab');
    
    tabLinks.forEach(link => link.classList.remove('active'));
    tabContents.forEach(tab => tab.classList.remove('active'));
    
    // Add active class to selected tab and link
    const targetLink = document.querySelector(`.admin-navigation a[data-tab="${tabId}"]`);
    const targetTab = document.getElementById(tabId);
    
    if (targetLink && targetTab) {
        targetLink.classList.add('active');
        targetTab.classList.add('active');
        
        // Load data for the selected tab
        switch(tabId) {
            case 'dashboard':
                loadDashboardData();
                break;
            case 'products':
                loadProductsData();
                break;
            case 'orders':
                loadOrdersData();
                break;
            case 'users':
                loadUsersData();
                break;
            case 'promocodes':
                loadPromocodesData();
                break;
        }
    }
}

// Add event listeners for dynamic form elements after DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    addDynamicFieldListeners();
});

// Function to reset dynamic fields
function resetDynamicFields() {
    // Reset specifications
    const specsContainer = document.getElementById('product-specs-container');
    specsContainer.innerHTML = `
        <div class="spec-row">
            <input type="text" class="spec-name" placeholder="Название характеристики">
            <input type="text" class="spec-value" placeholder="Значение">
            <button type="button" class="btn-small btn-remove-spec">-</button>
        </div>
    `;
    
    // Reset technical parameters
    const paramsContainer = document.getElementById('technical-parameters-container');
    paramsContainer.innerHTML = `
        <div class="param-row">
            <input type="text" class="param-name" placeholder="Параметр">
            <input type="text" class="param-value" placeholder="Значение">
            <button type="button" class="btn-small btn-remove-param">-</button>
        </div>
    `;
    
    // Reset documents
    const docsContainer = document.getElementById('documents-container');
    docsContainer.innerHTML = `
        <div class="document-row">
            <input type="text" class="document-name" placeholder="Название документа">
            <input type="text" class="document-link" placeholder="Ссылка на документ">
            <button type="button" class="btn-small btn-remove-doc">-</button>
        </div>
    `;
    
    // Reset analogs
    const analogsContainer = document.getElementById('analogs-container');
    analogsContainer.innerHTML = `
        <div class="analog-row">
            <input type="text" class="analog-name" placeholder="Название аналога">
            <input type="text" class="analog-link" placeholder="Ссылка на аналог">
            <button type="button" class="btn-small btn-remove-analog">-</button>
        </div>
    `;
    
    // Reset delivery methods
    const deliveryContainer = document.getElementById('delivery-methods-container');
    deliveryContainer.innerHTML = `
        <div class="delivery-row">
            <input type="text" class="delivery-name" placeholder="Название способа доставки">
            <textarea class="delivery-description" placeholder="Описание"></textarea>
            <button type="button" class="btn-small btn-remove-delivery">-</button>
        </div>
    `;
}

// Function to add event listeners for dynamic form elements
function addDynamicFieldListeners() {
    // Add specification
    document.getElementById('add-spec-btn').addEventListener('click', function() {
        const container = document.getElementById('product-specs-container');
        const newRow = document.createElement('div');
        newRow.className = 'spec-row';
        newRow.innerHTML = `
            <input type="text" class="spec-name" placeholder="Название характеристики">
            <input type="text" class="spec-value" placeholder="Значение">
            <button type="button" class="btn-small btn-remove-spec">-</button>
        `;
        container.appendChild(newRow);
        
        // Add event listener to remove button
        newRow.querySelector('.btn-remove-spec').addEventListener('click', function() {
            if (container.querySelectorAll('.spec-row').length > 1) {
                container.removeChild(newRow);
            }
        });
    });
    
    // Add parameter
    document.getElementById('add-param-btn').addEventListener('click', function() {
        const container = document.getElementById('technical-parameters-container');
        const newRow = document.createElement('div');
        newRow.className = 'param-row';
        newRow.innerHTML = `
            <input type="text" class="param-name" placeholder="Параметр">
            <input type="text" class="param-value" placeholder="Значение">
            <button type="button" class="btn-small btn-remove-param">-</button>
        `;
        container.appendChild(newRow);
        
        // Add event listener to remove button
        newRow.querySelector('.btn-remove-param').addEventListener('click', function() {
            if (container.querySelectorAll('.param-row').length > 1) {
                container.removeChild(newRow);
            }
        });
    });
    
    // Add document
    document.getElementById('add-doc-btn').addEventListener('click', function() {
        const container = document.getElementById('documents-container');
        const newRow = document.createElement('div');
        newRow.className = 'document-row';
        newRow.innerHTML = `
            <input type="text" class="document-name" placeholder="Название документа">
            <input type="text" class="document-link" placeholder="Ссылка на документ">
            <button type="button" class="btn-small btn-remove-doc">-</button>
        `;
        container.appendChild(newRow);
        
        // Add event listener to remove button
        newRow.querySelector('.btn-remove-doc').addEventListener('click', function() {
            if (container.querySelectorAll('.document-row').length > 1) {
                container.removeChild(newRow);
            }
        });
    });
    
    // Add analog
    document.getElementById('add-analog-btn').addEventListener('click', function() {
        const container = document.getElementById('analogs-container');
        const newRow = document.createElement('div');
        newRow.className = 'analog-row';
        newRow.innerHTML = `
            <input type="text" class="analog-name" placeholder="Название аналога">
            <input type="text" class="analog-link" placeholder="Ссылка на аналог">
            <button type="button" class="btn-small btn-remove-analog">-</button>
        `;
        container.appendChild(newRow);
        
        // Add event listener to remove button
        newRow.querySelector('.btn-remove-analog').addEventListener('click', function() {
            if (container.querySelectorAll('.analog-row').length > 1) {
                container.removeChild(newRow);
            }
        });
    });
    
    // Add delivery method
    document.getElementById('add-delivery-btn').addEventListener('click', function() {
        const container = document.getElementById('delivery-methods-container');
        const newRow = document.createElement('div');
        newRow.className = 'delivery-row';
        newRow.innerHTML = `
            <input type="text" class="delivery-name" placeholder="Название способа доставки">
            <textarea class="delivery-description" placeholder="Описание"></textarea>
            <button type="button" class="btn-small btn-remove-delivery">-</button>
        `;
        container.appendChild(newRow);
        
        // Add event listener to remove button
        newRow.querySelector('.btn-remove-delivery').addEventListener('click', function() {
            if (container.querySelectorAll('.delivery-row').length > 1) {
                container.removeChild(newRow);
            }
        });
    });
    
    // Add event listeners to existing remove buttons
    document.querySelectorAll('.btn-remove-spec').forEach(button => {
        button.addEventListener('click', function() {
            const container = document.getElementById('product-specs-container');
            if (container.querySelectorAll('.spec-row').length > 1) {
                button.closest('.spec-row').remove();
            }
        });
    });
    
    document.querySelectorAll('.btn-remove-param').forEach(button => {
        button.addEventListener('click', function() {
            const container = document.getElementById('technical-parameters-container');
            if (container.querySelectorAll('.param-row').length > 1) {
                button.closest('.param-row').remove();
            }
        });
    });
    
    document.querySelectorAll('.btn-remove-doc').forEach(button => {
        button.addEventListener('click', function() {
            const container = document.getElementById('documents-container');
            if (container.querySelectorAll('.document-row').length > 1) {
                button.closest('.document-row').remove();
            }
        });
    });
    
    document.querySelectorAll('.btn-remove-analog').forEach(button => {
        button.addEventListener('click', function() {
            const container = document.getElementById('analogs-container');
            if (container.querySelectorAll('.analog-row').length > 1) {
                button.closest('.analog-row').remove();
            }
        });
    });
    
    document.querySelectorAll('.btn-remove-delivery').forEach(button => {
        button.addEventListener('click', function() {
            const container = document.getElementById('delivery-methods-container');
            if (container.querySelectorAll('.delivery-row').length > 1) {
                button.closest('.delivery-row').remove();
            }
        });
    });
}
