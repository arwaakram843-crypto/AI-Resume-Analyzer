// ===== BUTTONS SELECT (SAFE VERSION) =====
const uploadBtn = document.querySelector(".btn.primary");
const learnMoreBtn = document.querySelector(".btn.secondary");

// ===== UPLOAD RESUME BUTTON =====
if (uploadBtn) {
  uploadBtn.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "upload.html";
  });
}

// ===== LEARN MORE BUTTON =====
if (learnMoreBtn) {
  learnMoreBtn.addEventListener("click", function (e) {
    e.preventDefault();

    const section = document.querySelector(".how-it-works");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  });
}

// ===== ANALYZE FORM =====
const analyzeForm = document.getElementById("analyzeForm");

if (analyzeForm) {

  analyzeForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const resume = document.getElementById("resume")?.value.trim();
    const jobDesc = document.getElementById("jobDesc")?.value.trim();

    if (!resume || !jobDesc) {
      alert("Please enter both resume text and job description.");
      return;
    }

    const resultContainer = document.getElementById("result");
    if (resultContainer) {
      resultContainer.innerText = "Analyzing...";
    }

    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resume, jobDesc }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed.");
      }

      if (resultContainer) {
        resultContainer.innerText = data.result;
      }

    } catch (error) {
      if (resultContainer) {
        resultContainer.innerText = "Error: " + error.message;
      }
    }
  });
}