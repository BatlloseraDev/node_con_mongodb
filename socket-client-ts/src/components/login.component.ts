declare const google: any;

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
          <div id="google-btn" style="display: flex; justify-content: center;"></div>
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

  const handleGoogleResponse = async (response: any) => {
    try {
      const body = { id_token: response.credential };
      const resp = await fetch(`${API_URL}/login/google`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(body)
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.msg || 'Error al iniciar sesión con Google');

      localStorage.setItem('token', data.token);
      console.log(data)
      if (data.usuario || data.user) {
        localStorage.setItem('user', JSON.stringify(data.usuario || data.user));
      }

      onLoginSuccess();
    } catch (error: any) {
      console.error('Google Auth Error:', error);
      mostrarError(error.message || 'Error al autenticar con Google');
    }
  };

  const mostrarError = (msg: string) => {
    errorMsg.textContent = msg;
    errorMsg.classList.remove('hidden');
  }

  const initGoogleBtn = () => {
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.initialize({
        client_id: "231629567509-frlj8kuv7hp26cl2cqt5l60pjv847l3s.apps.googleusercontent.com",
        callback: handleGoogleResponse,
        auto_select: true
      });
      google.accounts.id.renderButton(
        element.querySelector('#google-btn'),
        {
          theme: "filled_blue",
          size: "large",
          shape: "pill",
          text: "sign_in_with",
          logo_alignment: "left"
        }
      );
    } else {
      setTimeout(initGoogleBtn, 500);
    }


  }
  initGoogleBtn();

};