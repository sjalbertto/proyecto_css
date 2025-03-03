document.addEventListener('DOMContentLoaded', function() {
  const togglePasswordButton = document.getElementById('togglePassword');
  const passwordField = document.getElementById('password');
  const eyeIcon = document.getElementById('passwordEyeIcon');

  
  // Añadir el evento de clic al botón de mostrar/ocultar
  if (togglePasswordButton && passwordField && eyeIcon) {
    togglePasswordButton.addEventListener('click', function() {
      
      if (passwordField.type === 'password') {
        passwordField.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash'); // Cambia el icono a ojo cerrado

      } else {
        passwordField.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye'); // Cambia el icono a ojo abierto
      }
    });
  }
  
  // Toggle password visibility for confirm password field
  const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
  const confirmPassword = document.getElementById('confirmPassword');
  const confirmPasswordEyeIcon = document.getElementById('confirmPasswordEyeIcon');
  
  if (toggleConfirmPassword && confirmPassword && confirmPasswordEyeIcon) {
    toggleConfirmPassword.addEventListener('click', function() {
      const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
      confirmPassword.setAttribute('type', type);
      confirmPasswordEyeIcon.classList.toggle('fa-eye');
      confirmPasswordEyeIcon.classList.toggle('fa-eye-slash');
    });
  }
  
  const userForm = document.getElementById('userForm');
  // Añade el listener al formulario, si existe
  if (userForm) {
    userForm.addEventListener('submit', addOrUpdateUser);
  }
  
  // Si no hay usuarios en localStorage, crea un array vacío en lugar de un usuario vacío
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
  }
  
  // Comprueba si hay parámetro "index" en la URL para edición
  const urlParams = new URLSearchParams(window.location.search);
  const index = urlParams.get('index');
  
  if (index !== null) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users[index]) {
      document.getElementById('firstName').value = users[index].firstName || '';
      document.getElementById('lastName').value = users[index].lastName || ''; 
      document.getElementById('email').value = users[index].email || '';
      document.getElementById('birthDate').value = users[index].birthDate || '';
      document.getElementById('country').value = users[index].country || '';
      document.getElementById('city').value = users[index].city || '';
      document.getElementById('password').value = users[index].password || '';
      document.getElementById('confirmPassword').value = users[index].password || '';
    }
  }
  
  function addOrUpdateUser(event) {
    event.preventDefault();
    
    // Obtiene los valores del formulario
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const birthDate = document.getElementById('birthDate').value;
    const country = document.getElementById('country').value;
    const city = document.getElementById('city').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden. Por favor, inténtalo de nuevo.');
      return; // Detiene la ejecución de la función
    }
    
    // Crea el objeto usuario
    const newUser = {
      firstName,
      lastName,
      email,
      birthDate,
      country,
      city,
      password
    };
    
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Si existe el parámetro index, actualiza el usuario
    if (index !== null) {
      users[index] = newUser;
      alert('Usuario modificado con éxito');

    } else {
      // Si no, añade uno nuevo
      users.push(newUser);
      alert('Usuario agregado con éxito');
    }
    
    localStorage.setItem('users', JSON.stringify(users));
    window.location.href = 'users.html'; 
  }
});