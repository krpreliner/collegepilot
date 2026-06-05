// --- Data ---
const courses = [
  { id: 'c1', title: 'DSA & Problem Solving', price: 999, features: ['Expert Curated Sheets & Study Material', 'Daily Coding Problems', 'Mock Interviews', 'Placement Assistance'] },
  { id: 'c2', title: 'Full Stack Web Dev', price: 999, features: ['MERN Stack', 'Real-world Projects', 'Resume Building', 'Guaranteed Internship'] }
];

const josaaPlans = [
  { id: 'j1', title: 'JOSAA Counselling', price: 599, features: ['Personalized College Shortlist', 'Choice Filling Strategy', 'Round-wise Guidance', 'WhatsApp Support'] },
  { id: 'j2', title: 'JOSAA + CSAB Counselling', price: 999, features: ['Everything in JoSAA Plan', 'CSAB Strategy', 'Expert Support Till Admission', 'Priority Call Support', 'Seat Upgrade Guidance'] }
];

const successStories = [
  { photo: '🎓', rank: 'AIR 48,000', college: 'NIT Jamshedpur', branch: 'CSE', review: 'The choice filling list provided by College Pilot was incredibly accurate. They helped me get CSE in NIT Jamshedpur when I thought it was impossible!' },
  { photo: '🎯', rank: 'AIR 1.2 Lakh', college: 'IIIT Pune', branch: 'ECE', review: 'Expert CSAB guidance saved my year. The mentor was available 24x7 to answer all my silly doubts during the reporting process.' },
  { photo: '🏆', rank: 'AIR 75,000', college: 'NIT Durgapur', branch: 'Mechanical', review: 'Highly recommend their one-to-one mentorship. They guided me step-by-step through the seat upgrade rounds.' }
];

// --- Payment & WhatsApp Configuration ---
const upiId = "alexaman000r-1@oksbi";
const payeeName = "Aman Raj";
const finalWhatsappNumber = "919955136965";

// --- Ambassador Codes ---
const validAmbassadors = {
  'VECTOR10': 'Vector',
  'PILOT10': 'College Pilot Team',
  'FRESH10': 'Freshers Community',
  'JOSAA10': 'JOSAA Expert'
};
let appliedDiscount = null;

// --- DOM Elements ---
const coursesGrid = document.getElementById('courses-grid');
const josaaGrid = document.getElementById('josaa-grid');
const hamburger = document.querySelector('.hamburger');
const navLinksContainer = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-link');

// --- Render Content ---
function renderCards(data, container, buttonText) {
  if(!container) return;
  container.innerHTML = '';
  data.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'card glass-card';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', (index * 100).toString());
    
    // Add MOST POPULAR tag for premium JOSAA plan
    let badgeHtml = '';
    if(item.price === 999) {
      badgeHtml = `<div style="position:absolute; top:-12px; right:20px; background:linear-gradient(135deg, #FF6B81, #FF4757); color:#fff; font-size:0.75rem; font-weight:800; padding:5px 15px; border-radius:20px; box-shadow:0 0 15px rgba(255, 71, 87, 0.6); letter-spacing: 0.5px;">🔥 MOST POPULAR</div>`;
      card.style.position = 'relative';
      card.style.border = '2px solid #FF4757';
    }

    card.innerHTML = `
      ${badgeHtml}
      <h3 class="card-title">${item.title}</h3>
      <div class="card-price">₹${item.price}</div>
      <ul class="card-features">
        ${item.features.map(f => `<li>✅ ${f}</li>`).join('')}
      </ul>
      <button class="btn btn-primary w-100" onclick="initiatePayment('${item.title}', ${item.price})">${buttonText}</button>
    `;
    container.appendChild(card);
  });
}

function renderSuccessCarousel() {
  const track = document.getElementById('success-track');
  const dotsContainer = document.getElementById('carousel-dots');
  if(!track) return;
  
  successStories.forEach((story, index) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.innerHTML = `
      <div class="stars">★★★★★</div>
      <p class="review-text">"${story.review}"</p>
      <h4>${story.college} - ${story.branch}</h4>
      <span class="rank-info">${story.rank}</span>
    `;
    track.appendChild(slide);
    
    const dot = document.createElement('div');
    dot.className = index === 0 ? 'dot active' : 'dot';
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });
}

let currentSlide = 0;
function goToSlide(index) {
  const track = document.getElementById('success-track');
  const dots = document.querySelectorAll('.dot');
  if(!track || !dots.length) return;
  
  currentSlide = index;
  track.style.transform = `translateX(-${index * 100}%)`;
  
  dots.forEach(d => d.classList.remove('active'));
  dots[index].classList.add('active');
}

// Auto advance carousel
setInterval(() => {
  if(successStories.length > 0) {
    let next = (currentSlide + 1) % successStories.length;
    goToSlide(next);
  }
}, 5000);

