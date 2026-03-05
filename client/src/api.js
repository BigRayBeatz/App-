async function handleSaveProfile() {
    const profileData = {
        full_name: document.getElementById('display-name').value,
        bio: document.getElementById('bio').value,
        is_public: document.getElementById('profile-public-toggle').checked
    };

    const result = await apiRequest('/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
    });

    if (result) {
        alert("Creator Node Synchronized!");
        updatePreview(profileData);
    }
}

function updatePreview(data) {
    const container = document.getElementById('preview-container');
    container.innerHTML = `
        <div class="public-card">
            <h4>${data.full_name}</h4>
            <p>${data.bio}</p>
            <div class="badge">${data.is_public ? '🌐 Public' : '🔒 Private'}</div>
        </div>
    `;
}
