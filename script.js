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
            verseText.textContent = `"${data.verseText}"`;
            verseReference.textContent = `- ${newRef}`;
            currentVerseRef = newRef;
            
            // Optional: reset the marquee animation so it starts from the right again smoothly
            verseText.style.animation = 'none';
            verseText.offsetHeight; /* trigger reflow */
            verseText.style.animation = 'marquee 20s linear infinite';
        }
    } catch (error) {
        console.error('Error fetching current verse:', error);
    }
}

// Poll every 2 seconds
setInterval(pollVerse, 2000);

// Fetch initial verse immediately
pollVerse();
