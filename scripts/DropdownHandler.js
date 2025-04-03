import { logout } from '/InkLink/scripts/AccountHandler.js';
document.addEventListener('DOMContentLoaded', function() {
  const userMenuButton = document.getElementById('user-menu-button');
  const userMenu = document.getElementById('user-menu');
  const signOutLink = document.getElementById('signout-button');

  // Toggle dropdown menu visibility
  userMenuButton.addEventListener('click', function() {
      userMenu.classList.toggle('hidden');
  });

  // Close the menu if the user clicks outside
  window.addEventListener('click', function(event) {
      if (!userMenuButton.contains(event.target) && !userMenu.contains(event.target)) {
          userMenu.classList.add('hidden');
      }
  });

  // Sign out functionality
  signOutLink.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent the default anchor link behavior
      logout(); // Call the logout function
  });
});
