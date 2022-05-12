var i = 'abucsdf@yopmail.com';

var aaa = '&lwe='+i;

/*if (typeof npf_c != "undefined" && npf_c && typeof npf_w != "undefined" && npf_w) {
    var npffx = rCookie("npffx");
    
    
    var r = document.referrer; 
    var l = location.hostname; 
    var u = location.href; 
   
    s=1;
    
    if(u.indexOf("utm_source")>0 || u.indexOf("gclid")>0){
        s=0;
    }
    
    
    if (npffx == "" || s==0) {
        
        var npf_furl='';
        var npf_qV = window.location.search.replace('?', '').split('&'); 
        var npf_qL = ''; 
        if (npf_qV != '') { 
            for (i = 0; i < npf_qV.length; i++) { 
                if(npf_qL!='')npf_qL=npf_qL+"||";
                npf_qL=npf_qL+npf_qV[i].split('=')[0]+"@@"+npf_qV[i].split('=')[1];
            } 
        }
        var npf_r = document.referrer; 
        if(npf_m=="1")url_track="https://track.nopaperforms.com/?tpc";
        else url_track="https://st.nopaperforms.com?tpc";
        //else url_track="https://track.npf.com?tpc";
        npf_furl=url_track+"&r="+npf_r+"&q="+npf_qL+"&d="+npf_d+"&c="+npf_c;
        
        var ifrm = document.createElement("iframe");
        ifrm.setAttribute("src", npf_furl);
        ifrm.style.width = "0px";
        ifrm.style.height = "0px";
        document.body.appendChild(ifrm);
        
        if(l=="localhost"){
           dco=l;
        }else{
           dco = (l.match(/([^.]+)\.\w{2,3}(?:\.\w{2})?$/) || [])[0];
        }
        document.cookie = "npffx=1;domain=."+dco+";expires=0; path=/";
        //alert("Aaaa");
    }
}
function rCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return '';
}
*/

