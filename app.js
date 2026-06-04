// --- Data ---
const courses = [
  { id: 'c1', title: 'DSA Course', price: 599, features: ['Recorded Lectures', 'PDF Notes', 'Weekly Quizzes', 'Lifetime Access'] },
  { id: 'c2', title: 'Web Dev Course', price: 599, features: ['Live Classes', 'Doubt Support', 'Projects Portfolio', 'Placement Assistance'] },
  { id: 'c3', title: 'DSA + Web Dev', price: 800, features: ['Everything in DSA', 'Everything in Web Dev', 'Priority Support'] }
];

const josaaPlans = [
  { id: 'j1', title: 'JOSAA Plan', price: 599, features: ['Choice Filling List', 'College Predictor', 'Email Support'] },
  { id: 'j2', title: 'JOSAA + CSAB Plan', price: 999, features: ['Personalized Choice Filling', 'Direct Call with Expert', 'Document Verification Help', 'Priority WhatsApp Support'] }
];

// --- DOM Elements ---
const navLinks = document.querySelectorAll('.nav-link');
const views = document.querySelectorAll('.view-section');
const coursesGrid = document.getElementById('courses-grid');
const josaaGrid = document.getElementById('josaa-grid');
const form = document.getElementById('registration-form');
const serviceNameInput = document.getElementById('service-name');
const serviceAmountInput = document.getElementById('service-amount');
const paymentTitle = document.getElementById('payment-title');
const paymentAmount = document.getElementById('payment-amount');
const qrImage = document.getElementById('qr-image');

// --- Payment & WhatsApp Configuration ---
const upiId = "alexaman000r-1@oksbi";
const payeeName = "Aman Raj";
const finalWhatsappNumber = "919955136965";

// --- Navigation Logic (SPA) ---
function showView(targetId) {
  views.forEach(view => {
    view.classList.remove('active');
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.dataset.target === targetId) {
      link.classList.add('active');
    }
  });

  const targetView = document.getElementById(targetId);
  if (targetView) {
    targetView.classList.add('active');
    window.scrollTo(0, 0);
  }
}

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.dataset.target;
    showView(targetId);
  });
});

// Buttons that trigger navigation
document.querySelectorAll('[data-nav]').forEach(btn => {
  btn.addEventListener('click', () => {
    showView(btn.dataset.nav);
  });
});

// --- Render Content ---
function renderCards(data, container, buttonText) {
  container.innerHTML = '';
  data.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card glass-card';
    card.innerHTML = `
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

renderCards(courses, coursesGrid, 'Buy Course');
renderCards(josaaPlans, josaaGrid, 'Register Now');

// --- Payment Logic ---
window.initiatePayment = function(serviceName, amount) {
  serviceNameInput.value = serviceName;
  serviceAmountInput.value = amount;
  
  paymentTitle.textContent = `Register for ${serviceName}`;
  paymentAmount.textContent = `₹${amount}`;
  
  // Generate QR Code URL
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}`;
  qrImage.src = qrUrl;

  showView('payment');
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
  statusMsg.textContent = 'Uploading screenshot, please wait...';
  statusMsg.style.color = 'var(--accent-color)';
  
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
      const additionalMsg = document.getElementById('message').value;
      
      let message = `*New Registration - College Pilot*%0A%0A` +
                    `*Name:* ${name}%0A` +
                    `*Mobile:* ${mobile}%0A` +
                    `*Email:* ${email}%0A` +
                    `*Service:* ${service}%0A` +
                    `*Amount:* ₹${amount}%0A` +
                    `*Transaction UTR:* ${utr}%0A%0A` +
                    `*Payment Screenshot:* ${downloadUrl}`;
                    
      if (additionalMsg) {
        message += `%0A%0A*Message:* ${additionalMsg}`;
      }
                      
      // Redirect to WhatsApp
      window.location.href = `https://wa.me/${finalWhatsappNumber}?text=${message}`;
      
      setTimeout(() => {
        submitBtn.disabled = false;
        btnText.textContent = 'Submit & Send to WhatsApp';
        statusMsg.textContent = '';
        form.reset();
        showView('home');
      }, 2000);
      
    } else {
      throw new Error('Upload failed');
    }
  } catch (error) {
    console.error('Error:', error);
    statusMsg.textContent = 'Upload failed. Please try again or send details directly to WhatsApp.';
    statusMsg.style.color = 'var(--secondary-color)';
    submitBtn.disabled = false;
    btnText.textContent = 'Submit & Send to WhatsApp';
  }
});