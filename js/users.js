document.addEventListener('DOMContentLoaded', function() {
    // si localstorage tiene datos, se usan; sino, carga json

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
  
  // carga datos del json
  function loadFromJsonFile() {
    fetch('data/users.json')
      .then(response => {
        
        if (!response.ok) throw new Error('error loading json file: ' + response.status);
        
        return response.json();
      })

      .then(data => {
        localStorage.setItem('users', JSON.stringify(data));
        populateTable(data);

        initializeDataTable();       
      })

      .catch(error => {
        console.error('error loading json file:', error);
        const storedUsers = localStorage.getItem('users');
        
        if (storedUsers) {
            
          try {
            const users = JSON.parse(storedUsers);
            populateTable(users);
            initializeDataTable();
            console.log('usando datos de localstorage');

          } catch (parseError) {

            console.error('error parseando localstorage:', parseError);
            handleNoDataAvailable();
          }

        } else {
          handleNoDataAvailable();
        }
      });
  }
  
  // sin datos disponibles
  function handleNoDataAvailable() {

    const tableBody = document.querySelector('#usersTable tbody');
    tableBody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">failed to load user data. check that your json file exists and is accessible.</td></tr>';

    initializeDataTable();
  }
  

  // actualiza la tabla con los datos
  function populateTable(users) {

    const tableBody = document.querySelector('#usersTable tbody');
    tableBody.innerHTML = '';
    
    if (!users || users.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="7" class="text-center">no users found. add a new user to get started.</td></tr>';
      return;
    }

    users.forEach((user, index) => {
      const row = document.createElement('tr');
      row.setAttribute('data-index', index);

      const formattedSalary = new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
      }).format(user.salary);

      const startDate = new Date(user.startDate);
      const formattedDate = startDate.toLocaleDateString('es-ES');

      row.innerHTML = `
        <td>${user.name}</td>
        <td>${user.position}</td>
        <td>${user.office}</td>
        <td>${user.age}</td>
        <td>${formattedDate}</td>
        <td>${formattedSalary}</td>
        <td>
          <button class="btn btn-sm btn-danger delete-user" data-index="${index}">delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    document.querySelectorAll('.delete-user').forEach(button => {
      button.addEventListener('click', deleteUser);
    });

    }
    
  // borra un usuario
  function deleteUser(event) {
    const index = parseInt(event.target.getAttribute('data-index'));
    let users = [];

    try {
      users = JSON.parse(localStorage.getItem('users') || '[]');
    
    } catch (error) {
      console.error("error:", error);
    
      return;
    }
    users.splice(index, 1);
    localStorage.setItem('users', JSON.stringify(users));
    refreshTableAndDataTable(users);
  }
  
  // refresca la tabla y reinicia datatable
  function refreshTableAndDataTable(users) {
    if ($.fn.DataTable.isDataTable('#usersTable')) $('#usersTable').DataTable().destroy();
    
    populateTable(users);
    
    initializeDataTable();
  }
  
  // inicializa datatable
  function initializeDataTable() {
    if (!$.fn.DataTable.isDataTable('#usersTable')) {
      $('#usersTable').DataTable({
        language: {
          paginate: {
            previous: "<",
            next: ">"
          },
          lengthMenu: "show _MENU_ entries per page",
          zeroRecords: "no matching records found",
          info: "showing page _PAGE_ of _PAGES_",
          infoEmpty: "no records available",
          search: "search:"
        },
        pagingType: "simple_numbers",
        responsive: true,
        pageLength: 5,
        lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "all"]]
      });
    }
  }
  