document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");
    const submitBtn = document.getElementById("submitBtn");
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearMessages();
  
      let isValid = true;
  
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const service = form.service.value;
      const message = form.message.value.trim();
  
      // === Client-side validation ===
      if (name === "") {
        showError("name", "Name is required");
        isValid = false;
      }
  
      if (!validateEmail(email)) {
        showError("email", "Enter a valid email address");
        isValid = false;
      }
  
      if (service === "") {
        showError("service", "Please select a service");
        isValid = false;
      }
  
      if (message.length < 10) {
        showError("message", "Message must be at least 10 characters");
        isValid = false;
      }
  
      if (!isValid) {
        showStatus("Please fix the errors above.", "error");
        return;
      }
  
      // === Loading state ===
      submitBtn.disabled = true;
      submitBtn.classList.add("loading");
  
      // === Submit to API Gateway ===
      try {
        const response = await fetch("https://wqly2i92d1.execute-api.ca-central-1.amazonaws.com/prod/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            service,
            message
          }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          form.reset();
          showStatus("Your message was sent successfully!", "success");
        } else {
          throw new Error(data.message || "Submission failed. Please try again.");
        }
      } catch (err) {
        showStatus(err.message, "error");
      } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove("loading");
      }
    });
  
    function showError(fieldId, message) {
      const input = document.getElementById(fieldId);
      const errorEl = input.parentElement.querySelector(".error-message");
      errorEl.textContent = message;
      errorEl.style.display = "block";
    }
  
    function clearMessages() {
      document.querySelectorAll(".error-message").forEach(el => {
        el.textContent = "";
        el.style.display = "none";
      });
      formStatus.style.display = "none";
    }
  
    function showStatus(message, type) {
      formStatus.textContent = message;
      formStatus.className = `form-status ${type}`;
      formStatus.style.display = "block";
    }
  
    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  });
