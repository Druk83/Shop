// Shopping cart functionality
let cart = [];
let cartCount = 0;

// Create loading indicator
function createLoadingIndicator() {
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.id = 'loadingIndicator';
    document.body.appendChild(loadingIndicator);
    return loadingIndicator;
}

// Show loading indicator
function showLoading() {
    let loadingIndicator = document.getElementById('loadingIndicator');
    if (!loadingIndicator) {
        loadingIndicator = createLoadingIndicator();
    }
    loadingIndicator.style.display = 'block';
}

// Hide loading indicator
function hideLoading() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
}

// Create modal
function createModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'confirmationModal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Подтверждение действия</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <p id="modalMessage">Вы уверены, что хотите выполнить это действие?</p>
            </div>
            <div class="modal-footer">
                <button class="modal-btn cancel">Отмена</button>
                <button class="modal-btn confirm">Подтвердить</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    modal.querySelector('.cancel').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    return modal;
}

// Show confirmation modal
function showConfirmationModal(message, onConfirm) {
    let modal = document.getElementById('confirmationModal');
    if (!modal) {
        modal = createModal();
    }
    
    document.getElementById('modalMessage').textContent = message;
    
    // Set up confirm button
    const confirmBtn = modal.querySelector('.confirm');
    // Clear previous event listeners
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    
    newConfirmBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        if (onConfirm) onConfirm();
    });
    
    modal.style.display = 'flex';
}

// Update cart display
function updateCartDisplay() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

// Add to cart function
function addToCart(productName, price) {
    cart.push({
        name: productName,
        price: price,
        quantity: 1
    });
    
    cartCount++;
    updateCartDisplay();
    
    // Show confirmation message
    alert(`Товар "${productName}" добавлен в корзину!`);
}

