function get_data_crossref(doi) {
    axios.get("http://api.crossref.org/members/98").then(function(res) {
        console.log(res.data)
    });
}