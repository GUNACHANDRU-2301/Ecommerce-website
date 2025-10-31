// CartNow Application - Complete Implementation
const CartNowApp = {
    // Initialize the application
    init: function() {
        this.setupCart();
        this.setupWishlist();
        this.setupEventListeners();
        this.setupSearch();
        this.setupCategoryNavigation();
        this.updateCartCount();
        this.updateWishlistCount();
        this.loadMoreProducts();
        
        // Back to Home functionality (merged from duplicate listener)
        const backToHomeBtn = document.getElementById('back-to-home');
        const checkoutPage = document.getElementById('checkout-page');
        if (backToHomeBtn) {
            backToHomeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideCheckoutPage();
            });
        }
        
        console.log('CartNow App initialized successfully');
    },
    
    // Setup shopping cart functionality
    setupCart: function() {
        this.cart = JSON.parse(localStorage.getItem('cartNowCart')) || [];
    },

    // Setup wishlist functionality
    setupWishlist: function() {
        this.wishlist = JSON.parse(localStorage.getItem('cartNowWishlist')) || [];
        this.updateWishlistIcons();
    },
    

    // Complete product database
    products: [
        {
            id: 1, name: 'Quantum X Pro Smartphone', category: 'smartphones', price: 899, originalPrice: 999,
            rating: 4.5, reviews: 1204, tags: ['new'], inStock: true,
            image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: 2, name: 'NovaBook Pro Laptop', category: 'laptops', price: 1299, originalPrice: 1499,
            rating: 5.0, reviews: 876, tags: ['popular'], inStock: true,
            image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: 3, name: 'AudioMax Pro Headphones', category: 'audio', price: 249, originalPrice: 299,
            rating: 4.0, reviews: 2543, tags: ['popular'], inStock: true,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: 4, name: 'FitTrack Pro Smartwatch', category: 'wearables', price: 199, originalPrice: 249,
            rating: 4.5, reviews: 934, tags: ['new'], inStock: true,
            image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: 5, name: 'GameMaster Pro Controller', category: 'gaming', price: 79, originalPrice: 119,
            rating: 5.0, reviews: 1567, tags: ['deals'], inStock: true,
            image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: 6, name: 'PixelPro 4K Action Camera', category: 'cameras', price: 299, originalPrice: 399,
            rating: 4.5, reviews: 789, tags: ['new'], inStock: true,
            image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        }
    ],
    
    // Setup event listeners
    setupEventListeners: function() {
        this.setupCartEvents();
        this.setupSearchEvents();
        this.setupProductEvents();
        this.setupNavigationEvents();
        this.setupUIEvents();
        this.setupNewsletterEvents();
        this.setupFooterEvents();
        this.setupCheckoutEvents();
        this.setupCategoryDropdown();
    },

    setupCategoryDropdown: function() {
        const categoryBtn = document.querySelector('.category-btn');
        const categoryMenu = document.querySelector('.category-menu');
        
        if (categoryBtn && categoryMenu) {
            categoryBtn.addEventListener('click', (e) => {
                e.preventDefault();
                categoryMenu.classList.toggle('active');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!categoryBtn.contains(e.target) && !categoryMenu.contains(e.target)) {
                    categoryMenu.classList.remove('active');
                }
            });
        }
    },

    setupCartEvents: function() {
        const cartIcon = document.getElementById('cart-icon');
        const closeCart = document.getElementById('close-cart');
        const cartSidebar = document.getElementById('cart-sidebar');
        const checkoutBtn = document.getElementById('checkout-btn');
        
        if (cartIcon) {
            cartIcon.addEventListener('click', (e) => {
                e.preventDefault();
                cartSidebar.classList.add('active');
                this.updateCartDisplay();
            });
        }
        
        if (closeCart) {
            closeCart.addEventListener('click', () => {
                cartSidebar.classList.remove('active');
            });
        }

        document.addEventListener('click', (e) => {
            if (cartSidebar && !cartSidebar.contains(e.target) && cartIcon && !cartIcon.contains(e.target)) {
                cartSidebar.classList.remove('active');
            }
        });
        
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.handleCheckout();
            });
        }
    },

    setupCheckoutEvents: function() {
        const placeOrderBtn = document.getElementById('place-order-btn');
        const backToHomeBtn = document.getElementById('back-to-home-btn');
        const checkoutLogo = document.getElementById('checkout-logo');

        // Place order button in checkout page
        if (placeOrderBtn) {
            placeOrderBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handlePlaceOrder();
            });
        }

        // Back to home button (merged, but kept for checkout modal)
        if (backToHomeBtn) {
            backToHomeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideCheckoutPage();
            });
        }

        // Checkout logo click
        if (checkoutLogo) {
            checkoutLogo.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideCheckoutPage();
            });
        }

        // Payment method selection
        const paymentOptions = document.querySelectorAll('.payment-option input');
        paymentOptions.forEach(option => {
            option.addEventListener('change', (e) => {
                document.querySelectorAll('.payment-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                e.target.closest('.payment-option').classList.add('selected');
            });
        });
    },

    handleCheckout: function() {
        if (this.cart.length === 0) {
            this.showToast('Your cart is empty!', 'error');
            return;
        }

        // Hide main content sections (more precise than 'main')
        document.querySelectorAll('header, .hero, .categories, .products, .newsletter, footer').forEach(el => {
            if (el) el.style.display = 'none';
        });
        
        const cartSidebar = document.getElementById('cart-sidebar');
        if (cartSidebar) cartSidebar.classList.remove('active');
        
        const checkoutPage = document.getElementById('checkout-page');
        if (checkoutPage) checkoutPage.style.display = 'block';
        
        window.scrollTo(0, 0);
        this.updateCheckoutSummary();
    },

    handlePlaceOrder: function() {
        const requiredFields = document.querySelectorAll('#address-form [required]');
        let allValid = true;

        requiredFields.forEach(field => {
            const isValid = field.value.trim() !== '';
            if (!isValid) {
                allValid = false;
                field.style.borderColor = 'red';
            } else {
                field.style.borderColor = '#ccc';
            }
        });

        if (allValid) {
            const checkoutPage = document.getElementById('checkout-page');
            if (checkoutPage) checkoutPage.style.display = 'none';
            
            const orderConfirmationModal = document.getElementById('order-confirmation-modal');
            if (orderConfirmationModal) orderConfirmationModal.style.display = 'flex';
            
            // Clear cart after successful order
            this.cart = [];
            this.saveCart();
            this.updateCartCount();
            this.updateCartDisplay();
            
            this.showToast('Order placed successfully!');
        } else {
            this.showToast('Please fill in all required address fields.', 'error');
        }
    },

    hideCheckoutPage: function() {
        const checkoutPage = document.getElementById('checkout-page');
        const orderConfirmationModal = document.getElementById('order-confirmation-modal');
        
        if (checkoutPage) checkoutPage.style.display = 'none';
        if (orderConfirmationModal) orderConfirmationModal.style.display = 'none';
        
        // Show main content sections
        document.querySelectorAll('header, .hero, .categories, .products, .newsletter, footer').forEach(el => {
            if (el) el.style.display = 'block';
        });
        
        // Re-enable body scrolling if needed
        document.body.style.overflow = 'auto';
        window.scrollTo(0, 0);
    },

    updateCheckoutSummary: function() {
        const summaryItemsContainer = document.getElementById('summary-items');
        const summarySubtotalEl = document.getElementById('summary-subtotal');
        const summaryTotalEl = document.getElementById('summary-total');

        if (!summaryItemsContainer) {
            console.warn('Summary container not found');
            return;
        }

        summaryItemsContainer.innerHTML = '';
        
        if (this.cart.length === 0) {
            summaryItemsContainer.innerHTML = '<p>No items in cart</p>';
            if (summarySubtotalEl) summarySubtotalEl.textContent = '$0.00';
            if (summaryTotalEl) summaryTotalEl.textContent = '$0.00';
            return;
        }
        
        this.cart.forEach(item => {
            const summaryItemEl = document.createElement('div');
            summaryItemEl.classList.add('summary-item');
            summaryItemEl.innerHTML = `
                <div class="summary-item-img">
                    <img src="${item.image}" alt="${item.product}" onerror="this.src='https://via.placeholder.com/60x60?text=No+Image'; this.alt='No Image';">
                </div>
                <div class="summary-item-details">
                    <h4>${item.product}</h4>
                    <p>Qty: ${item.quantity}</p>
                </div>
                <div class="summary-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            `;
            summaryItemsContainer.appendChild(summaryItemEl);
        });

        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        if (summarySubtotalEl) summarySubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        if (summaryTotalEl) summaryTotalEl.textContent = `$${subtotal.toFixed(2)}`;
    },

    setupSearchEvents: function() {
        const searchInput = document.getElementById('search-input');
        const searchButton = document.getElementById('search-button');
        const searchResults = document.getElementById('search-results');
        
        if (searchButton) {
            searchButton.addEventListener('click', () => {
                this.performSearch(searchInput.value);
            });
        }
        
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(searchInput.value);
                }
            });

            searchInput.addEventListener('input', (e) => {
                const query = e.target.value;
                if (query.length > 2) {
                    this.performSearch(query);
                } else if (query.length === 0) {
                    searchResults.classList.remove('active');
                }
            });
            
            searchInput.addEventListener('focus', () => {
                if (searchInput.value.length > 2) {
                    searchResults.classList.add('active');
                }
            });
        }
        
        document.addEventListener('click', (e) => {
            if (searchInput && !searchInput.contains(e.target) && searchResults && !searchResults.contains(e.target)) {
                searchResults.classList.remove('active');
            }
        });
    },

    setupProductEvents: function() {
        document.addEventListener('click', (e) => {
            // Add to cart
            if (e.target.classList.contains('add-cart')) {
                const product = e.target.getAttribute('data-product');
                const price = parseFloat(e.target.getAttribute('data-price'));
                const id = parseInt(e.target.getAttribute('data-id'));
                const image = e.target.getAttribute('data-image');
                
                this.addToCart({ id, product, price, image });
                
                const originalText = e.target.textContent;
                e.target.textContent = 'Added!';
                e.target.style.background = 'var(--success)';
                setTimeout(() => {
                    e.target.textContent = originalText;
                    e.target.style.background = '';
                }, 1000);
                
                this.showToast(`${product} added to cart!`);
            }

            // Buy now - FIXED
            if (e.target.classList.contains('buy-now')) {
                const product = e.target.getAttribute('data-product');
                const price = parseFloat(e.target.getAttribute('data-price'));
                const id = parseInt(e.target.getAttribute('data-id'));
                const image = e.target.getAttribute('data-image');
                
                // Clear cart and add only this product
                this.cart = [{ id, product, price, image, quantity: 1 }];
                this.saveCart();
                this.updateCartCount();
                this.handleCheckout();
                
                this.showToast(`Proceeding to checkout with ${product}`);
            }

            // Wishlist icon - FIXED
            if (e.target.closest('.wishlist-icon')) {
                const button = e.target.closest('.wishlist-icon');
                const productId = parseInt(button.getAttribute('data-product-id'));
                const product = this.products.find(p => p.id === productId);
                
                if (product) {
                    this.toggleWishlist(productId);
                    
                    if (this.wishlist.some(p => p.id === productId)) {
                        this.showToast(`${product.name} added to wishlist!`);
                    } else {
                        this.showToast(`${product.name} removed from wishlist`);
                    }
                }
            }
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                const filter = e.target.getAttribute('data-filter');
                this.filterProducts(filter);
            });
        });
    },

    setupNavigationEvents: function() {
        const heroShopNow = document.getElementById('hero-shop-now');
        const heroLearnMore = document.getElementById('hero-learn-more');
        const wishlistAction = document.getElementById('wishlist-action');
        const accountAction = document.getElementById('account-action');

        if (heroShopNow) {
            heroShopNow.addEventListener('click', (e) => {
                e.preventDefault();
                const productsSection = document.querySelector('.products');
                if (productsSection) {
                    productsSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        if (heroLearnMore) {
            heroLearnMore.addEventListener('click', (e) => {
                e.preventDefault();
                this.showModal('About CartNow', 'CartNow is your premier destination for cutting-edge electronics and innovative tech solutions. We bring you the latest gadgets, smartphones, laptops, and smart home devices from top brands at competitive prices.');
            });
        }

        if (accountAction) {
            accountAction.addEventListener('click', (e) => {
                e.preventDefault();
                this.showModal('Account', 'Welcome to your CartNow account! Sign in or create an account to track orders, save favorites, and get personalized recommendations.');
            });
        }

        this.setupCategoryNavigation();

        // Wishlist header button - FIXED
        if (wishlistAction) {
            wishlistAction.addEventListener('click', (e) => {
                e.preventDefault();
                this.showWishlist();
            });
        }
    },

    setupUIEvents: function() {
        const modalClose = document.getElementById('modal-close');
        const modalOverlay = document.getElementById('modal-overlay');

        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.hideModal();
            });
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target.id === 'modal-overlay') {
                    this.hideModal();
                }
            });
        }
    },

    setupNewsletterEvents: function() {
        const newsletterForm = document.getElementById('newsletter-form');
        
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const emailInput = e.target.querySelector('input[type="email"]');
                const email = emailInput.value;
                
                if (this.isValidEmail(email)) {
                    this.showToast('Successfully subscribed to newsletter!');
                    e.target.reset();
                } else {
                    this.showToast('Please enter a valid email address', 'error');
                }
            });
        }
    },

    setupFooterEvents: function() {
        const contactUs = document.getElementById('contact-us');
        const faqs = document.getElementById('faqs');
        const shippingInfo = document.getElementById('shipping-info');
        const returns = document.getElementById('returns');
        const warranty = document.getElementById('warranty');
        const trackOrder = document.getElementById('track-order');
        const privacyPolicy = document.getElementById('privacy-policy');
        const termsOfService = document.getElementById('terms-of-service');
        
        const footerLinks = [
            { element: contactUs, title: 'Contact Us', message: 'Get in touch with our support team:<br><br>📞 Phone: +919790341153<br>📧 Email: support@cartnow.com<br>📍 Address: Sulur, Coimbatore' },
            { element: faqs, title: 'FAQs', message: 'Frequently Asked Questions:<br><br>❓ How long does shipping take?<br> - Typically 3-5 business days<br><br>❓ What is your return policy?<br> - 45-day hassle-free returns<br><br>❓ Do you offer international shipping?<br> - Currently shipping within India only' },
            { element: shippingInfo, title: 'Shipping Information', message: 'Shipping Details:<br><br>🚚 Free shipping on orders over $75<br>📦 Standard shipping: 3-5 business days<br>⚡ Express shipping: 1-2 business days<br>📬 Free returns within 45 days' },
            { element: returns, title: 'Returns & Exchanges', message: 'Return Policy:<br><br>↩️ 45-day return period<br>📦 Free return shipping<br>💵 Full refund guaranteed<br>🔄 Easy exchange process' },
            { element: warranty, title: 'Warranty', message: 'Warranty Information:<br><br>🔧 1-year manufacturer warranty<br>📞 Extended warranty options available<br>🔧 Professional repair services<br>✅ Genuine parts guarantee' },
            { element: trackOrder, title: 'Track Your Order', message: 'Track Your Package:<br><br>📱 Use our mobile app<br>📧 Check your email for tracking number<br>🔍 Enter order number on our website<br>📞 Contact support for assistance' },
            { element: privacyPolicy, title: 'Privacy Policy', message: 'Your privacy is important to us. We protect your personal information and never share it with third parties without your consent.' },
            { element: termsOfService, title: 'Terms of Service', message: 'By using CartNow, you agree to our terms of service, including our return policy, shipping terms, and product warranties.' }
        ];

        footerLinks.forEach(link => {
            if (link.element) {
                link.element.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showModal(link.title, link.message);
                });
            }
        });

        // Social media links
        document.querySelectorAll('.social-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const platform = link.getAttribute('data-social');
                this.showModal(`${platform.charAt(0).toUpperCase() + platform.slice(1)}`, `Follow us on ${platform} for the latest updates and exclusive deals!`);
            });
        });
    },

    performSearch: function(query) {
        const searchResults = document.getElementById('search-results');
        if (!searchResults) return;
        
        if (!query.trim()) {
            searchResults.innerHTML = '<h3>Please enter a search term</h3>';
            searchResults.classList.add('active');
            return;
        }
        
        const results = this.products.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase()) ||
            item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
        
        if (results.length > 0) {
            let resultsHTML = `<h3>Search Results (${results.length})</h3>`;
            results.forEach(item => {
                const discount = Math.round((1 - item.price / item.originalPrice) * 100);
                resultsHTML += `
                    <div class="search-result-item" data-product-id="${item.id}">
                        <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/50x50?text=No+Image';">
                        <div class="search-result-info">
                            <h4>${item.name}</h4>
                            <p>$${item.price} • ${item.category} • ${discount}% off</p>
                        </div>
                    </div>`;
            });
            searchResults.innerHTML = resultsHTML;

            searchResults.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    const productId = parseInt(item.getAttribute('data-product-id'));
                    const product = this.products.find(p => p.id === productId);
                    this.addToCart({ id: product.id, product: product.name, price: product.price, image: product.image });
                    searchResults.classList.remove('active');
                    const searchInput = document.getElementById('search-input');
                    if (searchInput) searchInput.value = '';
                    this.showToast(`${product.name} added to cart!`);
                });
            });
        } else {
            searchResults.innerHTML = '<h3>No results found</h3><p>Try different keywords or browse our categories</p>';
        }
        searchResults.classList.add('active');
    },

    setupCategoryNavigation: function() {
        document.querySelectorAll('.category-card, .category-menu a, .category-explore, .footer-column a[data-category]').forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                const category = element.getAttribute('data-category');
                if (category) {
                    this.filterByCategory(category);
                    // Close category dropdown if open
                    const categoryMenu = document.querySelector('.category-menu');
                    if (categoryMenu) categoryMenu.classList.remove('active');
                }
            });
        });
    },

    filterByCategory: function(category) {
        const products = document.querySelectorAll('.product-card');
        let hasMatches = false;
        
        products.forEach(product => {
            if (product.getAttribute('data-category') === category) {
                product.style.display = 'block';
                hasMatches = true;
            } else {
                product.style.display = 'none';
            }
        });
        
        if (!hasMatches) {
            this.showToast(`No products found in ${category}. Showing all products.`, 'error');
            products.forEach(product => product.style.display = 'block');
        } else {
            this.showToast(`Showing ${category} products`);
            // Reset filter buttons
            document.querySelectorAll('.filter-btn').forEach(btn => {
                if (btn.getAttribute('data-filter') === 'all') {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }
        
        const productsSection = document.querySelector('.products');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    },

    filterProducts: function(filter) {
        const products = document.querySelectorAll('.product-card');
        let visibleCount = 0;
        
        products.forEach(product => {
            const tags = product.getAttribute('data-tags') || '';
            if (filter === 'all' || tags.includes(filter)) {
                product.style.display = 'block';
                visibleCount++;
            } else {
                product.style.display = 'none';
            }
        });
        
        this.showToast(`Showing ${visibleCount} products`);
    },

    addToCart: function(item) {
        const existingItem = this.cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ ...item, quantity: 1 });
        }
        this.saveCart();
        this.updateCartCount();
        this.updateCartDisplay();
    },

    saveCart: function() {
        localStorage.setItem('cartNowCart', JSON.stringify(this.cart));
    },

    clearCart: function() {
        this.cart = [];
        this.saveCart();
        this.updateCartCount();
        this.updateCartDisplay();
    },

    updateCartCount: function() {
        const cartBadge = document.querySelector('#cart-icon .cart-badge');
        if (!cartBadge) return;
        
        const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    },

    updateCartDisplay: function() {
        const cartItems = document.getElementById('cart-items');
        const cartSubtotal = document.getElementById('cart-subtotal');
        const cartShipping = document.getElementById('cart-shipping');
        const cartTax = document.getElementById('cart-tax');
        const cartTotal = document.getElementById('cart-total');

        if (!cartItems) {
            console.warn('Cart items container not found');
            return;
        }

        cartItems.innerHTML = '';
        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Your cart is empty</h3>
                    <p>Add some products to get started!</p>
                </div>`;
            if (cartSubtotal) cartSubtotal.textContent = '$0.00';
            if (cartShipping) cartShipping.textContent = '$0.00';
            if (cartTax) cartTax.textContent = '$0.00';
            if (cartTotal) cartTotal.textContent = '$0.00';
            return;
        }

        let subtotal = 0;
        this.cart.forEach((item, index) => {
            subtotal += item.price * item.quantity;
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.product}" onerror="this.src='https://via.placeholder.com/80x80?text=No+Image'; this.alt='No Image';">
                </div>
                <div class="cart-item-details">
                    <h4>${item.product}</h4>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-index="${index}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus" data-index="${index}">+</button>
                    </div>
                    <button class="remove-item" data-index="${index}">Remove</button>
                </div>`;
            cartItems.appendChild(cartItem);
        });

        const shipping = subtotal > 0 ? (subtotal > 75 ? 0 : 5.99) : 0;
        const tax = subtotal * 0.08;
        const total = subtotal + shipping + tax;
        
        if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        if (cartShipping) cartShipping.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
        if (cartTax) cartTax.textContent = `$${tax.toFixed(2)}`;
        if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;

        this.setupCartItemEvents();
    },

    setupCartItemEvents: function() {
        document.querySelectorAll('.quantity-btn.plus').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                this.cart[index].quantity += 1;
                this.saveCart();
                this.updateCartDisplay();
                this.updateCartCount();
            });
        });

        document.querySelectorAll('.quantity-btn.minus').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                if (this.cart[index].quantity > 1) {
                    this.cart[index].quantity -= 1;
                } else {
                    // Prevent negative, remove if 1
                    const removedItem = this.cart[index];
                    this.cart.splice(index, 1);
                    this.showToast(`${removedItem.product} removed from cart`);
                }
                this.saveCart();
                this.updateCartDisplay();
                this.updateCartCount();
            });
        });

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                const removedItem = this.cart[index];
                this.cart.splice(index, 1);
                this.saveCart();
                this.updateCartDisplay();
                this.updateCartCount();
                this.showToast(`${removedItem.product} removed from cart`);
            });
        });
    },

    // Wishlist - FIXED
    toggleWishlist: function(productId) {
        const product = this.products.find(p => p.id === productId);
        const existingIndex = this.wishlist.findIndex(item => item.id === productId);

        if (existingIndex > -1) {
            this.wishlist.splice(existingIndex, 1);
        } else {
            this.wishlist.push(product);
        }

        this.saveWishlist();
        this.updateWishlistCount();
        this.updateWishlistIcons();
    },

    saveWishlist: function() {
        localStorage.setItem('cartNowWishlist', JSON.stringify(this.wishlist));
    },

    updateWishlistCount: function() {
        const wishlistBadge = document.getElementById('wishlist-count');
        if (!wishlistBadge) return;
        
        wishlistBadge.textContent = this.wishlist.length;
        wishlistBadge.style.display = this.wishlist.length > 0 ? 'flex' : 'none';
    },

    updateWishlistIcons: function() {
        document.querySelectorAll('.wishlist-icon').forEach(icon => {
            const productId = parseInt(icon.getAttribute('data-product-id'));
            const isInWishlist = this.wishlist.some(item => item.id === productId);
            if (isInWishlist) {
                icon.classList.add('active');
                icon.innerHTML = '<i class="fas fa-heart"></i>';
            } else {
                icon.classList.remove('active');
                icon.innerHTML = '<i class="far fa-heart"></i>';
            }
        });
    },

    showWishlist: function() {
        if (this.wishlist.length === 0) {
            this.showModal('Wishlist', 'Your wishlist is empty. Start adding products you love!');
            return;
        }

        let wishlistHTML = '<div class="wishlist-container"><ul class="wishlist-list">';
        this.wishlist.forEach(item => {
            wishlistHTML += `
                <li class="wishlist-item">
                    <img src="${item.image}" alt="${item.name}" width="50" height="50" style="object-fit: cover; border-radius: 4px;" onerror="this.src='https://via.placeholder.com/50x50?text=No+Image';">
                    <div class="wishlist-item-details">
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)}</p>
                    </div>
                    <button class="add-cart-from-wishlist" 
                            data-id="${item.id}" 
                            data-product="${item.name}" 
                            data-price="${item.price}" 
                            data-image="${item.image}">
                        Add to Cart
                    </button>
                </li>`;
        });
        wishlistHTML += '</ul></div>';

        this.showModal('Your Wishlist', wishlistHTML);

        // Add event listeners to wishlist items
        setTimeout(() => {
            document.querySelectorAll('.add-cart-from-wishlist').forEach(button => {
                button.addEventListener('click', (e) => {
                    const product = e.target.getAttribute('data-product');
                    const price = parseFloat(e.target.getAttribute('data-price'));
                    const id = parseInt(e.target.getAttribute('data-id'));
                    const image = e.target.getAttribute('data-image');
                    
                    this.addToCart({ id, product, price, image });
                    this.showToast(`${product} added to cart!`);
                    this.hideModal();
                });
            });
        }, 100);
    },

    showModal: function(title, message) {
        const modalTitle = document.getElementById('modal-title');
        const modalMessage = document.getElementById('modal-message');
        const modalOverlay = document.getElementById('modal-overlay');
        
        if (modalTitle) modalTitle.textContent = title;
        if (modalMessage) modalMessage.innerHTML = message;
        if (modalOverlay) modalOverlay.classList.add('active');
    },

    hideModal: function() {
        const modalOverlay = document.getElementById('modal-overlay');
        if (modalOverlay) modalOverlay.classList.remove('active');
    },

    showToast: function(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        
        if (!toast || !toastMessage) {
            console.log('Toast elements not found');
            return;
        }
        
        toastMessage.textContent = message;
        toast.style.background = type === 'error' ? '#e74c3c' : '#27ae60';
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    },

    isValidEmail: function(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    loadMoreProducts: function() {
        // Simulate loading more products
        setTimeout(() => {
            console.log('Additional products loaded');
        }, 1000);
    }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    CartNowApp.init();
});

