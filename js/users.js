document.addEventListener('DOMContentLoaded', function () {
  // si localstorage tiene datos, los usa; si no, carga el json
  const storedUsers = localStorage.getItem('users');

  if (storedUsers && storedUsers !== "[]") {
      const users = JSON.parse(storedUsers);
      populateTable(users);
      initializeDataTable();
  } else {
      loadFromJsonFile();
  }

  // listener para el formulario si existe
  const userForm = document.getElementById('userForm');
  if (userForm) userForm.addEventListener('submit', addUser);
});

// carga datos desde el json
function loadFromJsonFile() {
  fetch('data/users.json')
      .then(response => {
          if (!response.ok) throw new Error('error cargando el archivo json: ' + response.status);
          return response.json();
      })
      .then(data => {
          localStorage.setItem('users', JSON.stringify(data));
          populateTable(data);
          initializeDataTable();
      })
      .catch(error => {
          console.error('error cargando json:', error);
          handleLocalStorageFallback();
      });
}

// maneja el caso donde no hay datos disponibles
function handleLocalStorageFallback() {
  const storedUsers = localStorage.getItem('users');

  if (storedUsers) {
      try {
          const users = JSON.parse(storedUsers);
          populateTable(users);
          initializeDataTable();
          console.log('usando datos de localstorage.');
      } catch (parseError) {
          console.error('error parseando localstorage:', parseError);
          handleNoDataAvailable();
      }
  } else {
      handleNoDataAvailable();
  }
}

// muestra mensaje cuando no hay datos disponibles
function handleNoDataAvailable() {
  const tableBody = document.querySelector('#usersTable tbody');
  tableBody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">error al cargar datos. verifica que el archivo json existe y es accesible.</td></tr>';
  initializeDataTable();
}

// actualiza la tabla con los datos
function populateTable(users) {
  const tableBody = document.querySelector('#usersTable tbody');
  tableBody.innerHTML = '';
  
  if (!users || users.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="8" class="text-center">no hay usuarios. agrega uno nuevo para comenzar.</td></tr>';
    return;
  }
  
  users.forEach((user, index) => {
    const row = document.createElement('tr');
    row.setAttribute('data-index', index);
    
    // Si el usuario está bloqueado, aplicamos una clase de opacidad reducida
    const isBlocked = user.blocked ? true : false;
    if (isBlocked) {
      row.classList.add('opacity-50'); // Clase de Bootstrap para 50% de opacidad
    }
    
    const formattedDate = new Date(user.birthDate).toLocaleDateString('es-ES');
    
    row.innerHTML = `
    <td>${user.firstName}</td>
    <td>${user.lastName}</td>
    <td>${user.email}</td>
    <td>${formattedDate}</td>
    <td>${user.country}</td>
    <td>${user.city}</td>
    <td class="actions-cell" style="min-width: 250px;">
      <div class="d-flex flex-wrap gap-2">
        <button class="btn btn-sm btn-primary modify-user" data-index="${index}">edit</button>
        <button class="btn btn-sm ${isBlocked ? 'btn-info' : 'btn-warning'} toggle-block-user" data-index="${index}">
          ${isBlocked ? "unblock" : "block"}
        </button>
        <button class="btn btn-sm btn-danger delete-user" data-index="${index}">delete</button>
        <button class="btn btn-sm btn-secondary see-posts" data-index="${index}">see posts</button>
      </div>
    </td>
  `;
  
    
    tableBody.appendChild(row);
  });
  
  // Asigna eventos a los nuevos botones
  document.querySelectorAll('.modify-user').forEach(button => {
    button.addEventListener('click', modifyUser);
  });
  
  document.querySelectorAll('.toggle-block-user').forEach(button => {
    button.addEventListener('click', toggleBlockUser);
  });
  
  document.querySelectorAll('.delete-user').forEach(button => {
    button.addEventListener('click', deleteUser);
  });

  document.querySelectorAll('.see-posts').forEach(button => {
    button.addEventListener('click', seePosts);
  });
}


function toggleBlockUser(event) {
  const index = event.target.getAttribute('data-index');
  let users = JSON.parse(localStorage.getItem('users')) || [];
  
  if (users[index]) {
    const modalElement = document.getElementById('confirmModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
    
    const modalBody = modalElement.querySelector('.modal-body');
    modalBody.textContent = `Are you sure you want to ${users[index].blocked ? 'unblock' : 'block'} this user?`;
    
    const confirmBtn = document.getElementById('confirmActionBtn');
    confirmBtn.addEventListener('click', function handler() {

      users[index].blocked = !users[index].blocked;
      localStorage.setItem('users', JSON.stringify(users));
      
      const button = event.target;
      const row = button.closest('tr');

      if (users[index].blocked) {

        button.textContent = "unblock";
        button.classList.remove('btn-warning');
        button.classList.add('btn-info');
        row.classList.add('opacity-50');

      } else {
        button.textContent = "block";
        button.classList.remove('btn-info');
        button.classList.add('btn-warning');
        row.classList.remove('opacity-50');
      }
      
      modalInstance.hide();
    }, { once: true });
    
    // Muestra el modal
    modalInstance.show();

  }
}

function deleteUser(event) {
  const index = parseInt(event.target.getAttribute('data-index'));
  let users = [];
  
  try {
    users = JSON.parse(localStorage.getItem('users') || '[]');
  } catch (error) {
    console.error("error:", error);
    return;
  }
  
  const modalElement = document.getElementById('confirmModal');
  const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
  
  const modalBody = modalElement.querySelector('.modal-body');
  modalBody.textContent = 'Are you sure you want to delete this user?';
  
  const confirmBtn = document.getElementById('confirmActionBtn');
  confirmBtn.addEventListener('click', function handler() {

    users.splice(index, 1);
    localStorage.setItem('users', JSON.stringify(users));
    refreshTableAndDataTable(users);

    modalInstance.hide();
  }, { once: true });
  
  modalInstance.show();
}


// función para modificar usuario
function modifyUser(event) {
  const index = event.target.getAttribute('data-index');
  window.location.href = `forms.html?index=${index}`;
}

// ver posts
function seePosts(event) {
  const index = event.target.getAttribute('data-index');
  const users = JSON.parse(localStorage.getItem('users')) || [];
  
  if (users[index]) {
    const user = users[index];
    const username = `${user.firstName} ${user.lastName}`;

    window.location.href = `posts.html?username=${encodeURIComponent(username)}`;
  }
}



// refresca la tabla y reinicia datatables
function refreshTableAndDataTable(users) {
  if ($.fn.DataTable.isDataTable('#usersTable')) $('#usersTable').DataTable().destroy();
  populateTable(users);
  initializeDataTable();
}

// inicializa datatables
function initializeDataTable() {
  if (!$.fn.DataTable.isDataTable('#usersTable')) {
      $('#usersTable').DataTable({
          language: {
              paginate: {
                  previous: "<",
                  next: ">"
              },
              lengthMenu: "show _MENU_ entries per page",
              zeroRecords: "no entries were found",
              info: "showing page_PAGE_ of _PAGES_",
              infoEmpty: "no registers avilable",
              search: "search:"
          },
          pagingType: "simple_numbers",
          responsive: true,
          pageLength: 5,
          lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "todos"]]
      });
  }
}
