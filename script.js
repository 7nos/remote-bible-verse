const verseText = document.getElementById('verse-text');
const verseReference = document.getElementById('verse-reference');

let currentVerseRef = '';

async function pollVerse() {
    try {
        const response = await fetch('/current_verse');
        if (!response.ok) return;
        const data = await response.json();
        
        const newRef = `${data.bookName} ${data.chapter}:${data.verseNum}`;
        
        // Only update the DOM if the verse has actually changed
        if (newRef !== currentVerseRef) {
            verseText.textContent = data.verseText;
            verseReference.textContent = newRef;
            currentVerseRef = newRef;
        }
    } catch (error) {
        console.error('Error fetching current verse:', error);
    }
}

// Poll every 2 seconds
setInterval(pollVerse, 2000);

// Fetch initial verse immediately
pollVerse();
