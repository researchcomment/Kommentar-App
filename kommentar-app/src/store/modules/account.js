import firebase from 'firebase/app';

const state = () => ({
    username:null,
    role:null,
    error:null
})

const getters = {}


const actions = {
    login ({ commit, state }, {username,password}) {
        
        //when everything ok, update inform//get information from google firebase backend
        //when username does not compare to the password, return false and reason
        /*
            return {flag:false,msg:""} 
        */
        //return {flag:false, msg:"Wrong XXX"} 
        commit('setrole','User')
        commit('setusername',username)
        let returnValue={flag:true,role:state.role}
        return returnValue
        */
       return firebase
       .auth()
       .signInWithEmailAndPassword(username, password)
       .then(response => {
           commit("setusername", username);
        })
        .catch(error => {
            commit("setError", error.message);
        });
    },

    logout ({ commit}) {
        /*
        commit('setrole',null)
        commit('setusername',null)
        */
       
    },
    regist({ commit, state }, {username,password}) {
        //get information from google firebase backend
        //when username does not compare to the password, return false and reason
        /*
            return {flag:false,msg:""} 
        */
       firebase
       .auth()
       .createUserWithEmailAndPassword(username, password)
       .then(response =>{
        commit("setusername", username);
       })
       .catch(error => {
           commit("setError", error.message);
       });
       //?return needed?
       return {flag:true}
    },
    
}

const mutations = {
  
    setrole(state,role){
        state.role=role
    },

    setusername(state,username){
        state.username=username
    },
    setError(state, error){
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

