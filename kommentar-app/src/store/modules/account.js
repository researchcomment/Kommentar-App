

const state = () => ({
    username:null,
    role:null,
})

const getters = {}


const actions = {
    login ({ commit, state }, {username,password}) {
        
        //when everything ok, update inform//get information from google firebase backend
        //when username does not compare to the password, return false and reason
        /*
            return {flag:false,msg:""} 
        */
        commit('setrole','User')
        commit('setusername',username)
        let returnValue={flag:true,role:state.role}
        return returnValue
    },
    logout ({ commit}) {
        commit('setrole',null)
        commit('setusername',null)
    },
    regist({ commit, state }, {username,password}) {
        //get information from google firebase backend
        //when username does not compare to the password, return false and reason
        /*
            return {flag:false,msg:""} 
        */
       return {flag:true}
    },
    
}

const mutations = {

    setrole(state,role){
        state.role=role
    },

    setusername(state,username){
        state.username=username
    }
    
}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}

