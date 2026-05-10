class BudgetManager {
    static init() {
        this.attachEventListeners();
        this.loadTripBudget();
    }

    static attachEventListeners() {
        const inputs = ['hotelCost', 'foodCost', 'transportCost', 'activitiesCost'];
        inputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => this.calculateTotal());
            }
        });

        // Save budget on change
        document.querySelector('.budget-inputs').addEventListener('change', () => {
            this.saveTripBudget();
        });
    }

    static loadTripBudget() {
        const tripId = sessionStorage.getItem('currentTripId');
        if (!tripId) return;

        const trip = Trips.getAllTrips().find(t => t.id === tripId);
        if (trip && trip.budgetDetails) {
            document.getElementById('hotelCost').value = trip.budgetDetails.hotel || 0;
            document.getElementById('foodCost').value = trip.budgetDetails.food || 0;
            document.getElementById('transportCost').value = trip.budgetDetails.transport || 0;
            document.getElementById('activitiesCost').value = trip.budgetDetails.activities || 0;
            this.calculateTotal();
        }
    }

    static calculateTotal() {
        const hotel = parseFloat(document.getElementById('hotelCost').value) || 0;
        const food = parseFloat(document.getElementById('foodCost').value) || 0;
        const transport = parseFloat(document.getElementById('transportCost').value) || 0;
        const activities = parseFloat(document.getElementById('activitiesCost').value) || 0;
        
        const total = hotel + food + transport + activities;
        document.getElementById('totalCost').textContent = total.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        this.updateProgress(total);
    }

    static updateProgress(total) {
        const tripId = sessionStorage.getItem('currentTripId');
        const trip = Trips.getAllTrips().find(t => t.id === tripId);
        const budget = trip?.budget || 0;
        
        const percentage = budget > 0 ? Math.min((total / budget) * 100, 100) : 0;
        const progressFill = document.getElementById('progressFill');
        const remainingEl = document.getElementById('budgetRemaining');
        
        progressFill.style.width = percentage + '%';
        progressFill.className = `progress-fill ${percentage > 90 ? 'over-budget' : ''}`;
        
        if (budget > 0) {
            const remaining = budget - total;
            remainingEl.textContent = remaining >= 0 
                ? `$${remaining.toLocaleString()} remaining` 
                : `Over by $${Math.abs(remaining).toLocaleString()}`;
        }
    }

    static saveTripBudget() {
        const tripId = sessionStorage.getItem('currentTripId');
        const trips = Trips.getAllTrips();
        const tripIndex = trips.findIndex(t => t.id === tripId);
        
        if (tripIndex !== -1) {
            trips[tripIndex].budgetDetails = {
                hotel: parseFloat(document.getElementById('hotelCost').value) || 0,
                food: parseFloat(document.getElementById('foodCost').value) || 0,
                transport: parseFloat(document.getElementById('transportCost').value) || 0,
                activities: parseFloat(document.getElementById('activitiesCost').value) || 0,
                total: parseFloat(document.getElementById('totalCost').textContent.replace(/,/g, '')) || 0
            };
            Storage.set(Trips.TRIPS_KEY, trips);
        }
    }
}

// Initialize budget manager
if (document.querySelector('.budget-container')) {
    BudgetManager.init();
}