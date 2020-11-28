import firebase from 'firebase/app';

const state = () => ({
    username: null,
    role: null,
    error: null
})

const getters = {
    getUser(state) {
        return state.username;
    },

    isAuth(state) {
        return !!state.username;
    },

    getError(state) {
        return state.error;
    }
}


const actions = {
    login({ commit, state }, { username, password }) {

        //when everything ok, update inform//get information from google firebase backend
        //when username does not compare to the password, return false and reason

        return firebase
            .auth()
            .signInWithEmailAndPassword(username, password)
            .then(response => {
                commit("setusername", username);
            })
            .catch(error => {
                var errorMessage = error.message;
                commit("setError", errorMessage);
            });
    },

    logout ({ commit}) {
        //logout action in firebase, return a promise
        firebase
        .auth()
        .signOut()
        .then(() => {
            commit('setrole',null)
            commit('setusername',null)
        })
        .catch(error => {
            commit("setError", error.message);
        })
    },

    regist({ commit, state }, { username, password }) {
        //get information from google firebase backend
        //when username does not compare to the password, return false and reason
        firebase
            .auth()
            .createUserWithEmailAndPassword(username, password)
            .then(response => {
                commit("setusername", username);
            })
            .catch(error => {
                var errorMessage = error.message;
                commit("setError", errorMessage);
               
                
            });
    }
}

const mutations = {

    setrole(state, role) {
        state.role = role
    },

    setusername(state, username) {
        state.username = username
    },
    setError(state, error) {
        state.error = error;
    }

}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}

