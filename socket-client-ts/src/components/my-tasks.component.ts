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

        // las tareas en columnas
        tasks.forEach((task: any) => {
            let colId = 'col-todo';
            let actionBtn = '';
            if (task.status === 'por hacer') {
                actionBtn = `<button class="btn-status btn-start" data-id="${task.id}" data-next="haciendo">▶️ Empezar</button>`;
            }
            else if (task.status === 'haciendo') {
                colId = 'col-doing';
                actionBtn = `<button class="btn-status btn-finish" data-id="${task.id}" data-next="hecha">✅ Terminar</button>`;
            } else if (
                task.status === 'hecha'
            ) {
                colId = 'col-done';

            }

            const column = container.querySelector(`#${colId}`)!;

            const card = document.createElement('div');
            card.className = 'task-card my-task-card';
            card.innerHTML = `
                <div class="task-content">
                    <strong>${task.description}</strong>
                    <div class="tags">
                        <span class="badge ${task.difficulty}">${task.difficulty}</span>
                    </div>
                </div>
                <div class="task-actions">
                    ${actionBtn}
                    ${task.status !== 'hecha' ? `<button class="btn-release" data-id="${task.id}">🏃 Soltar</button>` : ''}
                </div>
            `;
            column.appendChild(card);
        });
        //Cambios de estado
        const statusButtons = container.querySelectorAll('.btn-status');
        statusButtons.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const button = e.target as HTMLButtonElement;
                const taskId = Number(button.dataset.id);
                const nextStatus = button.dataset.next;

                if (nextStatus) {
                    await changeStatus(taskId, nextStatus);
                    renderMyTasks(container); // Recargo para ver el cambio
                }
            });
        });

        // (Mantenemos el listener de Soltar tarea que ya tenías)
        const releaseButtons = container.querySelectorAll('.btn-release');
        releaseButtons.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const taskId = (e.target as HTMLButtonElement).dataset.id;
                if (confirm('¿Liberar esta tarea?')) {
                    await releaseTask(Number(taskId));
                    renderMyTasks(container);
                }
            });
        });

    } catch (error) {
        container.innerHTML += `<p class="error">Error: ${error}</p>`;
    }
};


// Función para cambiar el estado
const changeStatus = async (taskId: number, newStatus: string) => {

    const mutation = `
        mutation Mutation($changeTaskStatusId: Int!, $status: String!) {
            changeTaskStatus(id: $changeTaskStatusId, status: $status) {
                id
                idU
                status
            }
        }
    `;

    try {
        await gqlRequest(mutation, { changeTaskStatusId: taskId, status: newStatus });
    } catch (error: any) {
        alert(`❌ Error: ${error.message}`);
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
    `;// cuando se suelta una task no se cambia de estado

    try {
        await gqlRequest(mutation, { releaseTaskId: taskId });
    } catch (error: any) {
        alert(`❌ Error al soltar: ${error.message}`);
    }
};