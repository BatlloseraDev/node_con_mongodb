import { gqlRequest } from "../helpers/graphql-client";
import { io } from "socket.io-client";

export const renderAvailableTasks = async (container: HTMLDivElement) => {
    container.innerHTML = `
        <section id="tasks-available" class="fade-in">
           <h3>
                📌 Tareas Disponibles 
                <span id="tasks-counter" style="background: #e11d48; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.8em; vertical-align: middle;">
                    0
                </span>
            </h3>
            <p class="hint">Tareas libres esperando asignación.</p>
            <div class="task-list" id="list-available">
                <p>Cargando tareas...</p> 
            </div>
        </section>
    `;

    const listContainer = container.querySelector('#list-available')!;
    const counterElement = container.querySelector('#tasks-counter')!;

    const loadData = async () => {
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
            // Filtramos en cliente como hacías, o podrías usar el filtro isUnassigned del back
            const tasks = data.getTasks.filter((t: any) => t.idU === null);

            // [NUEVO] Actualizar contador visualmente
            counterElement.textContent = tasks.length.toString();
            // Animación simple para resaltar cambio
            counterElement.animate([
                { transform: 'scale(1)' },
                { transform: 'scale(1.5)' },
                { transform: 'scale(1)' }
            ], { duration: 300 });

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
                    await takeTask(Number(taskId), loadData); // Pasamos callback para recargar
                });
            });

        } catch (error) {
            listContainer.innerHTML = `<p class="error">Error al cargar: ${error}</p>`;
        }
    };

    await loadData();

    const socket = io('http://localhost:9090');
    socket.on('connect', () => {
        console.log('🟢 Conectado al WebSocket para actualizaciones');
    });

    socket.on('server:tasks-update', () => {
        console.log('🔄 Recibida actualización de tareas, recargando lista...');
        loadData();
    });
}

    // Función para llamar a la mutación
    const takeTask = async (taskId: number, onSuccess: () => void) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
        alert("Error: No estás logueado correctamente");
        return;
    }

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
        onSuccess(); 
    } catch (error: any) {
        alert(`❌ Error: ${error.message}`);
    }
};