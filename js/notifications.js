document.addEventListener('DOMContentLoaded', function() {
    // Get the notification bell button
    const notificationBtn = document.querySelector('.header-icon-btn .fa-bell').parentElement;
    
    // Create notification dropdown if it doesn't exist
    if (!document.querySelector('.notifications-dropdown')) {
        createNotificationDropdown();
    }
    
    // Toggle notification dropdown when bell icon is clicked
    notificationBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const dropdown = document.querySelector('.notifications-dropdown');
        dropdown.classList.toggle('show');
        
        // Close dropdown when clicking outside
        if (dropdown.classList.contains('show')) {
            document.addEventListener('click', closeDropdownOnClickOutside);
        } else {
            document.removeEventListener('click', closeDropdownOnClickOutside);
        }
    });
    
    // Function to close dropdown when clicking outside
    function closeDropdownOnClickOutside(e) {
        const dropdown = document.querySelector('.notifications-dropdown');
        if (!dropdown.contains(e.target) && !e.target.closest('.header-icon-btn')) {
            dropdown.classList.remove('show');
            document.removeEventListener('click', closeDropdownOnClickOutside);
        }
    }
    
    // Function to create notification dropdown
    function createNotificationDropdown() {
        // Create dropdown container
        const dropdown = document.createElement('div');
        dropdown.className = 'notifications-dropdown';
        
        // Add header
        const header = document.createElement('div');
        header.className = 'notifications-header';
        header.innerHTML = `
            <h5 class="notifications-title">Notifications</h5>
            <a href="#" class="text-muted small">Mark all as read</a>
        `;
        dropdown.appendChild(header);
        
        // Add notification list
        const list = document.createElement('ul');
        list.className = 'notifications-list';
        
        // Sample notifications
        const notifications = [
            {
                icon: 'tag',
                text: 'Special 20% discount on Bali tours this weekend!',
                time: '2 hours ago',
                unread: true
            },
            {
                icon: 'calendar-check',
                text: 'Your booking for Maldives Paradise Escape has been confirmed.',
                time: '1 day ago',
                unread: true
            },
            {
                icon: 'star',
                text: 'New tour package available: Swiss Alps Adventure',
                time: '3 days ago',
                unread: false
            }
        ];
        
        // Add notifications to list
        notifications.forEach(notification => {
            const item = document.createElement('li');
            item.className = `notification-item ${notification.unread ? 'unread' : ''}`;
            item.innerHTML = `
                <div class="notification-icon">
                    <i class="fas fa-${notification.icon}"></i>
                </div>
                <div class="notification-content">
                    <p class="notification-text">${notification.text}</p>
                    <p class="notification-time">${notification.time}</p>
                </div>
                ${notification.unread ? '<span class="notification-dot"></span>' : ''}
            `;
            list.appendChild(item);
        });
        
        dropdown.appendChild(list);
        
        // Add footer
        const footer = document.createElement('div');
        footer.className = 'notifications-footer';
        footer.innerHTML = '<a href="#">View all notifications</a>';
        dropdown.appendChild(footer);
        
        // Append dropdown to notification button
        const notificationBtn = document.querySelector('.header-icon-btn .fa-bell').parentElement;
        notificationBtn.style.position = 'relative';
        notificationBtn.appendChild(dropdown);
    }
});