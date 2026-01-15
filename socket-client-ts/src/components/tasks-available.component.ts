export const renderAvailableTasks = (container: HTMLDivElement) => {
    container.innerHTML = `
        <section id="tasks-available" class="fade-in">
            <h3>📌 Tareas Disponibles</h3>
            <p class="hint">Aquí verás las tareas que nadie ha cogido aún.</p>
            <div class="task-list" id="list-available">
                <p>Cargando tareas...</p> 
            </div>
        </section>
    `;
    
    // Aquí podrías llamar a una función loadAvailableTasks() en el futuro
};