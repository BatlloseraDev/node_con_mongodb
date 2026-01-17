import { gqlRequest } from "../helpers/graphql-client";

export const renderMyTasks = async (container: HTMLDivElement) => {
    container.innerHTML = `
        <section id="my-tasks" class="fade-in">
            <h3>📋 Mis Tareas</h3>
             <p class="hint">Gestiona tu trabajo.</p>
            <div class="kanban-board">
                <div class="column" id="col-todo"><h4>Por hacer</h4></div>
                <div class="column" id="col-doing"><h4>En progreso</h4></div>
                <div class="column" id="col-done"><h4>Hecha</h4></div>
            </div>
        </section>
    `;

    // Obtengo mi ID
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Tengo que cambiar esto añadir a graphql una funcion para llamar my tasks
    const query = `
        query GetUserTasks($userId: Int!) {
            getUserTasks(idU: $userId) {
                id
                idU
                status
                duration
                difficulty
                description

            }
        }
    `;

    try {
        const data = await gqlRequest(query, { userId: user.id });
        const tasks = data.getUserTasks;

        // 2. RENDER: Distribuimos las tareas en columnas
        tasks.forEach((task: any) => {
            let colId = 'col-todo';
            if (task.status === 'haciendo') colId = 'col-doing';
            if (task.status === 'hecha') colId = 'col-done';

            const column = container.querySelector(`#${colId}`)!;

            const card = document.createElement('div');
            card.className = 'task-card my-task-card';
            card.innerHTML = `
                <div>
                    <strong>${task.description}</strong>
                    <span class="badge ${task.difficulty}">${task.difficulty}</span>
                </div>
                ${task.status !== 'hecha' ?
                    `<button class="btn-release" data-id="${task.id}">🏃 Soltar</button>`
                    : ''}
            `;
            column.appendChild(card);
        });

        // 3. EVENTOS: Botón Soltar
        const buttons = container.querySelectorAll('.btn-release');
        buttons.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const taskId = (e.target as HTMLButtonElement).dataset.id;
                if (confirm('¿Seguro que quieres liberar esta tarea?')) {
                    await releaseTask(Number(taskId));
                    renderMyTasks(container); // Recargar
                }
            });
        });

    } catch (error) {
        container.innerHTML += `<p class="error">Error: ${error}</p>`;
    }
};

const releaseTask = async (taskId: number) => {


    const mutation = `
        mutation ReleaseTask($releaseTaskId: Int!) {
            releaseTask(id: $releaseTaskId) {
                id
                idU
            }
        }
    `;

    try {
        await gqlRequest(mutation, { releaseTaskId: taskId });
    } catch (error: any) {
        alert(`❌ Error al soltar: ${error.message}`);
    }
};