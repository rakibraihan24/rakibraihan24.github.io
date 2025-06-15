// Form submission handling
document.getElementById('orderForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Show loading state
    const submitButton = document.querySelector('.submit-button');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'অর্ডার সাবমিট হচ্ছে...';
    submitButton.disabled = true;

    try {
        // Get form data
        const formData = {
            recipient: {
                name: document.getElementById('recipientName').value,
                gender: document.getElementById('recipientGender').value,
                relationship: document.getElementById('relationship').value,
                age: document.getElementById('recipientAge').value,
                preferences: document.getElementById('preferences').value
            },
            sender: {
                name: document.getElementById('senderName').value,
                phone: document.getElementById('senderPhone').value
            },
            delivery: {
                address: document.getElementById('deliveryAddress').value,
                specialMessage: document.getElementById('specialMessage').value
            },
            budget: document.getElementById('budget').value,
            orderDate: new Date(),
            status: 'pending'
        };

        // Add to Firestore
        const docRef = await db.collection('orders').add(formData);

        // Show success message
        alert('আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে! আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।');
        
        // Reset form
        this.reset();

    } catch (error) {
        console.error('Error submitting order:', error);
        alert('দুঃখিত, কিছু সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
        // Reset button state
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    }
});

// Phone number validation
document.getElementById('senderPhone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) {
        value = value.slice(0, 11);
    }
    e.target.value = value;
});

// Budget validation
document.getElementById('budget').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 6) {
        value = value.slice(0, 6);
    }
    e.target.value = value;
});

// Age validation
document.getElementById('recipientAge').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 3) {
        value = value.slice(0, 3);
    }
    e.target.value = value;
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add loading animation to submit button
const submitButton = document.querySelector('.submit-button');
submitButton.addEventListener('click', function() {
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> প্রসেসিং...';
    setTimeout(() => {
        this.innerHTML = 'অর্ডার কনফার্ম করুন';
    }, 2000);
});

// Add input validation
const budgetInput = document.getElementById('budget');
budgetInput.addEventListener('input', function() {
    if (this.value < 500) {
        this.setCustomValidity('দয়া করে কমপক্ষে ৳500 বাজেট নির্ধারণ করুন');
    } else {
        this.setCustomValidity('');
    }
});

// Add phone number validation
const phoneInput = document.getElementById('phone');
phoneInput.addEventListener('input', function() {
    const phoneRegex = /^(\+88|88)?(01[3-9]\d{8})$/;
    if (!phoneRegex.test(this.value)) {
        this.setCustomValidity('দয়া করে সঠিক মোবাইল নম্বর দিন');
    } else {
        this.setCustomValidity('');
    }
});

// Mobile Menu Functionality
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    // Change icon based on menu state
    const icon = mobileMenuBtn.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        navLinks.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// Function to convert Bengali numerals to English numerals
function convertBengaliToEnglish(input) {
    const bengaliToEnglish = {
        '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
        '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
    };
    
    return input.split('').map(char => bengaliToEnglish[char] || char).join('');
}

// Add input event listeners to all input and textarea elements
document.querySelectorAll('input, textarea').forEach(element => {
    element.addEventListener('input', function(e) {
        const cursorPosition = this.selectionStart;
        const oldValue = this.value;
        const newValue = convertBengaliToEnglish(oldValue);
        
        if (oldValue !== newValue) {
            this.value = newValue;
            // Restore cursor position
            this.setSelectionRange(cursorPosition, cursorPosition);
        }
    });
});

// Handle form submission
document.getElementById('giftForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Convert all input values to English numerals before submission
    const formData = {
        recipient: {
            name: convertBengaliToEnglish(document.getElementById('recipientName').value),
            relationship: document.getElementById('recipientRelationship').value,
            gender: document.getElementById('recipientGender').value,
            age: convertBengaliToEnglish(document.getElementById('recipientAge').value)),
            budget: convertBengaliToEnglish(document.getElementById('budget').value)
        },
        sender: {
            name: document.getElementById('senderName').value,
            phone: convertBengaliToEnglish(document.getElementById('senderPhone').value)
        },
        delivery: {
            address: convertBengaliToEnglish(document.getElementById('deliveryAddress').value)
        }
    };

    try {
        const docRef = await db.collection('orders').add({
            ...formData,
            status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        alert('অর্ডার সফল হয়েছে! আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।');
        this.reset();
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('দুঃখিত, একটি সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    }
}); 