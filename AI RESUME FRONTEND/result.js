document.addEventListener("DOMContentLoaded", () => {

    // Local Storage se data lo
    const data = JSON.parse(localStorage.getItem("analysisData"));

    // Agar data nahi mila
    if (!data) {

        document.getElementById("analysisOutput").innerHTML =
            "<p>No analysis found. Please analyze a resume first.</p>";

        return;
    }
    const score = data.overallMatch;

// 1. Text update (already ho raha hoga, but safe)
document.getElementById("scorePercentage").innerText = score + "%";

// 2. Circle fill logic
const circle = document.getElementById("scoreCircle");

const degrees = (score / 100) * 360;

circle.style.background =
    `conic-gradient(#4CAF50 ${degrees}deg, #e0e0e0 ${degrees}deg)`;

    // =========================
    // Overall Match %
    // =========================
    document.getElementById("overallMatch").innerText =
        data.overallMatch + "%";

    // =========================
    // Matched Skills
    // =========================
    const matchedContainer =
        document.getElementById("matchedSkills");

    matchedContainer.innerHTML = "";

    if (data.matchedSkills) {

        data.matchedSkills.forEach(skill => {

            matchedContainer.innerHTML +=
                `<span>${skill}</span>`;

        });

    }

    // =========================
    // Missing Skills
    // =========================
    const missingContainer =
        document.getElementById("missingSkills");

    missingContainer.innerHTML = "";

    if (data.missingSkills) {

        data.missingSkills.forEach(skill => {

            missingContainer.innerHTML +=
                `<span>${skill}</span>`;

        });

    }

    // =========================
    // Summary Box
    // =========================
    const summaryText =
        document.getElementById("summaryText");

    if (summaryText) {

        summaryText.innerText =
            `Resume matched ${data.overallMatch}% with the job requirements.`;

    }

    // =========================
    // Recommendation Box
    // =========================
    const recommendationText =
        document.getElementById("recommendationText");

    if (recommendationText && data.recommendations) {

        recommendationText.innerHTML =
            data.recommendations.join("<br>");

    }

    // =========================
    // Count Cards (Optional)
    // =========================
    const matchedCount =
        document.getElementById("matchedCount");

    const missingCount =
        document.getElementById("missingCount");

    if (matchedCount && data.matchedSkills) {

        matchedCount.innerText =
            data.matchedSkills.length;

    }

    if (missingCount && data.missingSkills) {

        missingCount.innerText =
            data.missingSkills.length;

    }

});