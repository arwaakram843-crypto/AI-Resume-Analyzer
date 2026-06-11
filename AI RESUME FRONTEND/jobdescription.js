// ===== SELECT ELEMENTS =====
const jobDescriptionTextarea = document.getElementById("jobDesc");
const analyzeBtn = document.querySelector(".analyze-btn");
const clearBtn = document.querySelector(".clear-btn");

// ===== ANALYZE BUTTON =====
analyzeBtn.addEventListener("click", async function () {
  console.log("Analyze button clicked");

  // ✅ GET RESUME FROM LOCAL STORAGE
  //const resume = localStorage.getItem("resumeText") || "";

  // ✅ GET JOB DESCRIPTION
  const jobDesc = jobDescriptionTextarea.value.trim();

  

  // ✅ CHECK JOB DESCRIPTION
  if (!jobDesc) {
    alert("Please enter the job description.");
    return;
  }

  // BUTTON LOADING
  analyzeBtn.innerText = "Analyzing...";
  analyzeBtn.disabled = true;

  try {

    // ✅ SEND DATA TO BACKEND
    const response = await fetch("http://127.0.0.1:5000/analyze", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        jobDesc,
      }),

    });

    // ✅ GET RESPONSE
    const data = await response.json();

    // ERROR CHECK
    if (!response.ok) {
      throw new Error(data.error || "Analysis failed.");
    }

    // ✅ SAVE RESULT
    localStorage.setItem("analysisData", JSON.stringify(data));

    // ✅ GO TO RESULT PAGE
    window.location.href = "result.html";

  } catch (error) {

    alert("Error: " + error.message);

    analyzeBtn.disabled = false;
    analyzeBtn.innerText = "Analyze Resume";
  }
});

// ===== CLEAR BUTTON =====
clearBtn.addEventListener("click", function () {
  jobDescriptionTextarea.value = "";
});