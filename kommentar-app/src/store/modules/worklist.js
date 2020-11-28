import axios from 'axios';
const state = () => ({
    list: [],
    length: 0
})
const url = "http://api.crossref.org/works?query=";
const getters = {}


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
    author = author.join(";");
    return author;
}

const actions = {
    search({ commit, state }, { keyword }) {
        //set the information to the state,filter it into title author and doi(may changed from google firebase side)
        //commit('setlist',list)

        //give the first 10 information(Todo), can reuse changepage

        //convert keyword in this format list : keyword1+keyword2+...
        keyword = keyword.split(" ");
        keyword = keyword.join("+");
        var search_url = url + keyword + "&rows=10";
        console.log(search_url);
        let returnValue = {
            list: [
                /*{
                                    title: keyword,
                                    author: "You know WHO !!!",
                                    doi: "1232334234"
                                },
                                {
                                    title: "The 'book' of my own ",
                                    author: "You know WHO !!!",
                                    doi: "1232334234"
                                }*/
            ],
            length: 0
        }
        axios.get(search_url).then(res => {
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
        });
        commit('setlist', returnValue.list)
        return returnValue;
    },

    changepage({ commit, state }, { from, to }) {
        //use from and to to search out the matched answer
        let returnValue = {
            list: [{
                title: "The 'book' of my own ",
                author: "You know WHO !!!",
                doi: "1232334234"
            }]
        }
        return returnValue;
    }


}

const mutations = {

    setlist(state, list) {
        state.list = list
    },

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