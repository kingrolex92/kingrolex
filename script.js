// WhatsApp Travel Booking SaaS - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Global variables
let liveUpdatesEnabled = true;
let currentSection = 'dashboard';
let updateInterval;
let fabMenuOpen = false;

// Sample data
const sampleBookings = [
    {
        id: 'BK001',
        customer: 'John Smith',
        phone: '+1-555-0101',
        route: 'New York - Boston',
        date: '2024-01-15',
        seats: ['A1', 'A2'],
        amount: 150,
        payment: 'Credit Card',
        status: 'confirmed'
    },
    {
        id: 'BK002',
        customer: 'Sarah Johnson',
        phone: '+1-555-0102',
        route: 'Boston - Washington DC',
        date: '2024-01-16',
        seats: ['B3'],
        amount: 85,
        payment: 'PayPal',
        status: 'pending'
    },
    {
        id: 'BK003',
        customer: 'Mike Davis',
        phone: '+1-555-0103',
        route: 'Philadelphia - New York',
        date: '2024-01-17',
        seats: ['C1', 'C2', 'C3'],
        amount: 225,
        payment: 'Bank Transfer',
        status: 'confirmed'
    },
    {
        id: 'BK004',
        customer: 'Emily Wilson',
        phone: '+1-555-0104',
        route: 'New York - Boston',
        date: '2024-01-18',
        seats: ['D4'],
        amount: 75,
        payment: 'Credit Card',
        status: 'cancelled'
    },
    {
        id: 'BK005',
        customer: 'David Brown',
        phone: '+1-555-0105',
        route: 'Boston - Washington DC',
        date: '2024-01-19',
        seats: ['E1', 'E2'],
        amount: 170,
        payment: 'WhatsApp Pay',
        status: 'confirmed'
    }
];

const sampleTrips = [
    {
        id: 'TR001',
        route: 'New York - Boston',
        date: '2024-01-15 08:00',
        bus: 'Bus #001 - Mercedes Sprinter',
        price: 75,
        occupancy: { occupied: 18, total: 30 },
        status: 'active'
    },
    {
        id: 'TR002',
        route: 'Boston - Washington DC',
        date: '2024-01-16 10:30',
        bus: 'Bus #002 - Volvo 9700',
        price: 85,
        occupancy: { occupied: 22, total: 35 },
        status: 'active'
    },
    {
        id: 'TR003',
        route: 'Philadelphia - New York',
        date: '2024-01-17 14:15',
        bus: 'Bus #003 - Scania Touring',
        price: 65,
        occupancy: { occupied: 12, total: 28 },
        status: 'scheduled'
    }
];

const sampleBuses = [
    {
        id: 'BUS001',
        number: 'Bus #001',
        model: 'Mercedes Sprinter',
        capacity: 30,
        status: 'active',
        seats: generateSeatMap(30)
    },
    {
        id: 'BUS002',
        number: 'Bus #002',
        model: 'Volvo 9700',
        capacity: 35,
        status: 'active',
        seats: generateSeatMap(35)
    },
    {
        id: 'BUS003',
        number: 'Bus #003',
        model: 'Scania Touring',
        capacity: 28,
        status: 'maintenance',
        seats: generateSeatMap(28)
    }
];

const sampleRoutes = [
    {
        id: 'RT001',
        origin: 'New York',
        destination: 'Boston',
        distance: '215 miles',
        duration: '4h 30m',
        price: 75,
        activeTrips: 2
    },
    {
        id: 'RT002',
        origin: 'Boston',
        destination: 'Washington DC',
        distance: '440 miles',
        duration: '7h 15m',
        price: 85,
        activeTrips: 1
    },
    {
        id: 'RT003',
        origin: 'Philadelphia',
        destination: 'New York',
        distance: '95 miles',
        duration: '2h 15m',
        price: 65,
        activeTrips: 1
    }
];

// Initialize the application
function initializeApp() {
    setupEventListeners();
    loadDashboardData();
    startLiveUpdates();
    animateStatNumbers();
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => switchSection(item.dataset.section));
    });

    // Live updates toggle
    const liveUpdatesToggle = document.getElementById('liveUpdates');
    if (liveUpdatesToggle) {
        liveUpdatesToggle.addEventListener('change', toggleLiveUpdates);
    }

    // Modal close events
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeAllModals();
        }
    });

    // FAB menu toggle
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.fab-container')) {
            closeFabMenu();
        }
    });

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Filter functionality
    const filterSelect = document.querySelector('.filter-select');
    if (filterSelect) {
        filterSelect.addEventListener('change', handleFilter);
    }
}

