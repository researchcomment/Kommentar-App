

const state = () => ({
    list:[],
    length:0
})

const getters = {}

const actions = {
    search({ commit, state }, {keyword}){
        //set the information to the state,filter it into title author and doi(may changed from google firebase side)
        //commit('setlist',list)

        //give the first 10 information(Todo), can reuse changepage
       
        let returnValue={
            list:[
                {
                    title:keyword,
                    author:"You know WHO !!!",
                    doi:"1232334234"
                },
                {
                    title:"The 'book' of my own ",
                    author:"You know WHO !!!",
                    doi:"1232334234"
                }
            ],
            length:2
        }
        return returnValue;
    },

    changepage({ commit, state }, {from,to}){
        //use from and to to search out the matched answer
        let returnValue={
            list:[
                {
                    title:"The 'book' of my own ",
                    author:"You know WHO !!!",
                    doi:"1232334234"
                }
            ]
        }
        return returnValue;
    }

    
}

const mutations = {

    setlist(state,list){
        state.list=list
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

