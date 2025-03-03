document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const post = posts.find(p => p.id == postId);

    const postTitleElement = document.getElementById('postTitle');
    const postDateElement = document.getElementById('postDate');
    const postContentElement = document.getElementById('postContent');

    if (post) {
        postTitleElement.textContent = post.title;
        postDateElement.textContent = `Posted on: ${post.date}`;
        
        // Insertar HTML directamente
        postContentElement.innerHTML = post.content || '<p class="text-danger">Content not available</p>';
        
        // Manejo de errores de imágenes
        postContentElement.querySelectorAll('img').forEach(img => {
            img.onerror = function() {
                this.style.display = 'none';
            };
        });
    } else {
        postTitleElement.textContent = 'Post not found';
        postContentElement.innerHTML = '<div class="alert alert-danger mt-3">The requested post does not exist or has been removed.</div>';
    }
});