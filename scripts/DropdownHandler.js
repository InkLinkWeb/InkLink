document.addEventListener('DOMContentLoaded', function() {
    const userMenuButton = document.getElementById('user-menu-button');
    const userMenu = document.getElementById('user-menu');

    userMenuButton.addEventListener('click', function() {
      // Toggle the hidden class to show or hide the dropdown menu
      userMenu.classList.toggle('hidden');
    });

    // Close the menu if the user clicks outside
    window.addEventListener('click', function(event) {
      if (!userMenuButton.contains(event.target) && !userMenu.contains(event.target)) {
        userMenu.classList.add('hidden');
      }
    });
});