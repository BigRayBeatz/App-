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
    }export function updateSEO(title, description) {
    document.title = `${title} | SMGPUB`;
    document.querySelector('meta[name="description"]').setAttribute("content", description);
    
    // OpenGraph for Social Media Previews (Crucial for Sales)
    document.querySelector('meta[property="og:title"]').setAttribute("content", title);
    document.querySelector('meta[property="og:image"]').setAttribute("content", "/logo.png");
}

}
