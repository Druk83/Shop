// Account page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUserData = localStorage.getItem('currentUser');
    if (!currentUserData) {
        // If user is not logged in, redirect to index page
        window.location.href = 'index.html';
        return;
    }
    
    // Parse user data
    const currentUser = JSON.parse(currentUserData);
    
    // Update user info on the page
    const userNameElements = document.querySelectorAll('.user-details h3');
    const userEmailElements = document.querySelectorAll('.user-details p');
    
    userNameElements.forEach(element => {
        element.textContent = currentUser.name;
    });
    
    userEmailElements.forEach(element => {
        element.textContent = currentUser.email;
    });
    
    // Update user avatar initials
    const userAvatar = document.querySelector('.user-avatar span');
    if (userAvatar) {
        const nameParts = currentUser.name.split(' ');
        let initials = '';
        if (nameParts.length > 0) {
            initials += nameParts[0].charAt(0).toUpperCase();
        }
        if (nameParts.length > 1) {
            initials += nameParts[1].charAt(0).toUpperCase();
        }
        userAvatar.textContent = initials;
    }
    
    // Update cart count
    const cartCountElement = document.querySelector('.cart-count');
    const cartCount = localStorage.getItem('cartCount') || 0;
    cartCountElement.textContent = cartCount;
    
    // Tab switching
    const tabLinks = document.querySelectorAll('.account-navigation a[data-tab]');
    const tabContents = document.querySelectorAll('.account-tab');
    
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
            
            // Save active tab to localStorage
            localStorage.setItem('activeAccountTab', tabId);
        });
    });
    
    // Load active tab from localStorage
    const activeTab = localStorage.getItem('activeAccountTab');
    if (activeTab) {
        document.querySelector(`.account-navigation a[data-tab="${activeTab}"]`).click();
    }
    
    // Order details toggle
    const orderHeaders = document.querySelectorAll('.order-header');
    orderHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const orderItem = this.closest('.order-item');
            const orderDetails = orderItem.querySelector('.order-details');
            const toggleIcon = this.querySelector('.order-toggle span');
            
            if (orderDetails.style.display === 'block') {
                orderDetails.style.display = 'none';
                toggleIcon.textContent = '▼';
            } else {
                orderDetails.style.display = 'block';
                toggleIcon.textContent = '▲';
            }
        });
    });
    
    // Initialize: Hide all order details on page load
    document.querySelectorAll('.order-details').forEach(details => {
        details.style.display = 'none';
    });
    
    // Address management
    const addAddressBtn = document.querySelector('.add-address-btn');
    const addressForm = document.querySelector('.address-form');
    const cancelAddressBtn = document.querySelector('.cancel-address');
    
    if (addAddressBtn) {
        addAddressBtn.addEventListener('click', function() {
            addressForm.style.display = 'block';
            this.style.display = 'none';
            
            // Reset form
            document.getElementById('address-form').reset();
            document.querySelector('.address-form h3').textContent = 'Добавить новый адрес';
        });
    }
    
    if (cancelAddressBtn) {
        cancelAddressBtn.addEventListener('click', function() {
            addressForm.style.display = 'none';
            addAddressBtn.style.display = 'block';
        });
    }
    
    // Edit address
    const editAddressBtns = document.querySelectorAll('.edit-address');
    editAddressBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const addressId = this.getAttribute('data-address-id');
            const addressItem = this.closest('.address-item');
            const addressName = addressItem.querySelector('h3').textContent;
            const addressDetails = addressItem.querySelectorAll('.address-details p');
            
            // Fill form with address details
            document.getElementById('address-name').value = addressName;
            document.getElementById('full-name').value = addressDetails[0].textContent;
            
            // Extract city and street from the address
            const fullAddress = addressDetails[1].textContent;
            const cityMatch = fullAddress.match(/г\.\s([^,]+)/);
            const city = cityMatch ? cityMatch[1] : '';
            document.getElementById('city').value = city;
            document.getElementById('street-address').value = fullAddress.replace(`г. ${city}, `, '');
            
            // Extract postal code
            const postalCode = addressDetails[2].textContent.replace('Индекс: ', '');
            document.getElementById('postal-code').value = postalCode;
            
            // Extract phone
            const phone = addressDetails[3].textContent.replace('Телефон: ', '');
            document.getElementById('phone').value = phone;
            
            // Check if this is the default address
            document.getElementById('default-address').checked = addressItem.classList.contains('default');
            
            // Show form and update title
            addressForm.style.display = 'block';
            addAddressBtn.style.display = 'none';
            document.querySelector('.address-form h3').textContent = 'Редактировать адрес';
            
            // Add address ID to form for updating
            document.getElementById('address-form').setAttribute('data-address-id', addressId);
        });
    });
    
    // Set default address
    const setDefaultBtns = document.querySelectorAll('.set-default-address');
    setDefaultBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const addressId = this.getAttribute('data-address-id');
            
            // Remove default class from all addresses
            document.querySelectorAll('.address-item').forEach(item => {
                item.classList.remove('default');
                
                // Show "Set as default" button for all addresses
                const setDefaultBtn = item.querySelector('.set-default-address');
                if (setDefaultBtn) {
                    setDefaultBtn.style.display = 'block';
                }
            });
            
            // Add default class to selected address
            const selectedAddress = document.querySelector(`.address-item:has([data-address-id="${addressId}"])`);
            selectedAddress.classList.add('default');
            
            // Hide "Set as default" button for the default address
            this.style.display = 'none';
            
            // Add default badge if it doesn't exist
            if (!selectedAddress.querySelector('.address-badge')) {
                const badge = document.createElement('div');
                badge.className = 'address-badge';
                badge.textContent = 'По умолчанию';
                selectedAddress.insertBefore(badge, selectedAddress.firstChild);
            }
            
            alert('Адрес установлен как основной');
        });
    });
    
    // Delete address
    const deleteAddressBtns = document.querySelectorAll('.delete-address');
    deleteAddressBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const addressId = this.getAttribute('data-address-id');
            const addressItem = this.closest('.address-item');
            
            if (confirm('Вы уверены, что хотите удалить этот адрес?')) {
                // In a real implementation, this would send a request to the server
                addressItem.remove();
                alert('Адрес успешно удален');
            }
        });
    });
    
    // Save address form
    const addressFormElement = document.getElementById('address-form');
    if (addressFormElement) {
        addressFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const addressName = document.getElementById('address-name').value;
            const fullName = document.getElementById('full-name').value;
            const city = document.getElementById('city').value;
            const streetAddress = document.getElementById('street-address').value;
            const postalCode = document.getElementById('postal-code').value;
            const phone = document.getElementById('phone').value;
            const isDefault = document.getElementById('default-address').checked;
            
            // Validate form
            if (!addressName || !fullName || !city || !streetAddress || !postalCode || !phone) {
                alert('Пожалуйста, заполните все поля');
                return;
            }
            
            // Check if editing existing address
            const addressId = this.getAttribute('data-address-id');
            
            if (addressId) {
                // Update existing address
                const addressItem = document.querySelector(`.address-item:has([data-address-id="${addressId}"])`);
                
                // Update address details
                addressItem.querySelector('h3').textContent = addressName;
                const addressDetails = addressItem.querySelectorAll('.address-details p');
                addressDetails[0].textContent = fullName;
                addressDetails[1].textContent = `г. ${city}, ${streetAddress}`;
                addressDetails[2].textContent = `Индекс: ${postalCode}`;
                addressDetails[3].textContent = `Телефон: ${phone}`;
                
                // Handle default address
                if (isDefault) {
                    // Remove default class from all addresses
                    document.querySelectorAll('.address-item').forEach(item => {
                        item.classList.remove('default');
                        
                        // Remove default badge
                        const badge = item.querySelector('.address-badge');
                        if (badge) {
                            badge.remove();
                        }
                        
                        // Show "Set as default" button
                        const setDefaultBtn = item.querySelector('.set-default-address');
                        if (setDefaultBtn) {
                            setDefaultBtn.style.display = 'block';
                        }
                    });
                    
                    // Add default class to edited address
                    addressItem.classList.add('default');
                    
                    // Add default badge if it doesn't exist
                    if (!addressItem.querySelector('.address-badge')) {
                        const badge = document.createElement('div');
                        badge.className = 'address-badge';
                        badge.textContent = 'По умолчанию';
                        addressItem.insertBefore(badge, addressItem.firstChild);
                    }
                    
                    // Hide "Set as default" button
                    const setDefaultBtn = addressItem.querySelector('.set-default-address');
                    if (setDefaultBtn) {
                        setDefaultBtn.style.display = 'none';
                    }
                }
                
                alert('Адрес успешно обновлен');
            } else {
                // Create new address HTML
                const newAddress = document.createElement('div');
                newAddress.className = 'address-item' + (isDefault ? ' default' : '');
                
                // Generate a unique ID for the new address
                const newAddressId = Date.now().toString();
                
                // Address HTML structure
                let addressHTML = '';
                
                if (isDefault) {
                    addressHTML += `<div class="address-badge">По умолчанию</div>`;
                    
                    // Remove default class from all other addresses
                    document.querySelectorAll('.address-item').forEach(item => {
                        item.classList.remove('default');
                        
                        // Remove default badge
                        const badge = item.querySelector('.address-badge');
                        if (badge) {
                            badge.remove();
                        }
                        
                        // Show "Set as default" button
                        const setDefaultBtn = item.querySelector('.set-default-address');
                        if (setDefaultBtn) {
                            setDefaultBtn.style.display = 'block';
                        }
                    });
                }
                
                addressHTML += `
                    <div class="address-details">
                        <h3>${addressName}</h3>
                        <p>${fullName}</p>
                        <p>г. ${city}, ${streetAddress}</p>
                        <p>Индекс: ${postalCode}</p>
                        <p>Телефон: ${phone}</p>
                    </div>
                    <div class="address-actions">
                `;
                
                if (!isDefault) {
                    addressHTML += `<button class="set-default-address" data-address-id="${newAddressId}">Сделать основным</button>`;
                }
                
                addressHTML += `
                        <button class="edit-address" data-address-id="${newAddressId}">Редактировать</button>
                        <button class="delete-address" data-address-id="${newAddressId}">Удалить</button>
                    </div>
                `;
                
                newAddress.innerHTML = addressHTML;
                
                // Add event listeners to new buttons
                const newEditBtn = newAddress.querySelector('.edit-address');
                newEditBtn.addEventListener('click', function() {
                    // Same edit logic as above
                    const addressId = this.getAttribute('data-address-id');
                    const addressItem = this.closest('.address-item');
                    const addressName = addressItem.querySelector('h3').textContent;
                    const addressDetails = addressItem.querySelectorAll('.address-details p');
                    
                    document.getElementById('address-name').value = addressName;
                    document.getElementById('full-name').value = addressDetails[0].textContent;
                    
                    const fullAddress = addressDetails[1].textContent;
                    const cityMatch = fullAddress.match(/г\.\s([^,]+)/);
                    const city = cityMatch ? cityMatch[1] : '';
                    document.getElementById('city').value = city;
                    document.getElementById('street-address').value = fullAddress.replace(`г. ${city}, `, '');
                    
                    const postalCode = addressDetails[2].textContent.replace('Индекс: ', '');
                    document.getElementById('postal-code').value = postalCode;
                    
                    const phone = addressDetails[3].textContent.replace('Телефон: ', '');
                    document.getElementById('phone').value = phone;
                    
                    document.getElementById('default-address').checked = addressItem.classList.contains('default');
                    
                    addressForm.style.display = 'block';
                    addAddressBtn.style.display = 'none';
                    document.querySelector('.address-form h3').textContent = 'Редактировать адрес';
                    
                    document.getElementById('address-form').setAttribute('data-address-id', addressId);
                });
                
                const newDeleteBtn = newAddress.querySelector('.delete-address');
                newDeleteBtn.addEventListener('click', function() {
                    if (confirm('Вы уверены, что хотите удалить этот адрес?')) {
                        this.closest('.address-item').remove();
                        alert('Адрес успешно удален');
                    }
                });
                
                const newSetDefaultBtn = newAddress.querySelector('.set-default-address');
                if (newSetDefaultBtn) {
                    newSetDefaultBtn.addEventListener('click', function() {
                        const addressId = this.getAttribute('data-address-id');
                        
                        document.querySelectorAll('.address-item').forEach(item => {
                            item.classList.remove('default');
                            
                            const badge = item.querySelector('.address-badge');
                            if (badge) {
                                badge.remove();
                            }
                            
                            const setDefaultBtn = item.querySelector('.set-default-address');
                            if (setDefaultBtn) {
                                setDefaultBtn.style.display = 'block';
                            }
                        });
                        
                        const selectedAddress = this.closest('.address-item');
                        selectedAddress.classList.add('default');
                        this.style.display = 'none';
                        
                        if (!selectedAddress.querySelector('.address-badge')) {
                            const badge = document.createElement('div');
                            badge.className = 'address-badge';
                            badge.textContent = 'По умолчанию';
                            selectedAddress.insertBefore(badge, selectedAddress.firstChild);
                        }
                        
                        alert('Адрес установлен как основной');
                    });
                }
                
                // Add new address to the list
                const addressesList = document.querySelector('.addresses-list');
                addressesList.appendChild(newAddress);
                
                alert('Новый адрес успешно добавлен');
            }
            
            // Hide form and show add button
            addressForm.style.display = 'none';
            addAddressBtn.style.display = 'block';
            
            // Reset form and remove address ID
            this.reset();
            this.removeAttribute('data-address-id');
        });
    }
    
    // Profile form
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            const name = document.getElementById('profile-name').value;
            const email = document.getElementById('profile-email').value;
            const phone = document.getElementById('profile-phone').value;
            
            if (!name || !email || !phone) {
                alert('Пожалуйста, заполните все обязательные поля');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Пожалуйста, введите корректный email');
                return;
            }
            
            // Update user info in localStorage
            const currentUserData = localStorage.getItem('currentUser');
            if (currentUserData) {
                const currentUser = JSON.parse(currentUserData);
                currentUser.name = name;
                currentUser.email = email;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
            
            // Update user info on the page
            const userNameElements = document.querySelectorAll('.user-details h3');
            const userEmailElements = document.querySelectorAll('.user-details p');
            
            userNameElements.forEach(element => {
                element.textContent = name;
            });
            
            userEmailElements.forEach(element => {
                element.textContent = email;
            });
            
            // In a real implementation, this would send a request to the server
            alert('Личные данные успешно обновлены');
        });
    }
    
    // Password form
    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            // Validate form
            if (!currentPassword || !newPassword || !confirmPassword) {
                alert('Пожалуйста, заполните все поля');
                return;
            }
            
            // Check password strength
            if (newPassword.length < 8) {
                alert('Новый пароль должен содержать не менее 8 символов');
                return;
            }
            
            // Check if passwords match
            if (newPassword !== confirmPassword) {
                alert('Пароли не совпадают');
                return;
            }
            
            // In a real implementation, this would send a request to the server
            alert('Пароль успешно изменен');
            
            // Reset form
            this.reset();
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
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
    
    // Order filtering
    const orderStatusFilter = document.getElementById('order-status-filter');
    const orderSearch = document.getElementById('order-search');
    
    function filterOrders() {
        const statusFilter = orderStatusFilter ? orderStatusFilter.value : 'all';
        const searchQuery = orderSearch ? orderSearch.value.toLowerCase() : '';
        
        const orderItems = document.querySelectorAll('.order-item');
        
        orderItems.forEach(item => {
            const status = item.querySelector('.order-status').classList[1];
            const orderId = item.querySelector('.order-id h3').textContent.toLowerCase();
            
            const statusMatch = statusFilter === 'all' || status === statusFilter;
            const searchMatch = !searchQuery || orderId.includes(searchQuery);
            
            item.style.display = statusMatch && searchMatch ? 'block' : 'none';
        });
    }
    
    if (orderStatusFilter) {
        orderStatusFilter.addEventListener('change', filterOrders);
    }
    
    if (orderSearch) {
        orderSearch.addEventListener('input', filterOrders);
    }
    
    // Order actions
    const repeatOrderBtns = document.querySelectorAll('.repeat-order');
    repeatOrderBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // In a real implementation, this would add the products to the cart
            alert('Товары добавлены в корзину');
        });
    });
    
    const trackOrderBtns = document.querySelectorAll('.track-order');
    trackOrderBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const orderId = this.closest('.order-item').querySelector('.order-header').getAttribute('data-order-id');
            
            // In a real implementation, this would open a tracking page
            alert(`Отслеживание заказа №${orderId}`);
        });
    });
    
    const leaveReviewBtns = document.querySelectorAll('.leave-review');
    leaveReviewBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const orderId = this.closest('.order-item').querySelector('.order-header').getAttribute('data-order-id');
            
            // In a real implementation, this would open a review form
            alert(`Оставить отзыв о заказе №${orderId}`);
        });
    });
});