// Add some CSS for the category dropdown (your existing style block remains the same)
const style = document.createElement('style');
style.textContent = `
    .category-menu {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        background: white;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        border-radius: 8px;
        padding: 1rem;
        min-width: 200px;
        z-index: 1000;
    }
    
    .category-menu.active {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
    }
    
    .category-menu a {
        padding: 0.5rem 1rem;
        border-radius: 4px;
        transition: background-color 0.2s;
    }
    
    .category-menu a:hover {
        background-color: #f8f9fa;
    }
    
    .payment-option.selected {
        background-color: #f8f9fa;
        border-color: #007bff;
    }
    
    .wishlist-container {
        max-height: 400px;
        overflow-y: auto;
    }
    
    .wishlist-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border-bottom: 1px solid #eee;
    }
    
    .wishlist-item:last-child {
        border-bottom: none;
    }
    
    .wishlist-item-details {
        flex: 1;
    }
    
    .wishlist-item-details h4 {
        margin: 0 0 0.25rem 0;
        font-size: 1rem;
    }
    
    .wishlist-item-details p {
        margin: 0;
        color: #27ae60;
        font-weight: bold;
    }
    
    .add-cart-from-wishlist {
        background: #007bff;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
    }
    
    .add-cart-from-wishlist:hover {
        background: #0056b3;
    }
    
    .search-result-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem;
        cursor: pointer;
        border-bottom: 1px solid #eee;
    }
    
    .search-result-item:hover {
        background-color: #f8f9fa;
    }
    
    .search-result-item img {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 4px;
    }
    
    .search-result-info h4 {
        margin: 0 0 0.25rem 0;
        font-size: 0.9rem;
    }
    
    .search-result-info p {
        margin: 0;
        font-size: 0.8rem;
        color: #666;
    }
`;
document.head.appendChild(style);

