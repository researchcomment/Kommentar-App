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
                var errorCode = error.code;
                var errorMessage = error.message;
                commit("setError", errorMessage);
                if (errorCode == 'auth/invalid-email') {
                    this.state.error = 'The Email is invalid.';
                } else if (errorCode == 'auth/user-disabled') {
                    this.state.error = 'The Email is disabled.';
                } else if (errorCode == 'auth/user-not-found') {
                    this.state.error = 'The Email is not founded.';
                }
                else if (errorCode == 'auth/wrong-password') {
                    this.state.error = 'The Password or Email is wrong.';
                } else {
                    this.state.error = errorCode;
                }
            });
    },

    logout ({ commit}) {
        commit('setrole',null)
        commit('setusername',null)
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
                var errorCode = error.code;
                var errorMessage = error.message;
                commit("setError", errorMessage);
                if (errorCode == 'auth/email-already-in-use') {
                    this.state.error = 'TThe User is existed.';
                } else if (errorCode == 'auth/invalid-email') {
                    this.state.error = 'The Email is invalid.';
                } else if (errorCode == 'auth/operation-not-allowed') {
                    this.state.error = 'The Email/Username is not allowed.';
                }
                else if (errorCode == 'auth/weak-password') {
                    this.state.error = 'The Password is not strong enough.';
                } else {
                    this.state.error = errorCode;
                }
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

