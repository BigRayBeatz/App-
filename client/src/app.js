async function generateAISalesCopy(title, mood, bpm) {
    const output = document.getElementById('ai-copy-output');
    output.style.display = 'block';
    output.innerText = "Writing your viral post...";

    const data = await apiRequest('/api/ai/generate-marketing', {
        method: 'POST',
        body: JSON.stringify({ title, mood, bpm })
    });

    if (data) {
        output.innerHTML = `
            <p>${data.copy}</p>
            <button onclick="navigator.clipboard.writeText('${data.copy}')">📋 Copy to Clipboard</button>
        `;
    }
}
