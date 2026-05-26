const bookSelect = document.getElementById('book');
const chapterSelect = document.getElementById('chapter');
const verseSelect = document.getElementById('verse');
const previewDiv = document.getElementById('preview');
const sendBtn = document.getElementById('send-btn');
const statusDiv = document.getElementById('status');

const booksList = [
    "ఆదికాండము", "నిర్గమకాండము", "లేవీయకాండము", "సంఖ్యాకాండము", "ద్వితీయోపదేశకాండమ", "యెహొషువ",
    "న్యాయాధిపతులు", "రూతు", "సమూయేలు మొదటి గ్రంథము", "సమూయేలు రెండవ గ్రంథము", "రాజులు మొదటి గ్రంథము",
    "రాజులు రెండవ గ్రంథము", "దినవృత్తాంతములు మొదటి గ్రంథము", "దినవృత్తాంతములు రెండవ గ్రంథము", "ఎజ్రా", "నెహెమ్యా", "ఎస్తేరు", "యోబు గ్రంథము",
    "కీర్తనల గ్రంథము", "సామెతలు", "ప్రసంగి", "పరమగీతము", "యెషయా గ్రంథము", "యిర్మీయా", "విలాపవాక్యములు", "యెహెజ్కేలు",
    "దానియేలు", "హొషేయ", "యోవేలు", "ఆమోసు", "ఓబద్యా", "యోనా", "మీకా", "నహూము", "హబక్కూకు", "జెఫన్యా",
    "హగ్గయి", "జెకర్యా", "మలాకీ", "మత్తయి సువార్త", "మార్కు సువార్త", "లూకా సువార్త", "యోహాను సువార్త", "అపొస్తలుల కార్యములు",
    "రోమీయులకు", "1 కొరింథీయులకు", "2 కొరింథీయులకు", "గలతీయులకు", "ఎఫెసీయులకు", "ఫిలిప్పీయులకు",
    "కొలొస్సయులకు", "1 థెస్సలొనీకయులకు", "2 థెస్సలొనీకయులకు", "1 తిమోతికి", "2 తిమోతికి", "తీతుకు", "ఫిలేమోనుకు",
    "హెబ్రీయులకు", "యాకోబు", "1 పేతురు", "2 పేతురు", "1 యోహాను", "2 యోహాను", "3 యోహాను", "యూదా", "ప్రకటన గ్రంథము"
];

let bibleData = null;
let currentVerseText = "";

async function init() {
    try {
        const res = await fetch('bible.json');
        bibleData = await res.json();
        
        // Populate Books
        bibleData.Book.forEach((bookObj, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = booksList[index] || `Book ${index + 1}`;
            bookSelect.appendChild(option);
        });

        bookSelect.addEventListener('change', updateChapters);
        chapterSelect.addEventListener('change', updateVerses);
        verseSelect.addEventListener('change', updatePreview);
        
        updateChapters();
        sendBtn.disabled = false;
    } catch (e) {
        previewDiv.textContent = "Error loading bible data.";
        console.error(e);
    }
}

function updateChapters() {
    chapterSelect.innerHTML = '';
    const bookIndex = bookSelect.value;
    const chapters = bibleData.Book[bookIndex].Chapter;
    
    chapters.forEach((chapObj, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `Chapter ${index + 1}`;
        chapterSelect.appendChild(option);
    });
    
    updateVerses();
}

function updateVerses() {
    verseSelect.innerHTML = '';
    const bookIndex = bookSelect.value;
    const chapIndex = chapterSelect.value;
    const verses = bibleData.Book[bookIndex].Chapter[chapIndex].Verse;
    
    verses.forEach((verseObj, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `Verse ${index + 1}`;
        verseSelect.appendChild(option);
    });
    
    updatePreview();
}

function updatePreview() {
    const bookIndex = bookSelect.value;
    const chapIndex = chapterSelect.value;
    const verseIndex = verseSelect.value;
    
    const verseObj = bibleData.Book[bookIndex].Chapter[chapIndex].Verse[verseIndex];
    currentVerseText = verseObj.Verse;
    
    previewDiv.textContent = `"${currentVerseText}"`;
}

sendBtn.addEventListener('click', async () => {
    const payload = {
        bookName: booksList[bookSelect.value] || `Book ${parseInt(bookSelect.value)+1}`,
        chapter: parseInt(chapterSelect.value) + 1,
        verseNum: parseInt(verseSelect.value) + 1,
        verseText: currentVerseText
    };
    
    try {
        const res = await fetch('/set_verse', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        
        if(res.ok) {
            statusDiv.textContent = "Sent successfully!";
            statusDiv.style.color = "#4ade80";
            setTimeout(() => statusDiv.textContent = "", 2000);
        } else {
            statusDiv.textContent = "Error sending.";
            statusDiv.style.color = "red";
        }
    } catch (e) {
        statusDiv.textContent = "Connection error.";
        statusDiv.style.color = "red";
    }
});

init();