// Switch between sections
function switchSection(sectionId) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

    // Update content
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');

    // Update page title
    const pageTitle = document.querySelector('.page-title');
    const sectionTitles = {
        'dashboard': 'Dashboard',
        'whatsapp': 'WhatsApp Bot',
        'trips': 'Trip Management',
        'bookings': 'Booking Management',
        'fleet': 'Fleet Management',
        'routes': 'Routes Management',
        'monitoring': 'System Monitoring',
        'api-docs': 'API Documentation',
        'reports': 'Reports & Analytics'
    };
    pageTitle.textContent = sectionTitles[sectionId] || 'Dashboard';

    currentSection = sectionId;

    // Load section-specific data
    loadSectionData(sectionId);
}

// Load section-specific data
function loadSectionData(sectionId) {
    switch(sectionId) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'trips':
            loadTripsData();
            break;
        case 'bookings':
            loadBookingsData();
            break;
        case 'fleet':
            loadFleetData();
            break;
        case 'routes':
            loadRoutesData();
            break;
        default:
            break;
    }
}

// Load dashboard data
function loadDashboardData() {
    loadRecentBookings();
    updateSystemStatus();
}

// Load recent bookings table
function loadRecentBookings() {
    const tableBody = document.getElementById('recentBookingsTable');
    if (!tableBody) return;

    const recentBookings = sampleBookings.slice(0, 5);
    tableBody.innerHTML = recentBookings.map(booking => `
        <tr>
            <td><strong>${booking.id}</strong></td>
            <td>${booking.customer}</td>
            <td>${booking.route}</td>
            <td>${formatDate(booking.date)}</td>
            <td>$${booking.amount}</td>
            <td><span class="status-badge ${booking.status}">${booking.status}</span></td>
        </tr>
    `).join('');
}

// Update system status
function updateSystemStatus() {
    // This would typically fetch real status data
    const statusItems = document.querySelectorAll('.status-item');
    statusItems.forEach((item, index) => {
        const indicator = item.querySelector('.status-indicator');
        const value = item.querySelector('.status-value');
        
        // Simulate random status updates for demo
        if (Math.random() > 0.9) {
            const statuses = ['online', 'warning', 'offline'];
            const statusTexts = ['Online', 'Degraded', 'Offline'];
            const randomStatus = Math.floor(Math.random() * statuses.length);
            
            indicator.className = `status-indicator ${statuses[randomStatus]}`;
            value.textContent = statusTexts[randomStatus];
            value.style.color = statuses[randomStatus] === 'online' ? '#10b981' : 
                               statuses[randomStatus] === 'warning' ? '#f59e0b' : '#ef4444';
        }
    });
}