// ===============================
// FIXED BACK TO HOME BUTTON HANDLER
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const backToHome = document.getElementById("back-to-home");

  if (backToHome) {
    backToHome.addEventListener("click", (e) => {
      e.preventDefault();

      // Hide checkout section
      const checkoutPage = document.getElementById("checkout-page");
      if (checkoutPage) checkoutPage.style.display = "none";

      // Show main site sections again
      document.querySelectorAll("header, .hero, .categories, .products, .newsletter, footer")
        .forEach((section) => {
          if (section) section.style.display = "block";
        });

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Show a quick message
      if (typeof CartNowApp !== "undefined") {
        CartNowApp.showToast("Back to Home");
      }

      console.log("Navigated back to Home successfully");
    });
  }
});


// Checkout Form Validation
// ✅ CartNow - Flipkart-style Professional Validation
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkoutForm");
  if (!form) return;

  const showError = (input, message) => {
    const errorMsg = input.parentElement.querySelector(".error-msg");
    input.classList.add("invalid");
    input.classList.remove("valid");
    errorMsg.textContent = message;
  };

  const clearError = (input) => {
    const errorMsg = input.parentElement.querySelector(".error-msg");
    input.classList.remove("invalid");
    input.classList.add("valid");
    errorMsg.textContent = "";
  };

  // 💡 Validation Rules
  const validators = {
    fullname: (val) =>
      /^[A-Za-z\s]{3,30}$/.test(val)
        ? true
        : "Enter a valid name (letters only, 3–30 chars)",
    phone: (val) =>
      /^[6-9]\d{9}$/.test(val)
        ? true
        : "Enter a valid 10-digit mobile number",
    pincode: (val) =>
      /^\d{6}$/.test(val)
        ? true
        : "Enter a valid 6-digit pincode",
    city: (val) =>
      /^[A-Za-z\s]{2,30}$/.test(val)
        ? true
        : "Enter a valid city name (letters only)",
    address: (val) =>
      val.trim().length >= 5 && val.trim().length <= 100
        ? true
        : "Enter a valid address (5–100 chars)",
  };

  // 🔹 Real-time character restriction
  const nameInput = form.querySelector("#fullname");
  const phoneInput = form.querySelector("#phone");
  const pinInput = form.querySelector("#pincode");

  // Name → only letters & spaces
  nameInput.addEventListener("input", () => {
    nameInput.value = nameInput.value.replace(/[^A-Za-z\s]/g, "").slice(0, 30);
  });

  // Phone → only digits
  phoneInput.addEventListener("input", () => {
    phoneInput.value = phoneInput.value.replace(/[^0-9]/g, "").slice(0, 10);
  });

  // Pincode → only digits
  pinInput.addEventListener("input", () => {
    pinInput.value = pinInput.value.replace(/[^0-9]/g, "").slice(0, 6);
  });

  // 🔹 Real-time validation
  form.querySelectorAll("input[required], textarea[required]").forEach((input) => {
    input.addEventListener("input", () => {
      const rule = validators[input.name];
      if (rule) {
        const check = rule(input.value.trim());
        if (check === true) clearError(input);
        else showError(input, check);
      }
    });
  });

  // 🔹 Submit Handler
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;
    let firstInvalid = null;

    form.querySelectorAll("input[required], textarea[required]").forEach((input) => {
      const rule = validators[input.name];
      const check = rule ? rule(input.value.trim()) : true;

      if (check !== true) {
        showError(input, check);
        if (!firstInvalid) firstInvalid = input;
        valid = false;
      } else {
        clearError(input);
      }
    });

    if (!valid && firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      firstInvalid.focus();
      return;
    }

    // ✅ Success - Show SweetAlert2 Popup
    Swal.fire({
      icon: "success",
      title: "Order Placed Successfully!",
      text: "Your order has been placed and will be delivered soon. Thank you for shopping with CartNow!",
      confirmButtonColor: "#28a745",
    });

    form.reset();
    form.querySelectorAll(".valid").forEach((el) => el.classList.remove("valid"));
  });
});

