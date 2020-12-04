import firebase from 'firebase/app';

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
    commit_private:{
        data:[],
        length:0
    },
    commit_public:{
        data:[],
        length:0
    }
})

const getters = {}

const actions = {
    askfordetail({ commit, state }, {doi,username}){
        //set the information to the state,filter it into title author and doi(may changed from google firebase side)
        //commit('setlist',list)

        //give the first 5 commit of each part, can reuse changepage
        let returnValue={
            title:"The 'book' of my own ",
            author:"You know WHO !!!",
            editor:"Harry Potter",
            chair:"Ron Weasley",
            translator:"Hermine Granger",
            contributor:"Albus Dumbledore",
            bibliographic:"///",
            affiliation:",",
            doi:"1232334234",
            commit_private:{
                data:[
                    {
                        content:"This is a new Day!",
                        author:"Merker"
                    }
                ],
                length:1
            },
            commit_public:{
                data:[
                    {
                        content:"This is a Bad Day!",
                        author:"John"
                    }
                ],
                length:1
            }
        }
        //if possible, we can use state instead
        return returnValue;
    },

    changepage({ commit, state }, {flag,from,to}){
        //use from and to to search out the matched answer
        //flag shows whether it is private one or a public one
        let returnValue={
            data:[
                {
                    content:"This is a Bad Day!",
                    author:"John"
                }
            ],
        }
        return returnValue;
    },

    //create new Entry in realtime-DB for Editor-Input 
    sendFromEditorToDatabase({ commit, state }, {doi,username,content}){
        //set content with doi username to database
        
        const entry = {
            doi_nr: doi,
            usr: username,
            details: content
        }
        console.log(entry);
        firebase.database().ref('editor_content').push(entry)
        .then((data) => {
            //create a key for load access in realtime-DB
            const key = data.key
            commit('sendFromEditorToDatabase', {
                ...entry,
                id: key 
            })
        })
        .catch((error) => {
            //for debug only, will be finished later
            console.log(error.message);
        })
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