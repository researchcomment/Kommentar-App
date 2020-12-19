import firebase from "firebase/app";

// Import needed firebase modules

const state = () => ({
    username: null,
    role: null, //list:['default', 'Researcher', 'Reviewer','Moderator','Admin']  from JJY
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
    async login({ commit, state,dispatch }, { username, password }) {

        //when everything ok, update inform//get information from google this.$this.$firebase backend
        //when username does not compare to the password, return false and reason
      
            // Existing and future Auth states are now persisted in the current
            // session only. Closing the window would clear any existing state even
            // if a user forgets to sign out.
            // ...
            // New sign-in will be persisted with session persistence.
            return firebase
            .auth()
            .signInWithEmailAndPassword(username, password)
            .then(async function ({user}) {  
                //cache account information
                let result=await firebase.database().ref('users/'+user.uid+'/role').once('value').then((role) => {
                    commit("setrole", role.val()); 
                    commit("setusername", username);
                }).catch(err => {
                    console.log(err);
                });
                commit("setError", null);
                return result;  
            })
            .catch((error) => {
                commit("setError", error.message);
            });
       
       
    },
   
    async relogin({ commit, state,dispatch }, { }){
        let user=firebase.auth().currentUser;
        if (user){
            commit ('setusername',user.email);
            return firebase.database().ref('users/'+user.uid+'/role').once('value').then((role) => {
                commit("setrole", role.val()); 
            }).catch(err => {
                console.log(err);
            });
        }
        return;
    },
    logout ({ commit}) {
        //logout action in this.$firebase, return a promise
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
        //get information from google this.$firebase backend
        //when username does not compare to the password, return false and reason
        return firebase
            .auth()
            .createUserWithEmailAndPassword(username, password)
            .then(({user}) => {
                
                commit("setusername", username);
                commit("setrole", ['default'])      
                var entry = {
                    username: username,
                    role: ['default'],
                    email: username, 
                }
                
                firebase.database().ref('users/'+user.uid).set(entry);
                commit("setError", null);
            })
            .catch((error) => {
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