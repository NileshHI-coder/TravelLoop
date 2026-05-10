class ChecklistManager {
    static CATEGORIES = ['essentials', 'clothing', 'toiletries', 'electronics'];

    static init() {
        this.attachEventListeners();
        this.loadTripChecklist();
        this.updateTripTitle();
    }

    static attachEventListeners() {
        document.getElementById('addItemBtn').addEventListener('click', () => this.addItem());
        document.getElementById('newItem').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addItem();
        });
    }

    static updateTripTitle() {
        const tripId = sessionStorage.getItem('currentTripId');
        const trip = Trips.getAllTrips().find(t => t.id === tripId);
        if (trip) {
            document.getElementById('checklistTripTitle').textContent = `${trip.name} - Packing List`;
        }
    }

    static loadTripChecklist() {
        const tripId = sessionStorage.getItem('currentTripId');
        const trip = Trips.getAllTrips().find(t => t.id === tripId);
        const checklist = trip?.checklist || [];

        this.CATEGORIES.forEach(category => {
            const items = checklist.filter(item => item.category === category);
            this.renderCategory(category, items);
        });

        this.updateProgress(checklist);
    }

    static addItem() {
        const input = document.getElementById('newItem');
        const itemText = input.value.trim();
        if (!itemText) return;

        const tripId = sessionStorage.getItem('currentTripId');
        const trip = Trips.getAllTrips().find(t => t.id === tripId);
        if (!trip) return;

        const newItem = {
            id: Date.now().toString(),
            text: itemText,
            category: 'essentials', // Default category
            completed: false,
            createdAt: new Date().toISOString()
        };

        trip.checklist = trip.checklist || [];
        trip.checklist.push(newItem);
        Storage.set(Trips.TRIPS_KEY, Trips.getAllTrips());

        this.renderCategory('essentials', trip.checklist.filter(item => item.category === 'essentials'));
        this.updateProgress(trip.checklist);
        input.value = '';
    }

    static renderCategory(category, items) {
        const container = document.getElementById(`${category}List`);
        container.innerHTML = '';

        items.forEach(item => {
            const li = document.createElement('li');
            li.className = `checklist-item ${item.completed ? 'completed' : ''}`;
            li.dataset.itemId = item.id;
            li.innerHTML = `
                <div class="item-content">
                    <input type="checkbox" ${item.completed ? 'checked' : ''} 
                           onchange="ChecklistManager.toggleItem('${item.id}', '${category}')">
                    <span>${item.text}</span>
                </div>
                <button class="delete-btn" onclick="ChecklistManager.deleteItem('${item.id}')">
                    <i class="fas fa-times"></i>
                </button>
            `;
            container.appendChild(li);
        });
    }

    static toggleItem(itemId, category) {
        const tripId = sessionStorage.getItem('currentTripId');
        const trip = Trips.getAllTrips().find(t => t.id === tripId);
        const item = trip.checklist.find(i => i.id === itemId);
        
        if (item) {
            item.completed = !item.completed;
            Storage.set(Trips.TRIPS_KEY, Trips.getAllTrips());
            this.loadTripChecklist();
        }
    }

    static deleteItem(itemId) {
        const tripId = sessionStorage.getItem('currentTripId');
        const trip = Trips.getAllTrips().find(t => t.id === tripId);
        
        trip.checklist = trip.checklist.filter(i => i.id !== itemId);
        Storage.set(Trips.TRIPS_KEY, Trips.getAllTrips());
        this.loadTripChecklist();
    }

    static updateProgress(checklist) {
        const completed = checklist.filter(item => item.completed).length;
        const percentage = checklist.length > 0 ? Math.round((completed / checklist.length) * 100) : 0;
        
        document.getElementById('checklistProgress').textContent = `${percentage}%`;
        document.getElementById('checklistProgress').style.width = 'fit-content';
    }
}

// Initialize checklist
if (document.querySelector('.checklist-container')) {
    ChecklistManager.init();
}

// Global functions for onclick handlers
window.ChecklistManager = ChecklistManager;