export const renderMyTasks = (container: HTMLDivElement) => {
    container.innerHTML = `
        <section id="my-tasks" class="fade-in">
            <h3>📋 Mis Tareas</h3>
             <p class="hint">Gestiona el estado de tus asignaciones.</p>
            <div class="kanban-board">
                <div class="column">
                    <h4>Por hacer</h4>
                    <div id="col-todo" class="task-list"></div>
                </div>
                <div class="column">
                    <h4>En progreso</h4>
                    <div id="col-doing" class="task-list"></div>
                </div>
                <div class="column">
                    <h4>Hecha</h4>
                    <div id="col-done" class="task-list"></div>
                </div>
            </div>
        </section>
    `;

    // Aquí llamar a loadMyTasks() que llamará a gql
};