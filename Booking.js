document.addEventListener('DOMContentLoaded', () => {
    // This ensures the DOM is fully loaded before trying to access elements
    console.log('script.js loaded and DOM is ready!');

    const defaultActiveButton = document.querySelector('.duration-button.active');
    if (defaultActiveButton) {
        const defaultMonths = parseInt(defaultActiveButton.dataset.months);
        renderCalendars(defaultMonths);
    } else {
        renderCalendars(6); // Fallback to 6 months if no active button
    }

    // Corrected selector: Use the class 'generate-payment-link-btn' from the HTML
    const generateButton = document.querySelector('.generate-payment-link-btn');

    if (generateButton) {
        generateButton.addEventListener('click', () => {
            // 1. Collect all form data
            const property = document.getElementById('propertySelect').value;
            const checkinDate = document.getElementById('checkin-date').value;
            const checkinTime = document.getElementById('checkin-time').value;
            const checkoutDate = document.getElementById('checkout-date').value;
            const checkoutTime = document.getElementById('checkout-time').value;
            const adults = document.getElementById('adults-select').value;
            const children = document.getElementById('children-select').value;
            const bookingStatus = document.getElementById('booking-status-select').value;
            const paymentMethod = document.getElementById('payment-method-select').value;
            const customerEmail = document.getElementById('customer-email').value;
            const customerInfo = document.getElementById('customer-info').value;
            const customRate = document.getElementById('custom-rate-input').value;
            const closeRoom = document.getElementById('close-room-toggle').checked;

            // 2. Create an object to easily convert to URL parameters
            const bookingDetails = {
                property: property,
                checkin_date: checkinDate,
                checkin_time: checkinTime,
                checkout_date: checkoutDate,
                checkout_time: checkoutTime,
                adults: adults,
                children: children,
                booking_status: bookingStatus,
                payment_method: paymentMethod,
                customer_email: customerEmail,
                customer_info: customerInfo,
                custom_rate: customRate,
                close_room: closeRoom ? 'true' : 'false' // Store boolean as string
            };

            // 3. Convert the object to URL query parameters
            const queryParams = new URLSearchParams(bookingDetails).toString();

            // 4. Construct the full "booking link"
            // Use window.location.origin to get the base URL of your current page
            // Or you can specify a fixed base URL like 'https://yourwebsite.com/booking-form'
            const baseUrl = window.location.origin + window.location.pathname; // Gets current page URL without existing query params
            const generatedLink = `${baseUrl}?${queryParams}`;

            // 5. Display the link and copy to clipboard
            const outputDiv = document.getElementById('linkOutput');
            outputDiv.innerHTML = `
                <p style="color: #64B5F6; margin-bottom: 5px;">Link Generated:</p>
                <div style="background-color: #333; padding: 20px; border-radius: 5px; word-break: break-all; font-family: monospace; font-size: 0.9em; position: relative;">
                    <span id="generatedLinkText">${generatedLink}</span>
                    <button id="copyButton" style="position: absolute; right: 5px; top: 100%; transform: translateY(-50%); background-color: #555; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Copy</button>
                </div>
                <p id="copiedMessage" style="color: #4CAF50; margin-top: 10px; opacity: 0; transition: opacity 0.3s ease;">Copied!</p>
            `;

            // Attach event listener to the newly created copy button
            document.getElementById('copyButton').addEventListener('click', async () => {
                const linkText = document.getElementById('generatedLinkText').innerText;
                const copiedMessage = document.getElementById('copiedMessage');

                try {
                    await navigator.clipboard.writeText(linkText);
                    copiedMessage.style.opacity = 1; // Show "Copied!" message
                    setTimeout(() => {
                        copiedMessage.style.opacity = 0; // Hide after a delay
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy text: ', err);
                    // Fallback for older browsers or if permission is denied
                    // You might want to show a more user-friendly error or prompt them to copy manually
                    alert('Failed to copy link. Please manually copy: \n' + linkText);
                }
            });
        });
    }
});

const calendarContainer = document.getElementById('calendarContainer');
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Data for highlights
// Storing dates as 'YYYY-MM-DD' for easy comparison
const highlightedDates = {
    '2025-07-01': 'blue',
    '2025-07-02': 'blue',
    '2025-07-03': 'blue',
    '2025-07-04': 'blue',
    '2025-07-05': 'blue',
    '2025-08-24': 'red',
    '2025-09-26': 'red',
    '2025-09-27': 'red',
};

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
}

function createCalendarCard(year, month) {
    const card = document.createElement('div');
    card.classList.add('calendar-card');

    const monthHeader = document.createElement('div');
    monthHeader.classList.add('month-header');
    monthHeader.textContent = `${months[month]} ${year}`;
    card.appendChild(monthHeader);

    const weekdaysDiv = document.createElement('div');
    weekdaysDiv.classList.add('weekdays');
    weekdays.forEach(day => {
        const dayName = document.createElement('div');
        dayName.textContent = day;
        weekdaysDiv.appendChild(dayName);
    });
    card.appendChild(weekdaysDiv);

    const daysGrid = document.createElement('div');
    daysGrid.classList.add('days-grid');

    const firstDayIndex = getFirstDayOfMonth(year, month);
    const daysInMonth = getDaysInMonth(year, month);

    // Add empty cells for days before the 1st
    for (let i = 0; i < firstDayIndex; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('day-cell', 'empty');
        daysGrid.appendChild(emptyCell);
    }

    // Add day cells
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('day-cell');
        dayCell.textContent = String(day).padStart(2, '0');

        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (highlightedDates[dateString]) {
            dayCell.classList.add(`highlight-${highlightedDates[dateString]}`);
        }

        dayCell.addEventListener('click', () => {
            console.log(`Clicked on: ${dateString}`);
        });

        daysGrid.appendChild(dayCell);
    }

    card.appendChild(daysGrid);
    return card;
}

function renderCalendars(numberOfMonths) {
    calendarContainer.innerHTML = '';

    // Fixed start date based on the image's July 2025 calendar
    let currentYear = 2025;
    let currentMonth = 6;

    for (let i = 0; i < numberOfMonths; i++) {
        calendarContainer.appendChild(createCalendarCard(currentYear, currentMonth));

        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
    }
}

// Duration buttons
document.querySelectorAll('.duration-button').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.duration-button').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        const monthsToShow = parseInt(this.dataset.months);
        renderCalendars(monthsToShow);
    });
});