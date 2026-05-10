class NotesManager {
    static init() {
        this.attachEventListeners();
        this.loadTripNotes();
        this.updateTripTitle();
    }

    static attachEventListeners() {
        document.getElementById('addNoteBtn').addEventListener('click', () => this.addNote());
        document.getElementById('newNote').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) this.addNote();
        });
    }

    static updateTripTitle() {
        const tripId = sessionStorage.getItem('currentTripId');
        const trip = Trips.getAllTrips().find(t => t.id === tripId);
        if (trip) {
            document.getElementById('notesTripTitle').textContent = `${trip.name} - Journal`;
        }
    }

    static loadTripNotes() {
        const tripId = sessionStorage.getItem('currentTripId');
        const trip = Trips.getAllTrips().find(t => t.id === tripId);
        const notes = trip?.notes || [];

        const container = document.getElementById('notesList');
        container.innerHTML = '';

        notes.forEach(note => {
            const noteCard = this.createNoteCard(note);
            container.appendChild(noteCard);
        });
    }

    static createNoteCard(note) {
        const card = document.createElement('div');
        card.className = 'note-card glass';
        card.dataset.noteId = note.id;
        
        const date = new Date(note.createdAt).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        card.innerHTML = `
            <div class="note-header">
                <span class="note-date">${date}</span>
                <div class="note-actions">
                    <button onclick="NotesManager.editNote('${note.id}')" class="btn btn-sm btn-secondary">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="NotesManager.deleteNote('${note.id}')" class="btn btn-sm btn-danger">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="note-content">${this.nl2br(note.content)}</div>
        `;
        return card;
    }

    static addNote() {
        const textarea = document.getElementById('newNote');
        const content = textarea.value.trim();
        if (!content) return;

        const tripId = sessionStorage.getItem('currentTripId');
        const trip = Trips.getAllTrips().find(t => t.id === tripId);
        if (!trip) return;

        const newNote = {
            id: Date.now().toString(),
            content: content,
            createdAt: new Date().toISOString()
        };

        trip.notes = trip.notes || [];
        trip.notes.unshift(newNote);
        Storage.set(Trips.TRIPS_KEY, Trips.getAllTrips());

        this.loadTripNotes();
        textarea.value = '';
    }

    static editNote(noteId) {
        const tripId = sessionStorage.getItem('currentTripId');
        const trip = Trips.getAllTrips().find(t => t.id === tripId);
        const note = trip.notes.find(n => n.id === noteId);
        
        if (note) {
            const newContent = prompt('Edit note:', note.content);
            if (newContent !== null && newContent.trim()) {
                note.content = newContent.trim();
                Storage.set(Trips.TRIPS_KEY, Trips.getAllTrips());
                this.loadTripNotes();
            }
        }
    }

    static deleteNote(noteId) {
        if (!confirm('Delete this note?')) return;

        const tripId = sessionStorage.getItem('currentTripId');
        const trip = Trips.getAllTrips().find(t => t.id === tripId);
        
        trip.notes = trip.notes.filter(n => n.id !== noteId);
        Storage.set(Trips.TRIPS_KEY, Trips.getAllTrips());
        this.loadTripNotes();
    }

    static nl2br(str) {
        return str.replace(/\n/g, '<br>');
    }
}

// Initialize notes
if (document.querySelector('.notes-container')) {
    NotesManager.init();
}

// Global functions
window.NotesManager = NotesManager;