export const renderLogin = (element: HTMLDivElement, onLoginSuccess: () => void) => {
    const API_URL = 'http://localhost:9090/api/usuarios'; 

    element.innerHTML = `
      <div class="login-container">
        <h1>Gestor de Tareas</h1>
        <div class="card">
          <h2>Iniciar Sesión</h2>
          <form id="login-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" placeholder="usuario@ejemplo.com" required />
            </div>
            <div class="form-group">
              <label for="password">Contraseña</label>
              <input type="password" id="password" placeholder="******" required />
            </div>
            <button type="submit">Entrar</button>
          </form>
          <p id="error-msg" class="error hidden"></p>
        </div>
      </div>
    `;
  
    const form = element.querySelector<HTMLFormElement>('#login-form')!;
    const errorMsg = element.querySelector<HTMLParagraphElement>('#error-msg')!;
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = element.querySelector<HTMLInputElement>('#email')!.value;
      const password = element.querySelector<HTMLInputElement>('#password')!.value;
  
      try {
        const response = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
  
        const data = await response.json();
  
        if (!response.ok) throw new Error(data.msg || 'Error al iniciar sesión');
  
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        //Callback 
        onLoginSuccess();
  
      } catch (error: any) {
        errorMsg.textContent = error.message;
        errorMsg.classList.remove('hidden');
      }
    });
  };