//const HOST_API = "http://192.168.99.100:8080";
const HOST_API = "http://" + window.location.hostname +  ":8080";
//const HOST_API = "http://localhost:8080";
const URI_USER_API = HOST_API + "/api/user";
const URI_ROLE_API = HOST_API + "/api/role";

export const $users = {
    getAll: function(onSuccess, onError) {
        fetch(URI_USER_API)
            .then(results => {
                if (results.ok) {
                    return results.json();
                }
                throw new Error("Could not fetch users: " + results.statusText);
            }).then(onSuccess).catch(onError);
    },

    create: function(newUser, onSuccess, onError) {
        fetch(URI_USER_API, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(newUser)
        }).then(results => {
            if (results.ok) {
                return results.json();
            }
            throw new Error("Could not create user " + newUser.name + ": " + results.statusText);
        }).then(onSuccess).catch(onError);
    },

    update: (user, onSuccess, onError) => {
        fetch(URI_USER_API + "/" + user.userId, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(user),
        }).then(results => {
            if (results.ok) {
                return results.json();
            }
            throw new Error("Could not update user " + user.name + ": " + results.statusText);
        }).then(onSuccess).catch(onError);
    },

    remove: (user, onSuccess, onError) => {
        fetch(URI_USER_API + "/" + user.userId, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(user.userId),
        }).then(results => {
            if (results.ok) {
                return results.json();
            }
            throw new Error("Could not remove user " + user.name + ": " + results.statusText);
        }).then(onSuccess).catch(onError);
    }
}

export const $roles = {
    getAll: function(onSuccess, onError) {
        fetch(URI_ROLE_API)
            .then(results => {
                if (results.ok) {
                    return results.json();
                }
                throw new Error("Could not fetch roles: " + results.statusText);
            }).then(onSuccess).catch(onError);
    },

    create: function(newRole, onSuccess, onError) {
        fetch(URI_ROLE_API, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(newRole)
        }).then(results => {
            if (results.ok) {
                return results.json();
            }
            throw new Error("Could not create role " + newRole.name + ": " + results.statusText);
        }).then(onSuccess).catch(onError);
    },

    update: (role, onSuccess, onError) => {
        fetch(URI_ROLE_API + "/" + role.id, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(role),
        }).then(results => {
            if (results.ok) {
                return results.json();
            }
            throw new Error("Could not update role " + role.rolename + ": " + results.statusText);
        }).then(onSuccess).catch(onError);
    },

    remove: (role, onSuccess, onError) => {
        fetch(URI_ROLE_API + "/" + role.id, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(role.id),
        }).then(results => {
            if (results.ok) {
                return results.json();
            }
            throw new Error("Could not remove role " + role.rolename + ": " + results.statusText);
        }).then(onSuccess).catch(onError);
    }
}
