const dropZone = document.getElementById('drop-zone');
const bulkInput = document.getElementById('bulk-input');
const progressDiv = document.getElementById('upload-progress');

// Prevent default behaviors for drag-and-drop
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, e => {
        e.preventDefault();
        e.stopPropagation();
    }, false);
});

// Highlight drop zone on hover
dropZone.addEventListener('dragover', () => dropZone.classList.add('highlight'));
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('highlight'));

// Handle dropped files
dropZone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    handleUpload(files);
});

// Handle button selection
bulkInput.addEventListener('change', () => {
    handleUpload(bulkInput.files);
});

async function handleUpload(files) {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }

    progressDiv.innerHTML = `<p>🚀 Syncing ${files.length} nodes to the cloud...</p>`;

    try {
        const response = await fetch('/api/beats/bulk', {
            method: 'POST',
            body: formData
            // Note: Don't set Content-Type header, the browser will set it for FormData
        });

        const result = await response.json();
        progressDiv.innerHTML = `<p class="success">✅ ${result.uploaded} beats auto-monetized with AI!</p>`;
    } catch (err) {
        progressDiv.innerHTML = `<p class="error">❌ Upload failed. Check server node.</p>`;
    }
}
