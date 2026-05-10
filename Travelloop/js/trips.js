// Trip management system
class Trips {
    static TRIPS_KEY = 'traveloop_trips';

    static init() {
        this.loadSampleData();
        this.renderTrips();
        this.updateDashboardStats();
        this.handleTripForms();
        this.handleTripNavigation();
    }

    static loadSampleData() {
        if (!Storage.get(this.TRIPS_KEY)) {
            const sampleTrips = [
                {
                    id: '1',
                    name: 'Paris Summer Escape',
                    destination: 'Paris, France',
                    startDate: '2024-07-15',
                    endDate: '2024-07-22',
                    budget: 2500,
                    description: 'Romantic getaway to the city of love',
                    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: '2',
                    name: 'Tokyo Adventure',
                    destination: 'Tokyo, Japan',
                    startDate: '2024-08-10',
                    endDate: '2024-08-20',
                    budget: 4500,
                    description: 'Exploring modern Japan and ancient traditions',
                    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
                }
            ];
            Storage.set(this.TRIPS_KEY, sampleTrips);
        }
    }

    static getAllTrips() {
        return Storage.get(this.TRIPS_KEY, []);
    }

    static createTrip(tripData) {
        const trips = this.getAllTrips();
        const newTrip = {
            id: Date.now().toString(),
            ...tripData,
            createdAt: new Date().toISOString(),
            itinerary: [],
            budgetDetails: {
                hotel: 0,
                food: 0,
                transport: 0,
                activities: 0,
                total: 0
            },
            checklist: [],
            notes: []
        };
        trips.unshift(newTrip);
        Storage.set(this.TRIPS_KEY, trips);
        return newTrip;
    }

    static deleteTrip(tripId) {
        const trips = this.getAllTrips().filter(trip => trip.id !== tripId);
        Storage.set(this.TRIPS_KEY, trips);
        this.renderTrips();
        this.updateDashboardStats();
    }

    static renderTrips(containerId = 'tripsList') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const trips = this.getAllTrips();
        container.innerHTML = '';

        trips.forEach(trip => {
            const tripCard = this.createTripCard(trip);
            container.appendChild(tripCard);
        });
    }

    static createTripCard(trip) {
        const card = document.createElement('div');
        card.className = 'trip-card glass fade-in-up';
        card.dataset.tripId = trip.id;
        
        const days = Math.ceil(
            (new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)
        );

        card.innerHTML = `
            <h3>${trip.name}</h3>
            <div class="trip-meta">
                <span><i class="fas fa-map-marker-alt"></i> ${trip.destination}</span>
                <span><i class="fas fa-calendar"></i> ${days} days</span>
                ${trip.budget ? `<span><i class="fas fa-dollar-sign"></i> $${trip.budget.toLocaleString()}</span>` : ''}
            </div>
            <p class="trip-description">${trip.description || 'No description'}</p>
            <div class="trip-actions">
                <button class="btn btn-primary btn-sm" onclick="Trips.viewTrip('${trip.id}')">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="btn btn-secondary btn-sm" onclick="Trips.editTrip('${trip.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger btn-sm" onclick="Trips.deleteTrip('${trip.id}')">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="btn btn-secondary btn-sm" onclick="Trips.shareTrip('${trip.id}')">
                    <i class="fas fa-share"></i>
                </button>
            </div>
        `;
        return card;
    }

    static handleTripForms() {
        const form = document.getElementById('createTripForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = {
                    name: document.getElementById('tripName').value,
                    destination: document.getElementById('destination').value,
                    startDate: document.getElementById('startDate').value,
                    endDate: document.getElementById('endDate').value,
                    budget: parseFloat(document.getElementById('budget').value) || 0,
                    description: document.getElementById('description').value
                };

                this.createTrip(formData);
                window.location.href = 'dashboard.html';
            });
        }
    }

    static updateDashboardStats() {
        const trips = this.getAllTrips();
        const totalBudget = trips.reduce((sum, trip) => sum + (trip.budget || 0), 0);

        document.getElementById('totalTrips').textContent = trips.length;
        document.getElementById('totalBudget').textContent = `$${totalBudget.toLocaleString()}`;
    }

    static viewTrip(tripId) {
        sessionStorage.setItem('currentTripId', tripId);
        window.location.href = 'itinerary.html';
    }

    static shareTrip(tripId) {
        const trip = this.getAllTrips().find(t => t.id === tripId);
        if (trip) {
            const shareUrl = `${window.location.origin}/shared-trip.html?id=${tripId}`;
            navigator.clipboard.writeText(shareUrl).then(() => {
                alert('Share link copied to clipboard!');
            });
        }
    }
}

// Expose to global scope for onclick handlers
window.Trips = Trips;