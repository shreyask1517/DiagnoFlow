// script.js
const form = document.querySelector("form");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = form.querySelector("input").value;

    try {
      const response = await fetch("http://localhost:3000/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      alert(data.message || "Submitted successfully.");
      form.reset();
    } catch (error) {
      alert("Unable to submit right now. Please try again.");
      console.error("Waitlist submission failed:", error);
    }
  });
}
