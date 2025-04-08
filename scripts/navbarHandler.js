import { logout } from '/InkLink/scripts/AccountHandler.js';

// Ensure the script runs after the DOM is fully loaded
$(document).ready(function() {
    // Load the navbar HTML into the #navbar-container div
    $('#navbar-container').load('/InkLink/Navbar.html', function(response, status, xhr) {
        if (status === "error") {
            console.error("Error loading navbar: " + xhr.status + " " + xhr.statusText);
            return;
        }
        $('#navbar-container nav').css('background-color', '#181818');
        $('#navbar-container nav').css('top', '0');
        $('#navbar-container nav').css('position', 'sticky');
        // Once the navbar is loaded, initialize its functionalities
        initializeNavbar();
    });
});

// Function to initialize navbar functionalities
function initializeNavbar() {
    // Highlight the active navigation link
    // var currentPath = window.location.pathname.split('/').pop();
    // $('.nav-link').each(function() {
    //     var linkPath = $(this).attr('href').split('/').pop();
    //     if (currentPath === linkPath) {
    //         $(this).addClass('bg-[#5CB8E4] text-white');
    //     } else {
    //         $(this).addClass('text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium');
    //     }
    // });

    // Dropdown menu functionality
    var userMenuButton = $('#user-menu-button');
    var userMenu = $('#user-menu');

    // Toggle the dropdown menu when the button is clicked
    userMenuButton.on('click', function() {
        userMenu.toggleClass('hidden');
    });

    // Close the dropdown if the user clicks outside
    $(window).on('click', function(event) {
        if (!userMenuButton.is(event.target) && userMenuButton.has(event.target).length === 0 &&
            !userMenu.is(event.target) && userMenu.has(event.target).length === 0) {
            userMenu.addClass('hidden');
        }
    });

    // Sign out functionality
    $('#signout-button').on('click', function(event) {
        event.preventDefault();
        logout(); // Ensure the logout function is defined and accessible
    });
}
