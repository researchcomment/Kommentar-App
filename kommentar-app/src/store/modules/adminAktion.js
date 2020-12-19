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
            if (userinfo.val())
                return (userinfo.val())
            else
                return {}
        }).catch((error) => {
            //for debug only, will be finished later
            console.log(error.message);
        });  

    },
    //flag: true agree to update, false regret to update
    updateRole({ commit, state }, {flag,userKey, toRole }){
        firebase.database().ref('updateRole/'+toRole).child(userkey).remove();
        firebase.database().ref('users/' + userKey+'/update/'+toRole).set(false);
        if (flag)
        {
            firebase.database().ref('users/' + userKey+'/role')
            .once('value')
            .then((roles)=>{
                let setroles=roles.val().push(toRole);
                firebase.database().ref('users/' + userKey+'/role').set(setroles);
            })
        }
    }

   

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