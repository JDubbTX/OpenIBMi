// Dark mode toggle for Tailwind CSS (class-based)
document.addEventListener('DOMContentLoaded', function () {
  console.log('Dark mode toggle script loaded');
  const toggle = document.getElementById('dark-mode-toggle');
  const toggleMobile = document.getElementById('dark-mode-toggle-mobile');
  
  if (!toggle && !toggleMobile) {
    console.log('Dark mode toggle buttons not found');
    return;
  }
  
  console.log('Dark mode toggle buttons found');
  
  function toggleDarkMode() {
    console.log('Dark mode toggle clicked');
    document.documentElement.classList.toggle('dark');
    console.log('Dark class toggled. Classes:', document.documentElement.className);
    
    // Save preference
    if (document.documentElement.classList.contains('dark')) {
      localStorage.setItem('theme', 'dark');
      console.log('Set theme to dark');
    } else {
      localStorage.setItem('theme', 'light');
      console.log('Set theme to light');
    }
  }
  
  // Add event listeners to both buttons if they exist
  if (toggle) {
    toggle.addEventListener('click', toggleDarkMode);
  }
  
  if (toggleMobile) {
    toggleMobile.addEventListener('click', toggleDarkMode);
  }

  // On load, respect saved preference
  if (localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    console.log('Applied dark theme on load');
  } else {
    document.documentElement.classList.remove('dark');
    console.log('Applied light theme on load');
  }
});
