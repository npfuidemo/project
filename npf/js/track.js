function cBrow(){
    // Opera 8.0+
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

    // Firefox 1.0+
    var isFirefox = typeof InstallTrigger !== 'undefined';

    // Safari 3.0+ "[object HTMLElementConstructor]" 
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/false || !!document.documentMode;

    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;

    // Chrome 1+
    var isChrome = !!window.chrome && !!window.chrome.webstore;

    // Blink engine detection
    var isBlink = (isChrome || isOpera) && !!window.CSS;
    if(isFirefox || isChrome || isOpera){
        return true;
    }else{
        return false;
    }
}

function parseURL(url) {
    var a = document.createElement('a');
    a.href = url;
    return {
        href: url,
        protocol: a.protocol.replace(':',''),
        host: a.hostname,
	hostname: a.hostname,
        port: a.port,
        search: a.search,
        params: (function(){
            var ret = {},
            seg = a.search.replace(/^\?/,'').split('&'),
            len = seg.length, i = 0, s;
            for (;i<len;i++) {
                if (!seg[i]) { continue; }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
        hash: a.hash.replace('#',''),
        pathname: a.pathname.replace(/^([^\/])/,'/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
        segments: a.pathname.replace(/^\//,'').split('/')
    };
}

function stTrack(){
    if (typeof npf_d != "undefined" && npf_d && typeof npf_c != "undefined" && npf_c) {
//        var npf_fx = rCookie("npf_fx");
        var npfwg = rCookie("npfwg");


        var r = document.referrer; 
        var l = location.hostname; 
        var u = location.href; 

        s=1;

        if(u.indexOf("utm_source")>0 || u.indexOf("gclid")>0){
            s=0;
        }else if(npfwg!=""){
            var r = rCookie("npf_r"); 
            var l = rCookie("npf_l"); 
//            var u = rCookie("npf_u"); 
        }

        if (s==0 || (u.trim() != rCookie("npf_u").trim())) {
            var npf_furl='';
            //var fu=new URL(u);
            if(cBrow()){
                var fu=new URL(u);
            }else{
                var fu=parseURL(u);
            }
            var npf_qV = fu.search.replace('?', '').split('&'); 
            var npf_qL = ''; 
            if (npf_qV != '') { 
                for (i = 0; i < npf_qV.length; i++) { 
                    if(npf_qL!='')npf_qL=npf_qL+"||";
                    npf_qL=npf_qL+npf_qV[i].split('=')[0]+"@@"+npf_qV[i].split('=')[1];
                } 
            }
            var npf_r = r;//document.referrer; 
            var npf_d_arr = npf_d.split(",");
            var npf_c_arr = npf_c.split(",");
            for(i=0;i<npf_d_arr.length;i++){
                npf_furl=widget_d+"/cwtrkWidget/?r="+npf_r+"&q="+npf_qL+"&d="+npf_d_arr[i]+"&c="+npf_c_arr[i]+"&cu="+u;
                var xmlHttp = new XMLHttpRequest();
                xmlHttp.open("GET", npf_furl, true);
                xmlHttp.withCredentials = true;
                xmlHttp.send(null);
            }

            if(l=="localhost"){
               dco=l;
            }else{
               dco = (l.match(/([^.]+)\.\w{2,3}(?:\.\w{2})?$/) || [])[0];
            }
            if(typeof dco==="undefined") {
                dco =l;
            }
            //document.cookie = "npfwg=1;domain=."+dco+";expires=0; path=/";
            document.cookie = "npf_r="+r+";domain="+l+";expires=0; path=/";
            document.cookie = "npf_l="+l+";domain="+l+";expires=0; path=/";
            document.cookie = "npf_u="+u+";domain="+l+";expires=0; path=/";
            document.cookie = "npf_fx=1;domain="+l+";expires=0; path=/";
            //alert("Aaaa");
        }
    }
}
window.onload=stTrack();

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


