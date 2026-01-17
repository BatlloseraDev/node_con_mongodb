// socket-client-ts/src/helpers/graphql-client.ts

export const gqlRequest = async (query: string, variables: any = {}) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch('http://localhost:9090/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-token': token || '' 
        },
        body: JSON.stringify({
            query,
            variables
        })
    });

    const body = await response.json();

    if (body.errors) {
        throw new Error(body.errors[0].message);
    }

    return body.data;
};