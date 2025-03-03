function toggleBlockPost(event) {
    const button = event.currentTarget;
    const index = parseInt(button.getAttribute('data-index'));
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    
    if (posts[index]) {
        const modalElement = document.getElementById('confirmModal');
        const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
        
        const modalBody = modalElement.querySelector('.modal-body');
        modalBody.textContent = `Are you sure you want to ${posts[index].isBlocked ? 'unblock' : 'block'} this post?`;
        
        const confirmBtn = document.getElementById('confirmActionBtn');
        
        // Clear previous events
        confirmBtn.replaceWith(confirmBtn.cloneNode(true));
        const newConfirmBtn = document.getElementById('confirmActionBtn');
        
        newConfirmBtn.addEventListener('click', () => {
            posts[index].isBlocked = !posts[index].isBlocked;
            localStorage.setItem('posts', JSON.stringify(posts));
            
            // Update UI
            button.textContent = posts[index].isBlocked ? 'Unblock' : 'Block';
            button.classList.toggle('btn-warning');
            button.classList.toggle('btn-info');
            button.closest('tr').classList.toggle('opacity-50');
            
            modalInstance.hide();
        }, { once: true });
        
        modalInstance.show();
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    let posts = JSON.parse(localStorage.getItem('posts'));

    if (!posts) {
        try {
            const response = await fetch('data/posts.json');
            if (!response.ok) throw new Error('Error loading posts');
            posts = await response.json();
            // Add IDs if missing
            posts = posts.map((post, index) => ({
                ...post,
                id: post.id || index + 1
            }));
            localStorage.setItem('posts', JSON.stringify(posts));
        } catch (error) {
            console.error('Error:', error);
            posts = [];
        }
    }

    const tbody = document.querySelector('#postsTable tbody');
    if (tbody) {
        tbody.innerHTML = posts.map((post, index) => `
            <tr ${post.isBlocked ? 'class="opacity-50"' : ''}>
                <td>${post.title}</td>
                <td>${post.date}</td>
                <td>
                    <a href="post-details.html?id=${post.id}" class="btn btn-primary btn-sm">See</a>
                    <button class="btn ${post.isBlocked ? 'btn-info' : 'btn-warning'} btn-sm" 
                            data-index="${index}"
                            onclick="toggleBlockPost(event)">
                        ${post.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                </td>
            </tr>
        `).join('');
    }
});