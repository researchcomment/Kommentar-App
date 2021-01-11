import firebase from "firebase/app";


const state = () => ({
  
})

const getters = {}
const actions = {

    //requestType is Review/PID
    async askForRequest({ dispatch }, { uid,doi, requestType }) {
        let doiKey=doi.replaceAll(".","'");
        return firebase.database().ref('doi_repository/' + doiKey + '/comments/' + uid)
        .once('value')
        .then((commentinfo) => {
            if (!commentinfo.val().status[requestType])
            {
                firebase.database().ref(requestType+'/' + uid).set(commentinfo.val());
                dispatch('setAttribute',{
                    uid:uid, 
                    doi:doi ,
                    attribute:"status/"+requestType,
                    value:true
                });
            }
        }).catch((error) => {
            //for debug only, will be finished later
            console.log(error.message);
        });      
    },
    async askForRequestCancel({ dispatch }, { uid,doi, requestType }) {
        let doiKey=doi.replaceAll(".","'");
        firebase.database().ref(requestType).child(uid).remove();
        dispatch('setAttribute',{
            uid:uid, 
            doi:doi ,
            attribute:"status/"+requestType,
            value:false
        });
    },
    deleteComment({}, { uid,doi }){
        let doiKey=doi.replaceAll(".","'");
        firebase.database().ref('doi_repository/' + doiKey + '/comments').child(uid).remove();
        let userKey = firebase.auth().currentUser.uid;
        firebase.database().ref('users/' + userKey + '/comments').child(uid).remove();
        firebase.database().ref('Review').child(uid).remove();
        firebase.database().ref('PID').child(uid).remove();
        
    },

    async setAttribute({ }, { uid, doi ,attribute,value  }){
        let doiKey=doi.replaceAll(".","'");
        let setvalue=value;
        if ((attribute=="likes") || (attribute=="dislikes"))
        {
            setvalue=await firebase.database().ref('doi_repository/' + doiKey + '/comments/' + uid+"/"+attribute)
            .once('value')
            .then((valuedb) => {
                return valuedb.val()+1;
            })
        }
        if (attribute=="content")
            firebase.database().ref('doi_repository/' + doiKey + '/comments/' + uid+"/createDate").set(new Date().toString());
        firebase.database().ref('doi_repository/' + doiKey + '/comments/' + uid+"/"+attribute).set(setvalue);
        firebase.database().ref('Review/'+uid).once('value')
        .then((info) => {
            if (info.val())
            {
                firebase.database().ref('Review/'+uid+"/"+attribute).set(setvalue);
                if (attribute=="content")
                    firebase.database().ref('Review/'+uid+"/createDate").set(new Date().toString());
            }
        }).catch((error) => {
            //for debug only, will be finished later
            console.log(error.message);
        });
        firebase.database().ref('PID/'+uid).once('value')
        .then((info) => {
            if (info.val())
            {
                firebase.database().ref('PID/'+uid+"/"+attribute).set(setvalue);
                if (attribute=="content")
                    firebase.database().ref('PID/'+uid+"/createDate").set(new Date().toString());
            }
        }).catch((error) => {
            //for debug only, will be finished later
            console.log(error.message);
        });
    },

    async updateRole({}, { toRole }){
        let userKey = firebase.auth().currentUser.uid;
        return firebase.database().ref('users/' + userKey)
        .once('value')
        .then((userinfo)=>{
            if (!userinfo.val().update[toRole])
            {
                firebase.database().ref('users/' + userKey+'/update/'+toRole).set(true);
                firebase.database().ref('updateRole/'+toRole+"/"+userKey).set(
                    userinfo.val()
                );
            }
        }).catch((error) => {
            //for debug only, will be finished later
            console.log(error.message);
        });  
    },
    async updateRoleCancel({ }, { toRole }){
        let userKey = firebase.auth().currentUser.uid;
        firebase.database().ref('updateRole/'+toRole).child(userKey).remove();
        firebase.database().ref('users/' + userKey+'/update/'+toRole).set(false);
    },
    //message_id: one of ['Researcher', 'Reviewer','Moderator','Admin'] for UpdatedateMessage
    //comment_id for commentrequestMessage
    deleteMessageFromBox({},{message_id}){
        let userKey = firebase.auth().currentUser.uid;
        firebase.database().ref('users/' + userKey+'/Messagebox').child(message_id).remove();
    },
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