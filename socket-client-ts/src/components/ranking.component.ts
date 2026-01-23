import { gqlRequest } from "../helpers/graphql-client";

export const renderRanking = async (container: HTMLDivElement) => {
    container.innerHTML = `
        <section id="ranking-section" class="fade-in">
            <h3>🏆 Ranking de Usuarios</h3>
            <p class="hint">Top usuarios con más tareas completadas.</p>
            
            <div class="card" style="max-width: 600px; margin: 0 auto; background: #3a3a3a;">
                <table style="width: 100%; border-collapse: collapse; text-align: left;">
                    <thead>
                        <tr style="border-bottom: 1px solid #555;">
                            <th style="padding: 10px;">Posición</th>
                            <th style="padding: 10px;">Usuario</th>
                            <th style="padding: 10px; text-align: right;">Tareas Hechas</th>
                        </tr>
                    </thead>
                    <tbody id="ranking-list">
                        <tr><td colspan="3" style="padding:20px; text-align:center">Cargando ranking...</td></tr>
                    </tbody>
                </table>
            </div>
        </section>
    `;

    const listContainer = container.querySelector('#ranking-list')!;

    const query = `
        query TaskUserRanking {
            TaskUserRanking {
                userName
                tasksCompleted
            }
        }
    `;

    try {
     
        const data = await gqlRequest(query);
        console.log(data)
        const ranking = data.TaskUserRanking;

        if (!ranking || ranking.length === 0) {
            listContainer.innerHTML = '<tr><td colspan="3" style="padding:20px; text-align:center">No hay datos de tareas completadas aún.</td></tr>';
            return;
        }

     
        listContainer.innerHTML = ''; 
        
        ranking.forEach((user: any, index: number) => {
            const row = document.createElement('tr');
            row.style.borderBottom = '1px solid #444';
            
            // Esto me lo hizo la ia cuando le pedi una forma de representar en front la consulta
            let medal = `#${index + 1}`;
            if (index === 0) medal = '🥇';
            if (index === 1) medal = '🥈';
            if (index === 2) medal = '🥉';

            row.innerHTML = `
                <td style="padding: 10px;">${medal}</td>
                <td style="padding: 10px; font-weight: bold;">${user.userName}</td>
                <td style="padding: 10px; text-align: right;">${user.tasksCompleted}</td>
            `;
            listContainer.appendChild(row);
        });

    } catch (error: any) {
        listContainer.innerHTML = `<tr><td colspan="3" class="error" style="padding:20px;">Error: ${error.message}</td></tr>`;
    }
};