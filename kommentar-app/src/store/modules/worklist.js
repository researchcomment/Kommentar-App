import axios from 'axios';
const state = () => ({
    list: [],
    length: 0,
    set:false
})
const url = "http://api.crossref.org/works?query=";
const getters = {}

var last_keyword = "";

function isNull(obj) {
    if (obj) {
        return false;
    } else {
        return true;
    }
}
//parameter is a referrence of a list of authors
//output is a string of author like: alice ; bob ; eve
function construct_author(author_ref) {
    var length = author_ref.length;
    let author = [];
    for (let i = 0; i < length; i++) {
        //author.push(author_ref[i].given + " " + author_ref[i].family);
        author.push(
            isNull(author_ref[i.given]) ? author_ref[i].family : author_ref[i].given + " " + author_ref[i].family
        )
    }
    author = author.join(" ; ");
    return author;
}
//async function return promise
async function get_worklist(keyword, rows, offset) {
    //convert keyword in this format list : keyword1+keyword2+...
    keyword = keyword.split(" ");
    keyword = keyword.join("+");
    var search_url = url + keyword + "&rows=" + rows + "&offset=" + offset;
    let returnValue = {
        list: [],
        length: 0
    }
    return axios.get(search_url).then(res => {
        //get reference : res -> data -> message
        let ref = res.data.message;
        if (!isNull(ref)) {
            for (var i = 0; i < ref.items.length; i++) {
                //actural reference of result list from crossref
                var item_ref = ref.items[i];
                //construct info which needed to be return
                var _title = !isNull(item_ref.title) ? item_ref.title[0] : "unkown";
                var _author = !isNull(item_ref.author) ? construct_author(item_ref.author) : "unkown";
                var _doi = !isNull(item_ref.DOI) ? item_ref.DOI : "unkown";
                returnValue.list.push({
                    title: _title,
                    author: _author,
                    doi: _doi
                });
            }
            returnValue.lenth = returnValue.list.length;
           
        } 
        return returnValue;
    }).catch(err => {
        console.log(err);}); 
}

const actions = {
    async search({ commit, state }, { keyword }) {
        //set the information to the state,filter it into title author and doi(may changed from google firebase side)
        //commit('setlist',list)
        console.log("keyword is : " + keyword);
        //give the first 10 information(Todo), can reuse changepage
        last_keyword = keyword;
        //wait inorder to know the setlest and setset will not earlier then them
        let returnValue =await get_worklist(keyword, 10, 0);
        commit('setlist', returnValue.list);
        commit('setset', true);
        return returnValue;
    },

    changepage({ commit, state }, { from, to }) {
        //use from and to to search out the matched answer
        /*let returnValue = {
            list: [{
                title: "The 'book' of my own ",
                author: "You know WHO !!!",
                doi: "1232334234"
            }]
        }*/
        let returnValue = get_worklist(last_keyword, to - from, from);
        commit('setlist', returnValue.list);
        return returnValue;
    }


}

const mutations = {

    setlist(state, list) {
        state.list = list
    },
    setset(state, set) {
        state.set = set
    }
    ,

    setusername(state, username) {
        state.username = username
    }

}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}