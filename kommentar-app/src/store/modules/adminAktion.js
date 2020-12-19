import { ElDrawer } from "element-ui/types/drawer";
import firebase from "firebase/app";


const state = () => ({
  
})

const getters = {}
const actions = {
    

    //requestType is Review/PID
    async getUserList({ commit, state }, { toRole }) {
        return firebase.database().ref('updateRole/'+toRole)
        .once('value')
        .then((userinfo)=>{
            return (userinfo.val())
        }).catch((error) => {
            //for debug only, will be finished later
            console.log(error.message);
        });  

    },

   

    //load comments for work from realtime Database
   

   
}

const mutations = {

    
}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}