import { gqlRequest } from "../helpers/graphql-client";

export const renderAvailableTasks = async (container: HTMLDivElement) => {
    container.innerHTML = `
        <section id="tasks-available" class="fade-in">
            <h3>📌 Tareas Disponibles</h3>
            <p class="hint">Tareas libres esperando asignación.</p>
            <div class="task-list" id="list-available">
                <p>Cargando tareas...</p> 
            </div>
        </section>
    `;

    const listContainer = container.querySelector('#list-available')!;

    const query = `
        query {
            getTasks {
                id
                description
                difficulty
                duration
                idU
            }
        }
    `;

    try {
        const data = await gqlRequest(query);
        const tasks = data.getTasks.filter((t: any) => t.idU === null);

        if (tasks.length === 0) {
            listContainer.innerHTML = '<p>🎉 No hay tareas pendientes.</p>';
            return;
        }

        listContainer.innerHTML = ''; 

       
        tasks.forEach((task: any) => {
            const card = document.createElement('div');
            card.className = 'task-card';
            card.innerHTML = `
                <div class="task-info">
                    <strong>${task.description}</strong>
                    <br>
                    <span class="badge ${task.difficulty}">${task.difficulty}</span> 
                    <span>⏱ ${task.duration}h</span>
                </div>
                <button class="btn-take" data-id="${task.id}">✋ Coger</button>
            `;
            listContainer.appendChild(card);
        });


        const buttons = listContainer.querySelectorAll('.btn-take');
        buttons.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const taskId = (e.target as HTMLButtonElement).dataset.id;
                await takeTask(Number(taskId));
                // Recargo la vista para refrescar
                renderAvailableTasks(container);
            });
        });

    } catch (error) {
        listContainer.innerHTML = `<p class="error">Error al cargar: ${error}</p>`;
    }
};

// Función para llamar a la mutación
const takeTask = async (taskId: number) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
        alert("Error: No estás logueado correctamente");
        return;
    }

    // const mutation = `
    //     mutation TakeTask($id: Int!, $idU: Int!) {
    //         updateTask(id: $id, input: { idU: $idU }) {
    //             id
    //             idU
    //         }
    //     }
    // `;
    const mutation = `
        mutation Mutation($takeTaskId: Int!) {
            takeTask(id: $takeTaskId) {
                id
                idU
            }
        }

    `


    try {
        await gqlRequest(mutation, { takeTaskId: taskId});
        alert(`✅ Tarea ${taskId} asignada a ti.`);
    } catch (error: any) {
        alert(`❌ Error: ${error.message}`);
    }
};