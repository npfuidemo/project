function openTab(item,indexId,tabId) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabdata"+tabId);
    for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks"+tabId);
    for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(indexId).style.display = "block";
    item.classList.add("active")
}

function openRichTab(item,indexId,tabId) {
    var i, richtabcontent, richtablinks;
    richtabcontent = document.getElementsByClassName("richtabdata"+tabId);
    for (i = 0; i < richtabcontent.length; i++) {
            richtabcontent[i].style.display = "none";
    }
    richtablinks = document.getElementsByClassName("richtablinks"+tabId);
    for (i = 0; i < richtablinks.length; i++) {
            richtablinks[i].className = richtablinks[i].className.replace(" active", "");
    }
    document.getElementById(indexId).style.display = "block";
    item.classList.add("active")
}