// Initialize event listeners when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent triggering parent click events
            
            // Get product information from the card
            const productCard = this.closest('.product-card');
            if (productCard) {
                const productName = productCard.querySelector('h3').textContent;
                const priceText = productCard.querySelector('.price').textContent;
                const price = parseFloat(priceText.replace(' ₽', '').replace(',', '.'));
                
                addToCart(productName, price);
            }
        });
    });
    
    // Initialize cart display
    updateCartDisplay();
    
    // Search functionality
    const searchButton = document.querySelector('.search-bar button');
    const searchInput = document.querySelector('.search-bar input');
    
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', function() {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                showLoading();
                setTimeout(() => {
                    alert(`Поиск по запросу: "${searchTerm}"`);
                    hideLoading();
                }, 500);
            }
        });
        
        // Allow search with Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });
    }
    
    // Category card click functionality
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        // Only add event listener if card doesn't already have onclick attribute
        if (!card.getAttribute('onclick')) {
            card.addEventListener('click', function() {
                const categoryName = this.querySelector('h3').textContent;
                showLoading();
                setTimeout(() => {
                    alert(`Переход в категорию: ${categoryName}`);
                    // In a real implementation, this would redirect to category page
                    window.location.href = 'catalog.html';
                    hideLoading();
                }, 500);
            });
        }
    });
    
    // CTA button functionality
    const ctaButton = document.querySelector('.cta-button');
    
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            showLoading();
            setTimeout(() => {
                // Navigate to catalog page
                window.location.href = 'catalog.html';
                hideLoading();
            }, 500);
        });
    }
    
    // Product page specific functionality
    const productDetailPage = document.querySelector('.product-detail');
    if (productDetailPage) {
        // Add to cart functionality for product page
        const addToCartButton = document.querySelector('.product-actions .add-to-cart');
        const quantityInput = document.getElementById('quantity');
        
        if (addToCartButton && quantityInput) {
            addToCartButton.addEventListener('click', function() {
                const productName = document.querySelector('.product-info h1').textContent;
                const priceText = document.querySelector('.price').textContent;
                const price = parseFloat(priceText.replace(' ₽', '').replace(',', '.'));
                const quantity = parseInt(quantityInput.value);
                
                showConfirmationModal(`Добавить в корзину: ${productName} (${quantity} шт.) на сумму ${price * quantity} ₽?`, () => {
                    // In a real implementation, this would add to actual cart
                    alert(`Добавлено в корзину: ${productName} (${quantity} шт.) на сумму ${price * quantity} ₽`);
                    
                    // Update cart count
                    cartCount += quantity;
                    updateCartDisplay();
                });
            });
        }
        
        // Buy now functionality
        const buyNowButton = document.querySelector('.buy-now');
        if (buyNowButton) {
            buyNowButton.addEventListener('click', function() {
                const productName = document.querySelector('.product-info h1').textContent;
                showConfirmationModal(`Оформить заказ: ${productName}?`, () => {
                    showLoading();
                    setTimeout(() => {
                        alert(`Оформление заказа: ${productName}`);
                        // In a real implementation, this would redirect to checkout
                        window.location.href = 'cart.html';
                        hideLoading();
                    }, 500);
                });
            });
        }
        
        // Image thumbnail selection
        const thumbnails = document.querySelectorAll('.thumbnail-images img');
        const mainImage = document.querySelector('.main-image img');
        
        if (thumbnails.length > 0 && mainImage) {
            thumbnails.forEach(thumbnail => {
                thumbnail.addEventListener('click', function() {
                    showLoading();
                    const src = this.src.replace('100x100', '400x400');
                    setTimeout(() => {
                        mainImage.src = src;
                        hideLoading();
                    }, 300);
                });
            });
        }
    }
    
    // Catalog page specific functionality
    const catalogPage = document.querySelector('.catalog');
    if (catalogPage) {
        // View options toggle
        const gridViewButton = document.getElementById('gridView');
        const listViewButton = document.getElementById('listView');
        
        if (gridViewButton && listViewButton) {
            gridViewButton.addEventListener('click', function() {
                showLoading();
                setTimeout(() => {
                    gridViewButton.classList.add('active');
                    listViewButton.classList.remove('active');
                    document.getElementById('productsContainer').style.display = 'grid';
                    document.getElementById('productsListContainer').style.display = 'none';
                    hideLoading();
                }, 300);
            });
            
            listViewButton.addEventListener('click', function() {
                showLoading();
                setTimeout(() => {
                    listViewButton.classList.add('active');
                    gridViewButton.classList.remove('active');
                    document.getElementById('productsContainer').style.display = 'none';
                    document.getElementById('productsListContainer').style.display = 'block';
                    hideLoading();
                }, 300);
            });
        }
        
        // Apply filter button
        const applyFilterButton = document.querySelector('.apply-filter');
        if (applyFilterButton) {
            applyFilterButton.addEventListener('click', function() {
                showLoading();
                setTimeout(() => {
                    alert('Фильтры применены');
                    // In a real implementation, this would filter the products
                    hideLoading();
                }, 500);
            });
        }
        
        // Sort options
        const sortSelect = document.getElementById('sort');
        if (sortSelect) {
            sortSelect.addEventListener('change', function() {
                showLoading();
                setTimeout(() => {
                    alert(`Сортировка изменена на: ${this.value}`);
                    // In a real implementation, this would re-sort the products
                    hideLoading();
                }, 500);
            });
        }
        
        // Add click event listeners to product cards for navigation
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.addEventListener('click', function(e) {
                // Prevent navigation if clicking on "Add to Cart" button
                if (e.target.classList.contains('add-to-cart')) {
                    return;
                }
                showLoading();
                // Get product name from the card
                const productName = this.querySelector('h3').textContent;
                // Navigate to product page
                setTimeout(() => {
                    window.location.href = `product.html?name=${encodeURIComponent(productName)}`;
                    hideLoading();
                }, 500);
            });
        });
        
        // Add click event listeners to product list items for navigation
        const productListItems = document.querySelectorAll('.product-list-item');
        productListItems.forEach(item => {
            item.addEventListener('click', function(e) {
                // Prevent navigation if clicking on "Add to Cart" button
                if (e.target.classList.contains('add-to-cart')) {
                    return;
                }
                showLoading();
                // Get product name from the item
                const productName = this.querySelector('h3').textContent;
                // Navigate to product page
                setTimeout(() => {
                    window.location.href = `product.html?name=${encodeURIComponent(productName)}`;
                    hideLoading();
                }, 500);
            });
        });
    }
    
    // Cart page specific functionality
    const cartPage = document.querySelector('.cart-page');
    if (cartPage) {
        // Quantity buttons functionality
        const minusButtons = document.querySelectorAll('.quantity-btn.minus');
        const plusButtons = document.querySelectorAll('.quantity-btn.plus');
        
        minusButtons.forEach(button => {
            button.addEventListener('click', function() {
                showLoading();
                setTimeout(() => {
                    const input = this.nextElementSibling;
                    let value = parseInt(input.value);
                    if (value > 1) {
                        input.value = value - 1;
                        updateItemTotal(this.closest('.cart-item'));
                    }
                    hideLoading();
                }, 300);
            });
        });
        
        plusButtons.forEach(button => {
            button.addEventListener('click', function() {
                showLoading();
                setTimeout(() => {
                    const input = this.previousElementSibling;
                    let value = parseInt(input.value);
                    input.value = value + 1;
                    updateItemTotal(this.closest('.cart-item'));
                    hideLoading();
                }, 300);
            });
        });
        
        // Quantity input change
        const quantityInputs = document.querySelectorAll('.item-quantity input');
        quantityInputs.forEach(input => {
            input.addEventListener('change', function() {
                showLoading();
                setTimeout(() => {
                    if (this.value < 1) this.value = 1;
                    updateItemTotal(this.closest('.cart-item'));
                    hideLoading();
                }, 300);
            });
        });
        
        // Remove item buttons
        const removeButtons = document.querySelectorAll('.remove-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const item = this.closest('.cart-item');
                const productName = item.querySelector('h3').textContent;
                showConfirmationModal(`Удалить товар "${productName}" из корзины?`, () => {
                    showLoading();
                    setTimeout(() => {
                        item.remove();
                        updateCartSummary();
                        
                        // Update cart count
                        cartCount--;
                        updateCartDisplay();
                        hideLoading();
                    }, 300);
                });
            });
        });
        
        // Continue shopping button
        const continueShoppingButton = document.querySelector('.continue-shopping');
        if (continueShoppingButton) {
            continueShoppingButton.addEventListener('click', function() {
                showLoading();
                setTimeout(() => {
                    window.location.href = 'catalog.html';
                    hideLoading();
                }, 500);
            });
        }
        
        // Checkout button
        const checkoutButton = document.querySelector('.checkout-btn');
        if (checkoutButton) {
            checkoutButton.addEventListener('click', function() {
                showConfirmationModal('Перейти к оформлению заказа?', () => {
                    showLoading();
                    setTimeout(() => {
                        alert('Переход к оформлению заказа');
                        // In a real implementation, this would redirect to checkout page
                        hideLoading();
                    }, 500);
                });
            });
        }
        
        // Apply promo code
        const applyPromoButton = document.querySelector('.promo-input button');
        if (applyPromoButton) {
            applyPromoButton.addEventListener('click', function() {
                const promoInput = document.querySelector('.promo-input input');
                if (promoInput.value.trim()) {
                    showLoading();
                    setTimeout(() => {
                        alert(`Промокод "${promoInput.value}" применен!`);
                        // In a real implementation, this would apply the discount
                        hideLoading();
                    }, 500);
                } else {
                    alert('Введите промокод');
                }
            });
        }
        
        // Function to update item total
        function updateItemTotal(itemElement) {
            const priceText = itemElement.querySelector('.item-price .price').textContent;
            const price = parseFloat(priceText.replace(' ₽', '').replace(',', '.'));
            const quantity = parseInt(itemElement.querySelector('.item-quantity input').value);
            const total = price * quantity;
            
            itemElement.querySelector('.item-total .total').textContent = total.toFixed(2) + ' ₽';
            updateCartSummary();
        }
        
        // Function to update cart summary
        function updateCartSummary() {
            let subtotal = 0;
            const items = document.querySelectorAll('.cart-item');
            
            items.forEach(item => {
                const totalText = item.querySelector('.item-total .total').textContent;
                const total = parseFloat(totalText.replace(' ₽', '').replace(',', '.'));
                subtotal += total;
            });
            
            // Apply discount if applicable (for demo purposes)
            const discount = 50.00;
            const total = subtotal - discount;
            
            if (document.querySelector('.summary-row:nth-child(2) span:last-child')) {
                document.querySelector('.summary-row:nth-child(2) span:last-child').textContent = '-' + discount.toFixed(2) + ' ₽';
            }
            
            if (document.querySelector('.summary-row.total .total-amount')) {
                document.querySelector('.summary-row.total .total-amount').textContent = total.toFixed(2) + ' ₽';
            }
        }
    }
    
    // Breadcrumb navigation
    const breadcrumbs = document.querySelectorAll('.breadcrumb a');
    breadcrumbs.forEach(breadcrumb => {
        breadcrumb.addEventListener('click', function(e) {
            showLoading();
            // In a real implementation, this would navigate to the appropriate page
            // For now, we'll just prevent the default behavior for demo purposes
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                setTimeout(() => {
                    alert(`Переход к: ${this.textContent}`);
                    hideLoading();
                }, 500);
            } else {
                setTimeout(() => {
                    hideLoading();
                }, 500);
            }
        });
    });
    
    // Add loading indicator to all navigation links
    const allLinks = document.querySelectorAll('a[href]');
    allLinks.forEach(link => {
        if (!link.classList.contains('add-to-cart') && 
            !link.classList.contains('remove-btn') && 
            !link.classList.contains('close-modal') &&
            !link.classList.contains('modal-btn')) {
            link.addEventListener('click', function() {
                if (this.getAttribute('href') !== '#' && 
                    !this.getAttribute('href').startsWith('javascript:')) {
                    showLoading();
                }
            });
        }
    });
    
    // Product reviews functionality
    if (productDetailPage) {
        // Add review button functionality
        const addReviewBtn = document.querySelector('.add-review-btn');
        const addReviewForm = document.getElementById('addReviewForm');
        const cancelReviewBtn = document.querySelector('.cancel-review-btn');
        const reviewForm = document.getElementById('reviewForm');
        
        if (addReviewBtn && addReviewForm) {
            addReviewBtn.addEventListener('click', function() {
                addReviewForm.style.display = 'block';
                // Scroll to the form
                addReviewForm.scrollIntoView({ behavior: 'smooth' });
            });
        }
        
        if (cancelReviewBtn) {
            cancelReviewBtn.addEventListener('click', function() {
                if (addReviewForm) {
                    addReviewForm.style.display = 'none';
                }
            });
        }
        
        if (reviewForm) {
            reviewForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form values
                const reviewerName = document.getElementById('reviewerName').value;
                const rating = document.querySelector('input[name="rating"]:checked');
                const reviewTitle = document.getElementById('reviewTitle').value;
                const reviewText = document.getElementById('reviewText').value;
                const reviewPros = document.getElementById('reviewPros').value;
                const reviewCons = document.getElementById('reviewCons').value;
                
                // Validate form
                if (!reviewerName || !rating || !reviewTitle || !reviewText) {
                    alert('Пожалуйста, заполните все обязательные поля');
                    return;
                }
                
                // In a real implementation, this would send the review to a server
                showLoading();
                setTimeout(() => {
                    alert(`Спасибо за ваш отзыв, ${reviewerName}!`);
                    hideLoading();
                    
                    // Reset form and hide it
                    reviewForm.reset();
                    if (addReviewForm) {
                        addReviewForm.style.display = 'none';
                    }
                    
                    // In a real implementation, this would add the review to the list
                }, 500);
            });
        }
    }
});