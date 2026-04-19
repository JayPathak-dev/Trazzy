// Product data
const products = [
    { id: 1, name: 'Classic White T-Shirt', price: 1659, image: 'image1.png', description: 'A timeless classic white t-shirt made from soft, breathable cotton. Perfect for everyday wear.' },
    { id: 2, name: 'Graphic Print T-Shirt', price: 2074, image: 'image2.png', description: 'Express your style with this bold graphic print t-shirt. Made from high-quality fabric for comfort and durability.' },
    { id: 3, name: 'Striped Polo Shirt', price: 2485, image: 'image3.png', description: 'A versatile striped polo shirt that combines classic style with modern comfort. Ideal for casual outings.' },
    { id: 4, name: 'Vintage Style Tee', price: 1906, image: 'image4.png', description: 'Channel retro vibes with this vintage-style tee. Soft fabric and unique design make it a wardrobe staple.' },
    { id: 5, name: 'Oversized Hoodie', price: 3316, image: 'image1.png', description: 'Stay cozy in this oversized hoodie. Perfect for layering or lounging, with a relaxed fit for ultimate comfort.' },
    { id: 6, name: 'Denim Jacket', price: 4147, image: 'image2.png', description: 'A classic denim jacket that never goes out of style. Durable and versatile for any season.' }
];

// Cart functionality
function normalizeCartItem(item) {
    const product = products.find(p => p.id === item.id);
    const normalized = { ...item };

    const defaultImage = product ? product.image : 'image1.png';
    normalized.image = item.image || defaultImage;

    if (product) {
        normalized.name = product.name;
        normalized.price = Number.isFinite(item.price)
            ? item.price
            : parseFloat(String(item.price || '').replace(/[^0-9.]/g, '')) || product.price;
    } else {
        normalized.price = Number.isFinite(item.price)
            ? item.price
            : parseFloat(String(item.price || '').replace(/[^0-9.]/g, '')) || 0;
    }

    normalized.quantity = Number.isFinite(item.quantity) && item.quantity > 0 ? item.quantity : 1;
    normalized.size = item.size || 'M';

    return normalized;
}

let cart = JSON.parse(localStorage.getItem('cart')) || [];
cart = cart.map(normalizeCartItem);
localStorage.setItem('cart', JSON.stringify(cart));

// Update cart count in navbar
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

// Add to cart
function addToCart(productId, size) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId && item.size === size);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, size, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert('Item added to cart!');
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

// Update quantity
function updateQuantity(index, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(index);
        return;
    }
    cart[index].quantity = newQuantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

