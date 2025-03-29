document.addEventListener("DOMContentLoaded", function () {
    // Get today's date
    var today = new Date();
    var currentYear = today.getFullYear();
    var currentMonth = today.getMonth(); // 0-indexed (0 = January)
    var currentDate = today.getDate();
  
    // Update the month/year text (e.g., "March 2023")
    var monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    document.getElementById("monthYear").textContent =
      monthNames[currentMonth] + " " + currentYear;
  
    // Determine the number of days in the current month
    var daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
    // Get the first day of the month and adjust so that Monday is the first column.
    var firstDay = new Date(currentYear, currentMonth, 1);
    // JavaScript's getDay() returns 0 (Sunday) to 6 (Saturday). Adjust so Monday becomes index 0.
    var startIndex = (firstDay.getDay() + 6) % 7;
  
    var daysContainer = document.querySelector(".calendar .days");
  
    // Add blank spans for days before the first of the month
    for (var i = 0; i < startIndex; i++) {
      var emptySpan = document.createElement("span");
      emptySpan.textContent = "";
      daysContainer.appendChild(emptySpan);
    }
  
    // Populate the calendar with day numbers
    for (var d = 1; d <= daysInMonth; d++) {
      var daySpan = document.createElement("span");
      daySpan.classList.add("day");
      daySpan.textContent = d;
  
      // Highlight the current day
      if (d === currentDate) {
        daySpan.classList.add("current");
      }
  
      // When the user clicks on a date, redirect to the booking page.
      // The selected date is passed as query parameters.
      daySpan.addEventListener("click", function () {
        var selectedDay = this.textContent;
        window.location.href =
          "/payment.html?year=" +
          currentYear +
          "&month=" +
          (currentMonth + 1) +
          "&day=" +
          selectedDay;
      });
  
      daysContainer.appendChild(daySpan);
    }
  });
  