// Newsletter form handler
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const emailInput = document.getElementById('newsletter-email');
    const messageDiv = document.getElementById('newsletter-message');
    const email = emailInput.value.trim();
    if (email && validateEmail(email)) {
      messageDiv.textContent = 'تم الاشتراك بنجاح! شكراً لك.';
      messageDiv.style.color = '#008000';
      emailInput.value = '';
    } else {
      messageDiv.textContent = 'يرجى إدخال بريد إلكتروني صحيح.';
      messageDiv.style.color = '#d8000c';
    }
  });
}

function validateEmail(email) {
  // Simple email validation
  return /^[^\s@]+@[^\\s@]+\.[^\s@]+$/.test(email);
}