// Render cart
function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');

    if (!cartItems || !totalPrice) return;

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>Size: ${item.size}</p>
                <p>Price: ₹${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button onclick="updateQuantity(${index}, ${item.quantity - 1})">-</button>
                    <span>Quantity: ${item.quantity}</span>
                    <button onclick="updateQuantity(${index}, ${item.quantity + 1})">+</button>
                    <span class="remove-item" onclick="removeFromCart(${index})">Remove</span>
                </div>
            </div>
        `;
        cartItems.appendChild(itemElement);
    });

    totalPrice.textContent = total.toFixed(2);
}

// Load product details
function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('product-img').src = product.image;
    document.getElementById('product-img').alt = product.name;
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-price').textContent = `₹${product.price.toFixed(2)}`;
    document.getElementById('product-description').textContent = product.description;

    const addToCartBtn = document.getElementById('add-to-cart');
    addToCartBtn.addEventListener('click', () => {
        const size = document.getElementById('size').value;
        addToCart(productId, size);
    });
}

// Contact form submission
function handleContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        form.reset();
    });
}

// Proceed to checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty. Add items before checking out.');
        return;
    }
    window.location.href = 'checkout.html';
}

// Render checkout order summary
function renderCheckoutSummary() {
    const orderItems = document.getElementById('order-items');
    const subtotal = document.getElementById('subtotal');
    const shipping = document.getElementById('shipping');
    const tax = document.getElementById('tax');
    const grandTotal = document.getElementById('grand-total');

    if (!orderItems || !subtotal) return;

    orderItems.innerHTML = '';
    let total = 0;

    cart.forEach((item) => {
        total += item.price * item.quantity;
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        itemElement.innerHTML = `
            <div class="order-item-info">
                <p><strong>${item.name}</strong></p>
                <p>Size: ${item.size} | Qty: ${item.quantity}</p>
            </div>
            <div class="order-item-price">
                ₹${(item.price * item.quantity).toFixed(2)}
            </div>
        `;
        orderItems.appendChild(itemElement);
    });

    const shippingCost = total > 500 ? 0 : 50;
    const taxAmount = total * 0.18;
    const grandTotalAmount = total + shippingCost + taxAmount;

    subtotal.textContent = total.toFixed(2);
    shipping.textContent = shippingCost.toFixed(2);
    tax.textContent = taxAmount.toFixed(2);
    grandTotal.textContent = grandTotalAmount.toFixed(2);
}

// Handle checkout form submission
function handleCheckoutForm() {
    const form = document.getElementById('checkout-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = {
            fullname: document.getElementById('fullname').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            postal: document.getElementById('postal').value,
            country: document.getElementById('country').value,
            paymentMethod: document.querySelector('input[name="payment-method"]:checked').value,
            cartItems: cart,
            total: parseFloat(document.getElementById('grand-total').textContent)
        };

        // Save order to localStorage
        localStorage.setItem('lastOrder', JSON.stringify(formData));

        if (formData.paymentMethod === 'razorpay') {
            initiateRazorpayPayment(formData);
        } else if (formData.paymentMethod === 'cod') {
            completeCODOrder(formData);
        }
    });
}

// Razorpay payment integration
function initiateRazorpayPayment(formData) {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
        const options = {
            key: 'rzp_live_YOUR_KEY_ID',
            amount: Math.round(formData.total * 100),
            currency: 'INR',
            name: 'Trazzy',
            description: 'Purchase from Trazzy',
            customer_id: formData.email,
            prefill: {
                name: formData.fullname,
                email: formData.email,
                contact: formData.phone
            },
            handler: function (response) {
                formData.paymentId = response.razorpay_payment_id;
                formData.orderId = response.razorpay_order_id;
                completeRazorpayOrder(formData);
            },
            modal: {
                ondismiss: function () {
                    alert('Payment cancelled. Please try again.');
                }
            }
        };

        const rzp = new Razorpay(options);
        rzp.open();
    };
    document.body.appendChild(script);
}

// Complete Razorpay order
function completeRazorpayOrder(formData) {
    alert(`Payment successful! Your order #${Math.random().toString(36).substr(2, 9).toUpperCase()} has been placed.
    
Order Summary:
- Name: ${formData.fullname}
- Email: ${formData.email}
- Delivery to: ${formData.address}, ${formData.city}, ${formData.state}
- Total Amount: ₹${formData.total.toFixed(2)}

An order confirmation has been sent to ${formData.email}`);

    localStorage.removeItem('cart');
    cart = [];
    window.location.href = 'index.html';
}

// Complete COD order
function completeCODOrder(formData) {
    alert(`Order placed successfully! (Cash on Delivery)

Order Summary:
- Order ID: #${Math.random().toString(36).substr(2, 9).toUpperCase()}
- Name: ${formData.fullname}
- Email: ${formData.email}
- Phone: ${formData.phone}
- Delivery to: ${formData.address}, ${formData.city}, ${formData.state}
- Total Amount: ₹${formData.total.toFixed(2)}
- Payment: Cash on Delivery

An order confirmation has been sent to ${formData.email}`);

    localStorage.removeItem('cart');
    cart = [];
    window.location.href = 'index.html';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    if (window.location.pathname.includes('product.html')) {
        loadProductDetails();
    }

    if (window.location.pathname.includes('cart.html')) {
        renderCart();
    }

    if (window.location.pathname.includes('checkout.html')) {
        renderCheckoutSummary();
        handleCheckoutForm();
    }

    handleContactForm();
});