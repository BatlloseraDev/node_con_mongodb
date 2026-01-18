import { gqlRequest } from "../helpers/graphql-client";

export const renderFilterTasks = (container: HTMLDivElement) => {
    container.innerHTML = `
        <section id="filter-section" class="fade-in">
            <h3>Buscador Avanzado</h3>
            <div class="card filter-card">
                <form id="filter-form">
                    <div class="filter-row">
                        <label>Dificultad Exacta:</label>
                        <select name="difficulty" id="f-difficulty">
                            <option value="">Todas</option>
                            <option value="XS">XS</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                        </select>
                    </div>

                    <div class="filter-row">
                        <label>Rango Dificultad:</label>
                        <select name="minDifficulty" id="f-min">
                            <option value="">Min (Cualquiera)</option>
                            <option value="XS">XS</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                        </select>
                        <span>a</span>
                        <select name="maxDifficulty" id="f-max">
                            <option value="">Max (Cualquiera)</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                        </select>
                    </div>

                    <div class="filter-row">
                        <label>Asignado a (ID):</label>
                        <input type="number" name="assignedTo" id="f-assigned" placeholder="Ej: 1" />
                    </div>

                    <div class="filter-row checkbox-row">
                        <label for="f-unassigned">Solo sin asignar y ordenar por duración</label>
                        <input type="checkbox" name="isUnassigned" id="f-unassigned" />
                        
                    </div>

                    <button type="submit">Aplicar Filtros</button>
                    <button type="button" id="btn-clear" class="secondary">Limpiar</button>
                </form>
            </div>
            
            <div id="filter-results" class="task-list">
                </div>
        </section>
    `;

    const form = container.querySelector('#filter-form') as HTMLFormElement;
    const resultsContainer = container.querySelector('#filter-results') as HTMLDivElement;
    const btnClear = container.querySelector('#btn-clear') as HTMLButtonElement;

    // Enviar filtro
    form.addEventListener('submit', async (e) => {
        e.preventDefault();


        const difficulty = (document.getElementById('f-difficulty') as HTMLSelectElement).value || null;
        const minDifficulty = (document.getElementById('f-min') as HTMLSelectElement).value || null;
        const maxDifficulty = (document.getElementById('f-max') as HTMLSelectElement).value || null;
        const assignedTo = (document.getElementById('f-assigned') as HTMLInputElement).value || null;
        const isUnassigned = (document.getElementById('f-unassigned') as HTMLInputElement).checked;

        // objeto input para GraphQL
        const filterInput: any = {};
        if (difficulty) filterInput.difficulty = difficulty;
        if (minDifficulty) filterInput.minDifficulty = minDifficulty;
        if (maxDifficulty) filterInput.maxDifficulty = maxDifficulty;
        if (assignedTo) filterInput.assignedTo = Number(assignedTo); // ID como string tranformado a int(me daba problemas en back)
        if (isUnassigned) {
            filterInput.isUnassigned = true;
            filterInput.sortBy = "duration_difficulty";
        }

        await loadFilteredTasks(resultsContainer, filterInput);
    });


    btnClear.addEventListener('click', () => {
        form.reset();
        resultsContainer.innerHTML = '';
    });
};

// Función para pedir datos a GraphQL
const loadFilteredTasks = async (container: HTMLDivElement, filter: any) => {
    container.innerHTML = '<p>Buscando...</p>';

    const query = `
        query GetTasks($filter: TaskFilter) {
            getTasks(filter: $filter) {
                id
                idU
                description
                difficulty
                duration
                status
                user{
                    userName
                }
            }
        }
    `;

    try {
        const data = await gqlRequest(query, { filter });
        const tasks = data.getTasks;

        if (tasks.length === 0) {
            container.innerHTML = '<p>No se encontraron tareas con esos criterios.</p>';
            return;
        }

        container.innerHTML = ''; // Limpiar cargando
        tasks.forEach((task: any) => {
            const assignedText = task.assignedTo ? `👤 ${task.assignedTo.userName}` : '⚪ Libre';

            const card = document.createElement('div');
            card.className = 'task-card';
            card.innerHTML = `
                <div class="task-info">
                    <strong>${task.description}</strong>
                    <br>
                    <span class="badge ${task.difficulty}">${task.difficulty}</span> 
                    <span>⏱ ${task.duration}h</span>
                    <span style="margin-left:10px; font-size:0.9em; color:#aaa;">${assignedText}</span>
                </div>
            `;
            container.appendChild(card);
        });

    } catch (error: any) {
        container.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
};