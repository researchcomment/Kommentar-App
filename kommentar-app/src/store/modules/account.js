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
       /*
        return {flag:false, msg:"Wrong XXX"} 
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
            var errorCode = error.code;
            var errorMessage = error.message;
            commit("setError", errorMessage);
            if(errorCode == 'auth/invalid-email'){
                alert('The Email is invalid.');
            }else if(errorCode == 'auth/user-disabled'){
                alert('The User is disabled.')
            }else if(errorCode == 'auth/user-not-found'){
                alert('The Email is not founbd.')
            }
            else if(errorCode == 'auth/wrong-password'){
                alert('The Password is wrong.')
            }else{
                alert(errorCode)
            }
        });
    },

    logout ({ commit}) {
        commit('setrole',null)
        commit('setusername',null)
    },

    regist({ commit, state }, {username,password}) {
        //get information from google firebase backend
        //when username does not compare to the password, return false and reason
       firebase
       .auth()
       .createUserWithEmailAndPassword(username, password)
       .then(response =>{
        commit("setusername", username);
       })
       .catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        commit("setError", error.message);
        if(errorCode == 'auth/email-already-in-use'){
            alert('The User is existed.');
        }else if(errorCode == 'auth/invalid-email'){
            alert('The Email is invalid.')
        }else if(errorCode == 'auth/operation-not-allowed'){
            alert('The Email/Username is not allowed.')
        }
        else if(errorCode == 'auth/weak-password'){
            alert('The Password is not strong enough.')
        }else{
            alert(errorCode)
        }
       });
    }
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

