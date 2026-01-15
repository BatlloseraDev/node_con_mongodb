import './style.css';
import { renderLogin } from './components/login.component';
import { renderDashboard } from './components/dashboard.component';

const app = document.querySelector<HTMLDivElement>('#app')!;

const init = () => {
  const token = localStorage.getItem('token');
  
  if (token) {
    // Si hay token, renderizamos Dashboard y pasamos la función para "salir"
    renderDashboard(app, () => {
        init(); // Al hacer logout, volvemos a ejecutar init
    });
  } else {
    // Si no, renderizamos Login y pasamos la función para "entrar"
    renderLogin(app, () => {
        init(); // Al hacer login, volvemos a ejecutar init
    });
  }
};

init();