// Load trips data
function loadTripsData() {
    const tripsGrid = document.getElementById('tripsGrid');
    if (!tripsGrid) return;

    tripsGrid.innerHTML = sampleTrips.map(trip => `
        <div class="trip-card">
            <div class="trip-header">
                <div class="trip-route">${trip.route}</div>
                <div class="trip-details">
                    <span>${formatDateTime(trip.date)}</span>
                    <span>$${trip.price}</span>
                </div>
            </div>
            <div class="trip-body">
                <div class="seat-occupancy">
                    <div class="occupancy-label">
                        <span>Seat Occupancy</span>
                        <span>${trip.occupancy.occupied}/${trip.occupancy.total}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(trip.occupancy.occupied / trip.occupancy.total) * 100}%"></div>
                    </div>
                </div>
                <div style="margin-bottom: 1rem;">
                    <strong>Bus:</strong> ${trip.bus}
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="status-badge ${trip.status}">${trip.status}</span>
                    <div>
                        <button class="btn btn-secondary" style="margin-right: 0.5rem; padding: 0.5rem 1rem;">Edit</button>
                        <button class="btn btn-primary" style="padding: 0.5rem 1rem;">View</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Load bookings data
function loadBookingsData() {
    const tableBody = document.getElementById('bookingsTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = sampleBookings.map(booking => `
        <tr>
            <td><strong>${booking.id}</strong></td>
            <td>${booking.customer}</td>
            <td>${booking.phone}</td>
            <td>${booking.route}</td>
            <td>${formatDate(booking.date)}</td>
            <td>${booking.seats.join(', ')}</td>
            <td>$${booking.amount}</td>
            <td>${booking.payment}</td>
            <td><span class="status-badge ${booking.status}">${booking.status}</span></td>
            <td>
                <button class="btn btn-secondary" style="padding: 0.5rem; margin-right: 0.25rem;">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-primary" style="padding: 0.5rem; margin-right: 0.25rem;">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-success" style="padding: 0.5rem;">
                    <i class="fas fa-ticket-alt"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Load fleet data
function loadFleetData() {
    const fleetGrid = document.getElementById('fleetGrid');
    if (!fleetGrid) return;

    fleetGrid.innerHTML = sampleBuses.map(bus => `
        <div class="bus-card">
            <div class="bus-header">
                <div class="bus-number">${bus.number}</div>
                <div class="bus-model">${bus.model}</div>
                <div style="margin-top: 0.5rem;">
                    <span class="status-badge ${bus.status}">${bus.status}</span>
                </div>
            </div>
            <div class="seat-map">
                ${generateSeatMapHTML(bus.seats)}
            </div>
            <div style="padding: 1.5rem; border-top: 1px solid #f1f5f9;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                    <span>Capacity:</span>
                    <strong>${bus.capacity} seats</strong>
                </div>
                <button class="btn btn-primary" style="width: 100%;">Manage Bus</button>
            </div>
        </div>
    `).join('');
}

// Load routes data
function loadRoutesData() {
    const routesContainer = document.getElementById('routesContainer');
    if (!routesContainer) return;

    routesContainer.innerHTML = sampleRoutes.map(route => `
        <div class="route-card">
            <div class="route-path">
                <div class="route-city">${route.origin}</div>
                <div class="route-arrow">→</div>
                <div class="route-city">${route.destination}</div>
            </div>
            <div class="route-info">
                <div class="route-detail">
                    <div class="route-detail-label">Distance</div>
                    <div class="route-detail-value">${route.distance}</div>
                </div>
                <div class="route-detail">
                    <div class="route-detail-label">Duration</div>
                    <div class="route-detail-value">${route.duration}</div>
                </div>
                <div class="route-detail">
                    <div class="route-detail-label">Price</div>
                    <div class="route-detail-value">$${route.price}</div>
                </div>
                <div class="route-detail">
                    <div class="route-detail-label">Active Trips</div>
                    <div class="route-detail-value">${route.activeTrips}</div>
                </div>
            </div>
            <div style="display: flex; gap: 1rem;">
                <button class="btn btn-secondary" style="flex: 1;">Edit Route</button>
                <button class="btn btn-primary" style="flex: 1;">View Trips</button>
            </div>
        </div>
    `).join('');
}

// Generate seat map for buses
function generateSeatMap(capacity) {
    const seats = [];
    for (let i = 1; i <= capacity; i++) {
        const row = String.fromCharCode(65 + Math.floor((i - 1) / 4));
        const seatNumber = ((i - 1) % 4) + 1;
        const seatId = row + seatNumber;
        
        seats.push({
            id: seatId,
            number: i,
            status: Math.random() > 0.6 ? 'occupied' : 'available'
        });
    }
    return seats;
}

// Generate seat map HTML
function generateSeatMapHTML(seats) {
    return seats.slice(0, 16).map(seat => `
        <div class="seat ${seat.status}" onclick="toggleSeat('${seat.id}')" title="Seat ${seat.id}">
            ${seat.id}
        </div>
    `).join('');
}

// Toggle seat selection
function toggleSeat(seatId) {
    const seatElement = event.target;
    if (seatElement.classList.contains('occupied')) return;
    
    if (seatElement.classList.contains('selected')) {
        seatElement.classList.remove('selected');
        seatElement.classList.add('available');
    } else {
        seatElement.classList.remove('available');
        seatElement.classList.add('selected');
    }
}

// Animate stat numbers
function animateStatNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(element => {
        const target = parseInt(element.dataset.target) || 0;
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (element.textContent.includes('$')) {
                element.textContent = '$' + Math.floor(current).toLocaleString();
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 20);
    });
}

// Toggle live updates
function toggleLiveUpdates() {
    liveUpdatesEnabled = !liveUpdatesEnabled;
    const indicator = document.querySelector('.live-indicator');
    
    if (liveUpdatesEnabled) {
        indicator.classList.add('active');
        startLiveUpdates();
    } else {
        indicator.classList.remove('active');
        if (updateInterval) {
            clearInterval(updateInterval);
        }
    }
}

// Start live updates
function startLiveUpdates() {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
    
    if (liveUpdatesEnabled) {
        updateInterval = setInterval(() => {
            updateRealTimeData();
        }, 5000); // Update every 5 seconds
    }
}

// Update real-time data
function updateRealTimeData() {
    if (!liveUpdatesEnabled) return;
    
    // Update stat numbers with small random changes
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(element => {
        const currentValue = parseInt(element.textContent.replace(/[^\d]/g, ''));
        const change = Math.floor(Math.random() * 10) - 5; // -5 to +5 change
        const newValue = Math.max(0, currentValue + change);
        
        if (element.textContent.includes('$')) {
            element.textContent = '$' + newValue.toLocaleString();
        } else {
            element.textContent = newValue.toLocaleString();
        }
    });
    
    // Update system status
    updateSystemStatus();
    
    // Update recent bookings if on dashboard
    if (currentSection === 'dashboard') {
        loadRecentBookings();
    }
}

// FAB menu functions
function toggleFabMenu() {
    const fabMenu = document.querySelector('.fab-menu');
    const fab = document.querySelector('.fab i');
    
    fabMenuOpen = !fabMenuOpen;
    
    if (fabMenuOpen) {
        fabMenu.classList.add('active');
        fab.style.transform = 'rotate(45deg)';
    } else {
        fabMenu.classList.remove('active');
        fab.style.transform = 'rotate(0deg)';
    }
}

function closeFabMenu() {
    const fabMenu = document.querySelector('.fab-menu');
    const fab = document.querySelector('.fab i');
    
    fabMenuOpen = false;
    fabMenu.classList.remove('active');
    fab.style.transform = 'rotate(0deg)';
}

// Modal functions
function openCreateTripModal() {
    const modal = document.getElementById('createTripModal');
    const overlay = document.getElementById('modalOverlay');
    
    modal.classList.add('active');
    overlay.classList.add('active');
    closeFabMenu();
}

function openCreateBookingModal() {
    // This would open a booking creation modal
    console.log('Opening booking creation modal...');
    closeFabMenu();
}

function openAddBusModal() {
    // This would open a bus addition modal
    console.log('Opening add bus modal...');
    closeFabMenu();
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('modalOverlay');
    
    modal.classList.remove('active');
    overlay.classList.remove('active');
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    document.getElementById('modalOverlay').classList.remove('active');
}

// Create trip function
function createTrip() {
    const route = document.getElementById('tripRoute').value;
    const bus = document.getElementById('tripBus').value;
    const date = document.getElementById('tripDate').value;
    const price = document.getElementById('tripPrice').value;
    
    if (!route || !bus || !date || !price) {
        alert('Please fill in all fields');
        return;
    }
    
    // Add trip to sample data
    const newTrip = {
        id: 'TR' + String(sampleTrips.length + 1).padStart(3, '0'),
        route: route,
        date: date,
        bus: bus,
        price: parseInt(price),
        occupancy: { occupied: 0, total: 30 },
        status: 'scheduled'
    };
    
    sampleTrips.push(newTrip);
    
    // Refresh trips display
    if (currentSection === 'trips') {
        loadTripsData();
    }
    
    // Close modal
    closeModal('createTripModal');
    
    // Show success message
    showNotification('Trip created successfully!', 'success');
}

// Search functionality
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const tableRows = document.querySelectorAll('#bookingsTableBody tr');
    
    tableRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Filter functionality
function handleFilter(event) {
    const filterValue = event.target.value.toLowerCase();
    const tableRows = document.querySelectorAll('#bookingsTableBody tr');
    
    tableRows.forEach(row => {
        if (filterValue === 'all status') {
            row.style.display = '';
        } else {
            const statusBadge = row.querySelector('.status-badge');
            const status = statusBadge ? statusBadge.textContent.toLowerCase() : '';
            row.style.display = status === filterValue ? '' : 'none';
        }
    });
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(notificationStyles);

// Export data function for reports
function exportData() {
    const data = {
        bookings: sampleBookings,
        trips: sampleTrips,
        buses: sampleBuses,
        routes: sampleRoutes,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `travel-booking-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Add export functionality to export buttons
document.addEventListener('click', (e) => {
    if (e.target.textContent === 'Export') {
        exportData();
    }
});

// WhatsApp Bot simulation
function simulateWhatsAppMessage() {
    const messages = [
        "New booking request from +1-555-0199",
        "Payment confirmed for booking BK006",
        "Trip reminder sent to 15 passengers",
        "Customer inquiry about route availability"
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    showNotification(`WhatsApp: ${randomMessage}`, 'info');
}

// Simulate WhatsApp messages every 30 seconds
setInterval(simulateWhatsAppMessage, 30000);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                switchSection('dashboard');
                break;
            case '2':
                e.preventDefault();
                switchSection('trips');
                break;
            case '3':
                e.preventDefault();
                switchSection('bookings');
                break;
            case 'n':
                e.preventDefault();
                openCreateTripModal();
                break;
        }
    }
});

console.log('🚀 WhatsApp Travel Booking SaaS System Initialized Successfully!');