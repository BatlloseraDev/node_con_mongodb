import { renderAvailableTasks } from "./tasks-available.component";
import { renderMyTasks } from "./my-tasks.component";
import { renderFilterTasks } from "./filter-tasks.component";

export const renderDashboard = (element: HTMLDivElement, onLogout: () => void) => {
  // Recupero el usuario
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { userName: 'Usuario', role: [] };

  // Compruebo si es admin
  const isAdmin = user.role?.some((r: any) => r.name === 'admin');

  element.innerHTML = `
      <div class="dashboard-container">
        <header>
          <h2>Hola, ${user.userName} 👋</h2>
          
          <div class="header-buttons">
            ${isAdmin ? '<button id="btn-admin" class="admin-btn">⚙️ Panel Admin</button>' : ''}
            
            <button id="logout-btn" class="secondary">Cerrar Sesión</button>
          </div>
        </header>
        
        <nav class="dashboard-nav">
          <button id="btn-available" class="nav-btn active">Tareas Disponibles</button>
          <button id="btn-mine" class="nav-btn">Mis Tareas</button>
          <button id="btn-filter" class="nav-btn"> Buscar</button>
        </nav>
  
        <main id="content-area">
          </main>
      </div>
    `;


  const btnAvailable = element.querySelector<HTMLButtonElement>('#btn-available')!;
  const btnMine = element.querySelector<HTMLButtonElement>('#btn-mine')!;
  const btnFilter = element.querySelector<HTMLButtonElement>('#btn-filter')!;
  const contentArea = element.querySelector<HTMLDivElement>('#content-area')!;
  const btnLogout = element.querySelector<HTMLButtonElement>('#logout-btn')!;

  // Referencia condicional al botón de admin 
  const btnAdmin = element.querySelector<HTMLButtonElement>('#btn-admin');


  btnAvailable.addEventListener('click', () => {
    updateActiveButton(btnAvailable, btnMine);
    renderAvailableTasks(contentArea);
  });

  btnMine.addEventListener('click', () => {
    updateActiveButton(btnMine, btnAvailable);
    renderMyTasks(contentArea);
  });
  btnFilter.addEventListener('click', () => {
    updateActiveButton(btnFilter, btnAvailable); // Desactiva visualmente el otro
    // Nota: Tendrás que actualizar tu función updateActiveButton para que acepte limpiar varios botones 
    // o simplemente quitar la clase 'active' a todos los .nav-btn
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btnFilter.classList.add('active');

    renderFilterTasks(contentArea);
  });

  // botón Admin 
  if (btnAdmin) {
    btnAdmin.addEventListener('click', () => {
      //enderAdminPanel()
      alert("🛠️ Aquí iría la vista de gestión del Administrador ");
      //se que puede dar lugar a error de seguridad pero no es un requisito necesario del ejercicio
      //lo he añadido aqui por comodidad de testeo
    });
  }

  // Logout
  btnLogout.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
  });

  // Carga inicial por defecto
  renderAvailableTasks(contentArea);
};

const updateActiveButton = (active: HTMLButtonElement, inactive: HTMLButtonElement) => {
  active.classList.add('active');
  inactive.classList.remove('active');
};