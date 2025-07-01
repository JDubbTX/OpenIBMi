
function setDarkMode(enabled) {
  if (enabled) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('darkMode', 'true');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', 'false');
  }
}

function toggleDarkMode() {
  const enabled = !document.documentElement.classList.contains('dark');
  setDarkMode(enabled);
}

// On page load, apply saved preference
document.addEventListener('DOMContentLoaded', () => {
  const darkMode = localStorage.getItem('darkMode') === 'true';
  setDarkMode(darkMode);

  // Optional: Add toggle button if not present
  if (!document.getElementById('darkModeToggle')) {
    const btn = document.createElement('button');
    btn.id = 'darkModeToggle';
    btn.innerText = 'Toggle Dark Mode';
    btn.onclick = toggleDarkMode;
    btn.style.position = 'fixed';
    btn.style.bottom = '1rem';
    btn.style.right = '1rem';
    document.body.appendChild(btn);
  }
});
