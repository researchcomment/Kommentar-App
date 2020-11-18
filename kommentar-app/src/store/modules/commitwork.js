

const state = () => ({
    title:null,
    author:null,
    editor:null,
    chair:null,
    translator:null,
    contributor:null,
    bibliographic:null,
    affiliation:null,
    doi:null,
    commit_private:[],
    commit_public:[]
})

const getters = {}

const actions = {
    askfordetail({ commit, state }, {doi}){
        //set the information to the state,filter it into title author and doi(may changed from google firebase side)
        //commit('setlist',list)

        //give the first 5 commit of each part, can reuse changepage
        let returnValue={
            list:[
                {
                    title:"The 'book' of my own ",
                    author:"You know WHO !!!",
                    doi:"1232334234"
                }
            ],
            length:1
        }
        //if possible, we can use state instead
        return state;
    },

    changepage({ commit, state }, {flag,from,to}){
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