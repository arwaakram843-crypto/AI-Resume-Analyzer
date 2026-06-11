
document.addEventListener("DOMContentLoaded", () => {

  const fileInput = document.getElementById("resumeFile");
  const fileNameText = document.getElementById("file-name");
  const textInput = document.getElementById("resumeText");

  // Show selected file name
  fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
      fileNameText.innerText = fileInput.files[0].name;
    } else {
      fileNameText.innerText = "No file selected";
    }
  });

  // MAIN UPLOAD FUNCTION
  window.uploadResume = async function () {

    const formData = new FormData();

    // file add
    if (fileInput.files.length > 0) {
      formData.append("resumeFile", fileInput.files[0]);
    }

    // text add
    if (textInput && textInput.value.trim()) {
      formData.append("resumeText", textInput.value.trim());
    }

    // validation
    if (fileInput.files.length === 0 && (!textInput || !textInput.value.trim())) {
      alert("Please select a file or paste resume text");
      return;
    }

    try {

      // 🚀 FETCH (IMPORTANT PART)
      const response = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      // save for next page
      //      localStorage.setItem("resumeText", data.resumeText);

      // go to next page
      window.location.href = "jobdescription.html";

    } catch (error) {
      alert("Upload error: " + error.message);
    }

  };

});