// Initialize Data
document.addEventListener('DOMContentLoaded', () => {
  renderCards(courses, coursesGrid, 'Enroll Now');
  renderCards(josaaPlans, josaaGrid, 'Book Now');
  renderSuccessCarousel();
  
  // Initialize AOS
  if(typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50
    });
  }
});

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
    const navHeight = document.querySelector('.navbar').offsetHeight;
    const targetPosition = section.getBoundingClientRect().top + window.scrollY - navHeight - 20;
    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
  }
};

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navLinksContainer.classList.remove('active');
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
    document.querySelectorAll('.faq-item.active').forEach(activeItem => {
      if (activeItem !== item) activeItem.classList.remove('active');
    });
    item.classList.toggle('active');
  });
});

// --- Payment Modal Logic ---
const modal = document.getElementById('payment-modal');
const serviceNameInput = document.getElementById('service-name');
const serviceAmountInput = document.getElementById('service-amount');
const paymentTitle = document.getElementById('payment-title');
const originalAmountEl = document.getElementById('original-amount');
const discountedAmountEl = document.getElementById('discounted-amount');
const qrImage = document.getElementById('qr-image');
const form = document.getElementById('registration-form');

const couponInput = document.getElementById('ambassador-code');
const applyCodeBtn = document.getElementById('apply-code-btn');
const couponMessage = document.getElementById('coupon-message');

function generateQrCode(amount) {
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;
  qrImage.src = qrUrl;
}

window.initiatePayment = function(serviceName, amount) {
  serviceNameInput.value = serviceName;
  serviceAmountInput.value = amount;
  paymentTitle.textContent = `Register for ${serviceName}`;
  
  appliedDiscount = null;
  if(couponInput) couponInput.value = '';
  if(couponMessage) {
    couponMessage.textContent = '';
    couponMessage.className = '';
  }
  
  if(originalAmountEl) {
    originalAmountEl.textContent = `₹${amount}`;
    originalAmountEl.classList.remove('strike-through');
  }
  if(discountedAmountEl) discountedAmountEl.style.display = 'none';
  
  generateQrCode(amount);
  if(modal) modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

if(applyCodeBtn) {
  applyCodeBtn.addEventListener('click', () => {
    const code = couponInput.value.trim().toUpperCase();
    const baseAmount = parseFloat(serviceAmountInput.value);
    
    if (!code) return;

    if (validAmbassadors[code]) {
      const discountAmount = baseAmount * 0.10;
      const finalAmount = baseAmount - discountAmount;
      
      appliedDiscount = {
        code: code,
        ambassadorName: validAmbassadors[code],
        originalPrice: baseAmount,
        discountedPrice: finalAmount.toFixed(2),
        discountAmount: discountAmount.toFixed(2)
      };
      
      originalAmountEl.classList.add('strike-through');
      discountedAmountEl.textContent = `₹${finalAmount.toFixed(2)}`;
      discountedAmountEl.style.display = 'inline';
      
      couponMessage.textContent = `🎉 Ambassador Code Applied! You received a 10% discount.`;
      couponMessage.className = 'success-text';
      generateQrCode(finalAmount.toFixed(2));
    } else {
      appliedDiscount = null;
      originalAmountEl.classList.remove('strike-through');
      discountedAmountEl.style.display = 'none';
      
      couponMessage.textContent = `❌ Invalid Ambassador Code.`;
      couponMessage.className = 'error-text';
      generateQrCode(baseAmount);
    }
  });
}

window.closePaymentModal = function() {
  if(modal) modal.classList.remove('active');
  document.body.style.overflow = 'auto';
  if(form) form.reset();
  const statusEl = document.getElementById('upload-status');
  if(statusEl) statusEl.textContent = '';
};

window.onclick = function(event) {
  if (event.target == modal) closePaymentModal();
};

if(form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const statusMsg = document.getElementById('upload-status');
    const fileInput = document.getElementById('payment-screenshot');
    const file = fileInput.files[0];
    
    if (!file) { alert("Please upload the payment screenshot."); return; }
    
    submitBtn.disabled = true;
    btnText.textContent = 'Uploading...';
    statusMsg.textContent = 'Uploading screenshot...';
    statusMsg.style.color = 'var(--primary-color)';
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
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
        
        let message = `*🚀 New Registration - College Pilot*%0A%0A` +
                      `*Name:* ${name}%0A` +
                      `*Mobile:* ${mobile}%0A` +
                      `*Email:* ${email}%0A` +
                      `*Course Name:* ${service}%0A`;
                      
        if (appliedDiscount) {
          message += `*Original Price:* ₹${appliedDiscount.originalPrice}%0A` +
                     `*Discounted Price:* ₹${appliedDiscount.discountedPrice}%0A` +
                     `*Ambassador Name:* ${appliedDiscount.ambassadorName}%0A` +
                     `*Ambassador Code Used:* ${appliedDiscount.code}%0A`;
        } else {
          message += `*Amount Paid:* ₹${serviceAmountInput.value}%0A`;
        }
        
        message += `*Transaction UTR:* ${utr}%0A%0A` +
                   `*Payment Screenshot:* ${downloadUrl}`;
                        
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
}