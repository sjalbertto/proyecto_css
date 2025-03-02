document.addEventListener('DOMContentLoaded', function() {
    const userForm = document.getElementById('userForm');
  
    // Verifica si el formulario está presente
    if (userForm) {
      userForm.addEventListener('submit', addUser);
    }
  
    function addUser(event) {
      event.preventDefault();
  
      // Obtiene los valores del formulario
      const name = document.getElementById('name').value;
      const position = document.getElementById('position').value;
      const office = document.getElementById('office').value;
      const age = document.getElementById('age').value;
      const startDate = document.getElementById('startDate').value;
      const salary = document.getElementById('salary').value;
  
      // Crea un objeto de usuario
      const newUser = {
        name,
        position,
        office,
        age,
        startDate,
        salary
      };
  
      // Obtiene la lista de usuarios del localStorage (si existe)
      let users = JSON.parse(localStorage.getItem('users')) || [];
  
      // Añade el nuevo usuario al arreglo
      users.push(newUser);
  
      // Guarda la lista actualizada en el localStorage
      localStorage.setItem('users', JSON.stringify(users));
  
      // Opcionalmente, redirige o muestra un mensaje de éxito
      alert('Usuario agregado con éxito');
      window.location.href = 'users.html'; // Redirige a la página de usuarios (ajusta según sea necesario)
    }
  });
  