import firebase from 'firebase/app';

const state = () => ({
    username: null,
    role: null, //['default', 'Researcher', 'Reviewer','Moderator','Admin']  from JJY
    error: null
})

const getters = {
    getUser(state) {
        return rootState.username;
    },

    isAuth(state) {
        return state.username;
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
                window.localStorage.setItem("username",username); //cache account information
                commit("setusername", username);
            })
            .catch(error => {
                commit("setError", error.message);
            });
    },

    logout ({ commit}) {
        //logout action in firebase, return a promise
        firebase
        .auth()
        .signOut()
        .then(() => {
            window.localStorage.removeItem('username');  //delete cached account information
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
                console.log('true')
                commit("setusername", username);
                
                //初始化DB中的用户信息                
                var entry = {
                    username: username,
                    role: 'user',
                    email: username, 
                }
               
                firebase.database().ref('users').push(entry)
            })
            .catch(error => {
                console.log('false');
                commit("setError", error.message);
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