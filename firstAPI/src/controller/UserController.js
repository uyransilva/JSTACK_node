let users = require('../mocks/users')//importando os dados de usuarios de base interna sem BD

const listUsers = (request, response) => {
    const { order } = request;
    const sortedUsers = users.sort((a,b) => {
        if(order === 'desc'){
            return a.id < b.id ? 1 : -1;
        }
            return a.id > b.id ? 1 : -1;
    })
    response.send(200, sortedUsers)
}

const getUserById = (request , response) => {
    const { id } = request.params;
    const user = users.find ((user) => user.id === Number(id));
    if(!user){
        response.send(400 , {error:"Usuário não encontrado"})
    }
    response.send(200, user);
}

function createUser (request, response) {
    const {body}  = request;
    const lastUserId = users[users.length - 1].id;
    const newUser = {
        id: lastUserId + 1,
        name: body.name
    }
    users.push(newUser)

    response.send(200,newUser);
};

function updateUser(request, response){
    let { id } = request.params;
    const { name } = request.body;

    id = Number(id);

    const userExists = users.find((user) => user.id === id);
    if(!userExists){
        return response.send(400, {error:"User not found"})
    }

    users = users.map((user) => {
        if(user.id === id){
            return{
                ...user,
                name,
            };
        }
        return user;
    });
    response.send(200)
}

function deleteUser(request , response) {
    let { id } = request.params;
    id = Number(id);
    users = users.filter((user) => user.id !== id);

    response.send(200, {deleted:true})
}

module.exports = {
    listUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}