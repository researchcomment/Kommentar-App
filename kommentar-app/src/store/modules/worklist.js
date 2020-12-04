import axios from 'axios';
const state = () => ({
    list: [],
    length: 0
})
const url = "http://api.crossref.org/works?query=";
const getters = {}

var last_keyword = "";
var items = [];

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
        author.push(
            isNull(author_ref[i.given]) ? author_ref[i].family : author_ref[i].given + " " + author_ref[i].family
        )
    }
    author = author.join(" ; ");
    return author;
}

<<<<<<< Updated upstream
function get_worklist(keyword, rows, offset) {
    //convert keyword in this format list : keyword1+keyword2+...
    keyword = keyword.split(" ");
    keyword = keyword.join("+");
    var search_url = url + keyword + "&rows=" + rows + "&offset=" + offset;
    console.log(search_url);
    let returnValue = {
        list: [],
        length: 0
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
    return returnValue;
=======
function construct_returnValue(items, returnValue, from, to) {
    if (items[to]) {
        for (var i = from; i < to; i++) {
            var item_ref = items[i];
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
    } else {
        for (var i = from; i < items.length; i++) {
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
    }
    return returnValue;
}

//async function return promise
async function get_worklist(keyword, rows, offset, date) {
    if (offset % 100 == 0) {
        let returnValue = {
            list: [],
            length: 0
        };
        //convert keyword in this format list : keyword1+keyword2+...
        keyword = keyword.split(" ");
        keyword = keyword.join("+");
        let datefrom = date.from.getFullYear() + "-" +
            ((date.from.getMonth() + 1) < 10 ? "0" : "") + (date.from.getMonth() + 1) +
            "-" + (date.from.getDate() < 10 ? "0" : "") + date.from.getDate();
        let dateto = date.to.getFullYear() + "-" +
            ((date.to.getMonth() + 1) < 10 ? "0" : "") + (date.to.getMonth() + 1) + "-" +
            (date.to.getDate() < 10 ? "0" : "") + date.to.getDate();
        var search_url = url + keyword + "&filter=from-update-date:" + datefrom +
            ",until-update-date:" + dateto + "&select=DOI,title,author" +
            "&rows=" + 100 + "&offset=" + offset;
        console.log(search_url);
        return axios.get(search_url).then(res => {
            //get reference : res -> data -> message
            let ref = res.data.message;
            if (!isNull(ref)) {
                //save current 100 results in items as a list
                items = ref.items;
                returnValue = construct_returnValue(items, returnValue, offset % 100, offset % 100 + rows);
                returnValue.length = ref["total-results"];
            }
            return returnValue;
        }).catch(err => {
            console.log(err);
        });
    } else {
        let returnValue = {
            list: [],
            length: 0
        };
        returnValue = construct_returnValue(items, returnValue, offset % 100, offset % 100 + rows);
        return returnValue;
    }
>>>>>>> Stashed changes
}
const actions = {
<<<<<<< Updated upstream
    search({ commit, state }, { keyword }) {
=======
    async search({ commit, state }, { keyword, from, to, date }) {
>>>>>>> Stashed changes
        //set the information to the state,filter it into title author and doi(may changed from google firebase side)
        //commit('setlist',list)
        console.log("keyword is : " + keyword);
        //give the first 10 information(Todo), can reuse changepage
        last_keyword = keyword;
<<<<<<< Updated upstream
        let returnValue = get_worklist(keyword, 10, 0);
=======
        let pagefrom = 0;
        let pageto = 10;
        if (from)
            pagefrom = from;
        if (to)
            pageto = to;
        //wait inorder to know the setlest and setset will not earlier then them
        let returnValue = await get_worklist(keyword, pageto - pagefrom, pagefrom, date);
>>>>>>> Stashed changes
        commit('setlist', returnValue.list);
        return returnValue;
    },

    changepage({ commit, state }, { from, to }) {
<<<<<<< Updated upstream
        //use from and to to search out the matched answer
        /*let returnValue = {
            list: [{
                title: "The 'book' of my own ",
                author: "You know WHO !!!",
                doi: "1232334234"
            }]
        }*/
        let returnValue = get_worklist(last_keyword, to - from, from);
=======

        let returnValue = get_worklist(last_keyword, to - from, from, date.from, data.to);
>>>>>>> Stashed changes
        commit('setlist', returnValue.list);
        return returnValue;
    }


}

const mutations = {

    setlist(state, list) {
        state.list = list
    },
<<<<<<< Updated upstream
=======
    setset(state, set) {
        state.set = set
    },
>>>>>>> Stashed changes

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