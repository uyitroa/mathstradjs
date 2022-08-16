function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            callback(xmlHttp.responseText);
        }
    }
    xmlHttp.open ("GET", theUrl, true)
    xmlHttp.send(null);
}

function getUrl(url, params) {
    url += "?";
    for (var key in params) {
        url += key + "=" + params[key] + "&";
    }

    return url
}

export {httpGetAsync, getUrl}