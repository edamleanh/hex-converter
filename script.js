document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const hexInput = document.getElementById("hexInput");
  const textOutput = document.getElementById("textOutput");
  const convertBtn = document.getElementById("convertBtn");
  const clearBtn = document.getElementById("clearBtn");
  const pasteBtn = document.getElementById("pasteBtn");
  const copyBtn = document.getElementById("copyBtn");
  const resultSection = document.getElementById("resultSection");
  const errorMsg = document.getElementById("errorMsg");
  const toast = document.getElementById("toast");
  const openLinkBtn = document.getElementById("openLinkBtn");

  // Auto-focus on input
  hexInput.focus();

  // Event Listeners
  convertBtn.addEventListener("click", handleConversion);
  clearBtn.addEventListener("click", clearAll);
  pasteBtn.addEventListener("click", handlePaste);
  copyBtn.addEventListener("click", handleCopy);

  // Allow Ctrl+Enter to convert
  hexInput.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "Enter") {
      handleConversion();
    }
  });

  // Main Conversion Logic
  function handleConversion() {
    const input = hexInput.value.trim();

    if (!input) {
      showError("Vui lòng nhập mã Hex.");
      hideResult();
      return;
    }

    // Check validity using the shared validHex function
    // Note: isValidHex is available globally from decoder.js
    if (!isValidHex(input)) {
      showError("Mã Hex không hợp lệ. Chỉ chấp nhận các ký tự 0-9, A-F.");
      hideResult();
      return;
    }

    // Decode
    try {
      const decoded = decodeHex(input);
      showResult(decoded);
      hideError();
    } catch (e) {
      showError("Đã xảy ra lỗi khi giải mã.");
    }
  }

  function showResult(text) {
    textOutput.value = text;
    resultSection.classList.remove("hidden");

    // Check if it's a URL
    if (isValidUrl(text)) {
      openLinkBtn.href = text;
      openLinkBtn.classList.remove("hidden");
    } else {
      openLinkBtn.classList.add("hidden");
    }

    // Auto-scroll to result on mobile
    if (window.innerWidth < 768) {
      resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function hideResult() {
    resultSection.classList.add("hidden");
  }

  function clearAll() {
    hexInput.value = "";
    textOutput.value = "";
    hideResult();
    hideError();
    hexInput.focus();
  }

  function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.style.display = "block";
    hexInput.style.borderColor = "var(--error)";
    // Shake animation
    hexInput.parentElement.classList.add("shake");
    setTimeout(() => hexInput.parentElement.classList.remove("shake"), 500);
  }

  function hideError() {
    errorMsg.style.display = "none";
    hexInput.style.borderColor = "var(--border-color)";
  }

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      hexInput.value = text;
      hexInput.focus();
      // Automatically try to convert if valid length
      if (text.length > 0) handleConversion();
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
      showToast("Không thể truy cập clipboard", true);
    }
  }

  async function handleCopy() {
    if (!textOutput.value) return;

    try {
      await navigator.clipboard.writeText(textOutput.value);
      showToast("Đã sao chép!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      showToast("Lỗi khi sao chép", true);
    }
  }

  function showToast(msg, isError = false) {
    toast.textContent = msg;
    toast.style.backgroundColor = isError ? "var(--error)" : "var(--success)";
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }
});
