import { gqlRequest } from "../helpers/graphql-client";

export const renderTaskCount = (container: HTMLDivElement) => {
    container.innerHTML = `
        <section id="task-count-section" class="fade-in">
            <h3>📊 Conteo de Tareas por Dificultad</h3>
            <p class="hint">Consulta cuántas tareas existen según su complejidad.</p>
            
            <div class="card" style="max-width: 500px; margin: 0 auto; background: #3a3a3a;">
                <div class="form-group">
                    <label for="count-difficulty-select">Selecciona Dificultad:</label>
                    <select id="count-difficulty-select" style="width: 100%; padding: 10px; margin-bottom: 15px; background: #222; color: white; border: 1px solid #555; border-radius: 4px;">
                        <option value="">Todas</option>
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                    </select>
                </div>
                
                <button id="btn-get-count" style="margin-bottom: 20px;">Consultar Cantidad</button>

                <div id="count-result-display" style="text-align: center; display: none;">
                    <span style="font-size: 4rem; font-weight: bold; color: #646cff;" id="number-display">0</span>
                    <p style="color: #aaa;">Tareas encontradas</p>
                </div>
            </div>
        </section>
    `;

    const selectDifficulty = container.querySelector<HTMLSelectElement>('#count-difficulty-select')!;
    const btnGetCount = container.querySelector<HTMLButtonElement>('#btn-get-count')!;
    const resultDisplay = container.querySelector<HTMLDivElement>('#count-result-display')!;
    const numberDisplay = container.querySelector<HTMLSpanElement>('#number-display')!;

    btnGetCount.addEventListener('click', async () => {
        const difficulty = selectDifficulty.value || null;
        
      
        btnGetCount.textContent = "Calculando...";
        btnGetCount.disabled = true;

        await loadTaskCount(difficulty, numberDisplay, resultDisplay);

        btnGetCount.textContent = "Consultar Cantidad";
        btnGetCount.disabled = false;
    });
};

const loadTaskCount = async (difficulty: string | null, numberElement: HTMLSpanElement, containerElement: HTMLDivElement) => {
    
    const filterInput = difficulty ? { difficulty } : {};

  
    const query = `
        query GetTaskCount($filter: TaskFilter) {
            TaskCountDificulty(filter: $filter)
        }
    `;

    try {
        const data = await gqlRequest(query, { filter: filterInput });
        const count = data.TaskCountDificulty;

        numberElement.textContent = count.toString();
        containerElement.style.display = 'block';
        
        
        numberElement.classList.remove('fade-in');
        void numberElement.offsetWidth; 
        numberElement.classList.add('fade-in');

    } catch (error: any) {
        alert(`Error al obtener el conteo: ${error.message}`);
    }
};