import { gql } from 'graphql-tag';

const typeDefs = gql`
type Task{
    id: Int!
    idU: Int
    description: String!
    duration: Int!
    difficulty: String!
    status: String!
    createdAt: String!
    updatedAt: String!
}


type User{
    id: Int!
    userName: String!
    email: String!
    role: [Role!]!
    createdAt: String!
    updatedAt: String!
}

type Role{
    name: String!
}

#Inputs necesarios para crear una tarea
input TaskCreateInput{
    description: String!
    duration: Int!
    difficulty: String!
}


#Inputs necesarios para editar una tarea pero todo opcional
input TaskEditInput{
    description: String
    duration: Int
    difficulty: String
    status: String
    idU: Int
}


type Query{
    getTasks: [Task]
    getTasksAssignated: [Task]
    getTask(id: ID!): Task
}

type Mutation{
    createTask(input: TaskCreateInput!): Task
    updateTask(id: Int!, input: TaskEditInput!): Task
    deleteTask(id: Int!): Task
}


`;





// const typeDefs = gql`
// type User{    
//     id: Int!
//     userName: String!
//     email: String!
//     role: [Role!]!
// }

// type Role{
//     name: String!
// }

// type Task{
//     id: Int!
//     idU: Int
//     description: String!
//     duration: Int!
//     difficulty: String!
//     status: String!
// }

// type Query{
//     getUsers: [User]
//     getUser(id: ID!): User
//     getTasks: [Task]
//     getTask(id: ID!): Task
// }

// type Mutation{
//     createUser(userName: String!, email: String!, password: String!, role: [RoleInput]): User
//     updateUser(id: ID!, userName: String, email: String, password: String, role: [RoleInput]): User
//     deleteUser(id: ID!): User
//     createTask(idU: Int, description: String!, duration: Int!, difficulty: String!, status: String): Task
//     updateTask(id: ID!, idU: Int, description: String, duration: Int, difficulty: String, status: String): Task
//     deleteTask(id: ID!): Task
// }

// input RoleInput{
//     name: String!
// }

// `;

/*
type Query{
    getUsers: [User]
    getUser(id: ID!): User
    getTasks: [Task]
    getTask(id: ID!): Task
}

type Mutation{
    createUser(userName: String!, email: String!, password: String!, role: [RoleInput]): User
    updateUser(id: ID!, userName: String, email: String, password: String, role: [RoleInput]): User
    deleteUser(id: ID!): User
    createTask(idU: Int, description: String!, duration: Int!, difficulty: String!, status: String): Task
    updateTask(id: ID!, idU: Int, description: String, duration: Int, difficulty: String, status: String): Task
   

*/


//TO DO:  Cambiar las query y los mutations dejar por defecto esto por el momento
/*
input RoleInput{
    name: String!
}
*/


export default typeDefs;