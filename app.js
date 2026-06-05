// --- Data ---
const courses = [
  { id: 'c1', title: 'DSA Course', price: 599, features: ['Recorded Lectures', 'PDF Notes', 'Weekly Quizzes', 'Lifetime Access'] },
  { id: 'c2', title: 'Web Dev Course', price: 599, features: ['Live Classes', 'Doubt Support', 'Projects Portfolio', 'Placement Assistance'] },
  { id: 'c3', title: 'DSA + Web Dev', price: 800, features: ['Everything in DSA', 'Everything in Web Dev', 'Priority Support'] }
];

const josaaPlans = [
  { id: 'j1', title: 'JOSAA Counselling', price: 599, features: ['Personalized College Shortlist', 'Choice Filling Strategy', 'Round-wise Guidance'] },
  { id: 'j2', title: 'JOSAA + CSAB Counselling', price: 999, features: ['Everything in JOSAA', 'Expert Support Till Admission', 'Priority Call Support'] }
];

// --- Payment & WhatsApp Configuration ---
const upiId = "alexaman000r-1@oksbi";
const payeeName = "Aman Raj";
const finalWhatsappNumber = "918210330277";

// --- DOM Elements ---
const coursesGrid = document.getElementById('courses-grid');
const josaaGrid = document.getElementById('josaa-grid');
const hamburger = document.querySelector('.hamburger');
const navLinksContainer = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-link');
const scrollFadeElements = document.querySelectorAll('.scroll-fade');

// --- Render Content ---
function renderCards(data, container, buttonText) {
  if(!container) return;
  container.innerHTML = '';
  data.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card glass-card';
    
    // Add "BEST VALUE" tag for premium JOSAA plan as per poster
    let badgeHtml = '';
    if(item.price === 999) {
      badgeHtml = `<div style="position:absolute; top:-15px; right:20px; background:var(--accent-color); color:#fff; font-size:0.8rem; font-weight:bold; padding:4px 12px; border-radius:20px; box-shadow:0 4px 10px rgba(255,107,129,0.4);">BEST VALUE</div>`;
      card.style.position = 'relative';
      card.style.border = '2px solid var(--primary-color)';
    }

    card.innerHTML = `
      ${badgeHtml}
      <h3 class="card-title">${item.title}</h3>
      <div class="card-price">₹${item.price}</div>
      <ul class="card-features">
        ${item.features.map(f => `<li>${f}</li>`).join('')}
      </ul>
      <button class="btn btn-primary w-100" onclick="initiatePayment('${item.title}', ${item.price})">${buttonText}</button>
    `;
    container.appendChild(card);
  });
}

renderCards(courses, coursesGrid, 'Start Learning');
renderCards(josaaPlans, josaaGrid, 'Book Your Slot Now');

// --- Mobile Navigation ---
if(hamburger) {
  hamburger.addEventListener('click', () => {
    navLinksContainer.classList.toggle('active');
  });
}

// --- Smooth Scrolling ---
window.scrollToSection = function(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    // offset for fixed navbar
    const navHeight = document.querySelector('.navbar').offsetHeight;
    const targetPosition = section.getBoundingClientRect().top + window.scrollY - navHeight - 20;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
};

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navLinksContainer.classList.remove('active'); // Close mobile menu
    
    // Update active nav state
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    
    const targetId = link.getAttribute('href').substring(1);
    scrollToSection(targetId);
  });
});


// --- FAQ Accordion Logic ---
document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', () => {
    const item = question.parentElement;
    // Close other active items if desired
    document.querySelectorAll('.faq-item.active').forEach(activeItem => {
      if (activeItem !== item) {
        activeItem.classList.remove('active');
      }
    });
    item.classList.toggle('active');
  });
});

// --- Payment Modal Logic ---
const modal = document.getElementById('payment-modal');
const serviceNameInput = document.getElementById('service-name');
const serviceAmountInput = document.getElementById('service-amount');
const paymentTitle = document.getElementById('payment-title');
const paymentAmount = document.getElementById('payment-amount');
const qrImage = document.getElementById('qr-image');
const form = document.getElementById('registration-form');

window.initiatePayment = function(serviceName, amount) {
  serviceNameInput.value = serviceName;
  serviceAmountInput.value = amount;
  paymentTitle.textContent = `Register for ${serviceName}`;
  paymentAmount.textContent = `₹${amount}`;
  
  // Generate QR Code URL
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;
  qrImage.src = qrUrl;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
};

window.closePaymentModal = function() {
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
  form.reset();
  document.getElementById('upload-status').textContent = '';
};

// Close modal if clicked outside
window.onclick = function(event) {
  if (event.target == modal) {
    closePaymentModal();
  }
};

// --- Form & Upload Logic ---
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const submitBtn = document.getElementById('submit-btn');
  const btnText = submitBtn.querySelector('.btn-text');
  const statusMsg = document.getElementById('upload-status');
  const fileInput = document.getElementById('payment-screenshot');
  const file = fileInput.files[0];
  
  if (!file) {
    alert("Please upload the payment screenshot.");
    return;
  }
  
  submitBtn.disabled = true;
  btnText.textContent = 'Uploading...';
  statusMsg.textContent = 'Uploading screenshot...';
  statusMsg.style.color = 'var(--primary-color)';
  
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    // Upload image to temporary file host
    const response = await fetch('https://tmpfiles.org/api/v1/upload', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    if (result.status === 'success') {
      const urlParts = result.data.url.split('tmpfiles.org/');
      const downloadUrl = `https://tmpfiles.org/dl/${urlParts[1]}`;
      
      const name = document.getElementById('full-name').value;
      const mobile = document.getElementById('mobile-number').value;
      const email = document.getElementById('email').value;
      const utr = document.getElementById('transaction-id').value;
      const service = serviceNameInput.value;
      const amount = serviceAmountInput.value;
      
      let message = `*🚀 New Registration - College Pilot*%0A%0A` +
                    `*Name:* ${name}%0A` +
                    `*Mobile:* ${mobile}%0A` +
                    `*Email:* ${email}%0A` +
                    `*Service:* ${service}%0A` +
                    `*Amount:* ₹${amount}%0A` +
                    `*Transaction UTR:* ${utr}%0A%0A` +
                    `*Payment Screenshot:* ${downloadUrl}`;
                      
      // Redirect to WhatsApp
      window.location.href = `https://wa.me/${finalWhatsappNumber}?text=${message}`;
      
      setTimeout(() => {
        closePaymentModal();
        submitBtn.disabled = false;
        btnText.textContent = 'Send to WhatsApp';
      }, 1000);
      
    } else {
      throw new Error('Upload failed');
    }
  } catch (error) {
    console.error('Error:', error);
    statusMsg.textContent = 'Upload failed. Please send details directly to WhatsApp.';
    statusMsg.style.color = 'var(--accent-color)';
    submitBtn.disabled = false;
    btnText.textContent = 'Send to WhatsApp';
  }
});