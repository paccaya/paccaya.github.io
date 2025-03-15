// theme-toggle.js
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
const toggleButton = document.getElementById("theme-toggle");

const currentTheme = localStorage.getItem("theme");

if (currentTheme) {
    document.documentElement.setAttribute("data-theme", currentTheme);
    toggleButton.textContent = currentTheme === "dark" ? "Light Mode" : "Dark Mode";
} else {
    document.documentElement.setAttribute("data-theme", prefersDarkScheme ? "dark" : "light");
    toggleButton.textContent = prefersDarkScheme ? "Light Mode" : "Dark Mode";
}

toggleButton.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    toggleButton.textContent = newTheme === "dark" ? "Light Mode" : "Dark Mode";
    document.documentElement.offsetHeight; // Read property to trigger reflow
    document.documentElement.style.transition = "background-color 0.3s ease"; // Optional: smooth transition
});
