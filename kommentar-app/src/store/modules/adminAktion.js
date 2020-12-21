import firebase from "firebase/app";


const state = () => ({
  
})

const getters = {}
const actions = {
    
    //the function that used from app-admin side.
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
    updateRole({ commit, state }, {flag,userKey,feedback_content, toRole }){
        firebase.database().ref('updateRole/'+toRole).child(userKey).remove();
        firebase.database().ref('users/' + userKey+'/update/'+toRole).set(false);
        if (flag)
        {
            firebase.database().ref('users/' + userKey+'/role')
            .once('value')
            .then((roles)=>{
                let setroles=roles.val();
                setroles.push(toRole);
                firebase.database().ref('users/' + userKey+'/role').set(setroles);
            })
        }
        if (feedback_content){
            firebase.database().ref("users/"+userKey+"/Messagebox/"+toRole).set({
                feedbackContent:feedback_content,
                toRole:toRole,
            }); 
        }
        return 1;
    },
    //actions for reviewer
    async getCommentListForRequest({ commit, state },{requestType}){
        return firebase.database().ref(requestType)
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

    //flag:true agree with PID
    replyRequest({ commit, state,dispatch },{doi,user_id,requestType,comment_uid,comment_content,feedback_content,flag}){
        let doiKey=doi.replaceAll(".","'");
        firebase.database().ref(requestType).child(comment_uid).remove();
        dispatch('askFromUser/setAttribute',{
                uid:comment_uid, 
                doi:doi ,
                attribute:"status/"+requestType,
                value:false  
            },{ root: true });
        if (feedback_content){
            firebase.database().ref("users/"+user_id+"/Messagebox/"+comment_uid).set({
                feedbackContent:feedback_content,
                commentContent:comment_content,
                doi_nr:doi
            }); 
        }
        
        if (requestType=="PID" && flag){
            firebase.database().ref("users/"+user_id+"/comments/"+comment_uid+"/type").set("official");
            firebase.database().ref("Review").child(comment_uid).remove();
            dispatch('askFromUser/setAttribute',{
                uid:comment_uid, 
                doi:doi ,
                attribute:"type",
                value:"official" 
            },{ root: true });
            dispatch('askFromUser/setAttribute',{
                uid:comment_uid, 
                doi:doi ,
                attribute:"PermanentID",
                value: comment_uid
            },{ root: true });
            
        }
    }

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