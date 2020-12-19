import firebase from "firebase/app";


const state = () => ({
  
})

const getters = {}
const actions = {
    

    //requestType is Review/PID
    async askForRequest({ commit, state }, { uid,doi, requestType }) {
        let doiKey=doi.replaceAll(".","'");
        return firebase.database().ref('doi_repository/' + doiKey + '/comments/' + uid)
        .once('value')
        .then((commentinfo) => {
            if (!commentinfo.val().status[requestType])
            {
                firebase.database().ref(requestType+'/' + uid).set(commentinfo);
                firebase.database().ref('doi_repository/' + doiKey + '/comments/' + uid+"/status/"+requestType).set(true);
            }
        }).catch((error) => {
            //for debug only, will be finished later
            console.log(error.message);
        });      
    },
    deleteComment({ commit, state }, { uid,doi }){
        let doiKey=doi.replaceAll(".","'");
        firebase.database().ref('doi_repository/' + doiKey + '/comments').child(uid).remove();
        let tempnode=firebase.database().ref('Review/'+uid);
        if (tempnode)
        {
            firebase.database().ref('Review').child(uid).remove();
        }
        tempnode=firebase.database().ref('PID/'+uid);
        if (tempnode)
        {
            firebase.database().ref('PID').child(uid).remove();
        }
    },

    async setAttribute({ commit, state }, { uid, doi ,attribute,value  }){
        let doiKey=doi.replaceAll(".","'");
        let setvalue=value;
        if ((attribute=="likes") || (attribute=="dislikes"))
        {
            setvalue=await firebase.database().ref('doi_repository/' + doiKey + '/comments/' + uid+"/"+attribute)
            .once('value')
            .then((valuedb) => {
                if (attribute=="likes"){
                    return valuedb.val()+1;
                }
                return valuedb.val()-1;
            })
        }
        firebase.database().ref('doi_repository/' + doiKey + '/comments/' + uid+"/"+attribute).set(setvalue);
        let tempnode=firebase.database().ref('Review/'+uid);
        if (tempnode)
        {
            tempnode.child(attribute).set(setvalue);
        }
        tempnode=firebase.database().ref('PID/'+uid);
        if (tempnode)
        {
            tempnode.child(attribute).set(setvalue);
        }
    },

    async updateRole({ commit, state }, { toRole }){
        let userKey = firebase.auth().currentUser.uid;
        return firebase.database().ref('users/' + userKey)
        .once('value')
        .then((userinfo)=>{
            if (!userinfo.val().update[toRole])
            {
                firebase.database().ref('users/' + userKey+'/update/'+toRole).set(true);
                firebase.database().ref('updateRole/'+toRole+"/"+userKey).set(userinfo);
            }
        }).catch((error) => {
            //for debug only, will be finished later
            console.log(error.message);
        });  
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