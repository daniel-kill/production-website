/**
 * Interactive Behaviors & AJAX Contact Form for danielkill.online
 * Maintainer: Daniel Kill
 */

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const alertBox = document.getElementById('form-alert');

  if (contactForm && submitBtn && alertBox) {
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');

    const showAlert = (message, type = 'success') => {
      alertBox.textContent = message;
      alertBox.className = `form-alert alert-${type}`;
      alertBox.style.display = 'block';
    };

    const hideAlert = () => {
      alertBox.style.display = 'none';
      alertBox.textContent = '';
    };

    const setLoading = (isLoading) => {
      submitBtn.disabled = isLoading;
      if (btnText && btnSpinner) {
        btnText.style.display = isLoading ? 'none' : 'inline-flex';
        btnSpinner.style.display = isLoading ? 'inline-block' : 'none';
      }
    };

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAlert();

      // Client-side quick validation
      const name = contactForm.elements['name']?.value.trim() || '';
      const email = contactForm.elements['email']?.value.trim() || '';
      const message = contactForm.elements['message']?.value.trim() || '';

      if (name.length < 2) {
        showAlert('Please enter your name.', 'error');
        return;
      }
      if (!email.includes('@') || !email.includes('.')) {
        showAlert('Please enter a valid email address.', 'error');
        return;
      }
      if (message.length < 5) {
        showAlert('Please enter a message (at least 5 characters).', 'error');
        return;
      }

      setLoading(true);

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showAlert(data.message || 'Thank you! Your message has been sent.', 'success');
          contactForm.reset();
        } else {
          showAlert(data.error || 'Unable to submit your message. Please try again.', 'error');
        }
      } catch (err) {
        console.error('Submission error:', err);
        showAlert('A network error occurred. You can also reach me directly at daniel@danielkill.online', 'error');
      } finally {
        setLoading(false);
      }
    });
  }
});
