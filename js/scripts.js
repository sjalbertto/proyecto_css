/*!
    * Start Bootstrap - SB Admin v7.0.7 (https://startbootstrap.com/template/sb-admin)
    * Copyright 2013-2023 Start Bootstrap
    * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
    */
    // 
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Código para el sidebar...
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

    // Contador de publicaciones
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const totalPosts = posts.length;
    const blockedPosts = posts.filter(post => post.isBlocked).length;
    console.log(blockedPosts)

    // Asegúrate de tener en tu HTML elementos con estos IDs para mostrar los contadores
    document.getElementById('totalPosts').textContent = totalPosts;
    document.getElementById('blockedPosts').textContent = blockedPosts;

});
