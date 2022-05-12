/* whenever change this file make sure cdn cache must be purged */
let NpfWidgetsInit = class {
	constructor(options){
		this.widgetId 	= options.widgetId;
		this.formTitle 	= options.formTitle || 'Feedback Form';
		this.titleColor = options.titleColor || '#f4f4f4';
		this.backgroundColor = options.backgroundColor || '#36a9d6';
		this.buttonbgColor = options.buttonbgColor || '#ff0000';
		this.buttonTextColor = options.buttonTextColor || '#FFF';
		this.iframeHeight = options.iframeHeight || '400px';

		var baseurl = options.baseurl;

                var npfWidgetButton = document.getElementsByClassName("npfWidget-"+this.widgetId);
                for (var i = 0; i < npfWidgetButton.length; i++) {
                    npfWidgetButton[i].addEventListener('click', event => {
                        this.showPopup(this.widgetId,baseurl);
                    });
                }
                
		/*document.getElementsByClassName("npfWidget-"+this.widgetId).addEventListener("click", event => {
                    this.showPopup(this.widgetId,baseurl);
  		});*/

		this.crElem();
		this.crStyle();
	}

	crElem = function(){
		var npfPopup = document.createElement("div");
		npfPopup.setAttribute("id", "popup-"+this.widgetId);
		npfPopup.className = "npfPopup";

		var npfPopupIn = document.createElement("div");
		npfPopupIn.setAttribute("id", "popup-in-"+this.widgetId);

		var npfPopupBack = document.createElement("div");
		npfPopupBack.setAttribute("id", "popup-back-"+this.widgetId);

		var newPara = document.createElement("div");
		newPara.className = "npfTitle npfTitle-"+this.widgetId;
		var textNode = document.createTextNode(this.formTitle);
		var closeIcon = document.createElement('img');
                closeIcon.setAttribute("id","npfWdgclose-"+this.widgetId);
		closeIcon.src= 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABzUlEQVRYhe3Wy27TYBAF4A+2ZAkRECpuFeVdemFL6RMAZYHaF2FHEQ9QhRYJBDwILCo2sKDsoV2FEMzin8iRaxzbKeqiPZKl5J8zM8dje2Y4w2nHuYb8OdzDIm7Ef/iGr3iPN9g/LoFj9LCFIbIp1wh9XD+u5Cs4iOADbOM+FnAhrgWshm0Q3AMsz5r8iXRHmXRXN2v43MKOvBrrbZOvRIDfeNrCfyN8R1pUoicve5vkkyIy/MSVJo4v5WWfFbsRa6uuw5xUuoHyZ/4Q3ZLzbtiKuB2xhlJlp2JdUrxdYnsUtk8FEd04y4JTRL/CdgQfgrxaYptMNBZRdlbEWtjf1RHwOch3/mEvJpyWnNQnMuzVEXAY5E4F5xI+yrvfHi5X8DvBOywazpeQszoqS1A1V8Z5/tQJdOKP4MRfwsf+32dY1ieO4JrUNAbSYCmiaSOa17ARwQtJ8U5dhwq8jljPmzhdlQ+jjRmSb0aMH6o/01Isy8dxGxGb8nG82MIfaS6MF5JdabBMw7y87CPppZ4JS9I8H69kfTzAXanDdeL3Gl7hl7zsre+8iIt4pt5SOpRmf60FpOla3pNWtSVpV5hcy79Ia/lbfG8Y9wynGH8BHnKpr/YwVJ8AAAAASUVORK5CYII=';
		//newPara.insertBefore(textNode, closeIcon);
		newPara.appendChild(textNode);
		newPara.appendChild(closeIcon);
		npfPopupIn.appendChild(newPara);

		
		var paraContent = document.createElement("div");
		paraContent.setAttribute("id", "popup-message-"+this.widgetId);
		paraContent.className = "npfPopup-message";
		npfPopupIn.appendChild(paraContent);
		npfPopup.appendChild(npfPopupIn);
		npfPopup.appendChild(npfPopupBack);
		document.body.appendChild(npfPopup);
	}

	crStyle = function(){
		var css = '.npfTitle img{float:right;position:relative;top:-5px;cursor:pointer;} .npfWidget-'+this.widgetId+'.npfWidgetButton{background-color:'+this.buttonbgColor+';border:none;padding: 6px 15px;color:'+this.buttonTextColor+';border-radius:4px;position:relative;z-index:11;cursor:pointer;}.npfWidgetButton:hover, .npfWidgetButton:focus{outline:none;}.npfTitle-'+this.widgetId+' {color: '+this.titleColor+';text-align:left;font-size:18px;font-weight:700;margin-bottom:10px;}#popup-'+this.widgetId+' {position: fixed; z-index: 13;top:0;width: 100vw;height: 100vh;display: none;}#popup-back-'+this.widgetId+' {background-color: rgba(0, 0, 0, 0.75);position: fixed; top: 0;left: 0;bottom: 0;right: 0;z-index:1;}#popup-in-'+this.widgetId+' {background: '+this.backgroundColor+';width:100%;padding:20px;max-width:500px;margin:2rem auto;border-radius:10px;text-align:center;z-index:111;position:relative;}',
	    head = document.head || document.getElementsByTagName('head')[0],
	    style = document.createElement('style');

		head.appendChild(style);
		style.type = 'text/css';
		if (style.styleSheet){
		  // This is required for IE8 and below.
		  style.styleSheet.cssText = css;
		} else {
		  style.appendChild(document.createTextNode(css));
		}
	}

	setInnerHTML = function(elm, html) {
	  elm.innerHTML = html;
	  Array.from(elm.querySelectorAll("script")).forEach( oldScript => {
	    const newScript = document.createElement("script");
	    Array.from(oldScript.attributes)
	      .forEach( attr => newScript.setAttribute(attr.name, attr.value) );
	    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
	    oldScript.parentNode.replaceChild(newScript, oldScript);
	  });
	}

	npfElement = function(id) {
		return document.getElementById(id);
	}
	//displays the notifier
	showPopup = function(wgid,burl) {
		var npfpopup = document.getElementsByClassName("npfPopup");

		for (var i=0, len=npfpopup.length|0; i<len; i=i+1|0) {
		    npfpopup[i].style.display="none";
		}

		//npfpopup.style.display="none";
		var npfpopMsg = document.getElementsByClassName("npfPopup-message");
		for (var i=0, len=npfpopMsg.length|0; i<len; i=i+1|0) {
		    npfpopMsg[i].innerHTML="";
		}
		//npfpopMsg.innerHTML="";


		this.setInnerHTML(this.npfElement('popup-message-'+this.widgetId), '<div class="npf_wgts" data-height="'+this.iframeHeight+'" data-w="'+wgid+'"></div><script type="text/javascript">var s=document.createElement("script"); s.type="text/javascript"; s.async=true; s.src="https://'+burl+'/emwgts.js"; document.body.appendChild(s);<\/script>');
		//makes the notifier visible
		this.npfElement("popup-"+this.widgetId).style.display="block";

		this.npfElement("npfWdgclose-"+this.widgetId).addEventListener("click", event => {
                    this.cloePopup();
  		});
	}
        //displays the notifier
	cloePopup = function() {
		var npfpopup = document.getElementsByClassName("npfPopup");

		for (var i=0, len=npfpopup.length|0; i<len; i=i+1|0) {
		    npfpopup[i].style.display="none";
		}

		//npfpopup.style.display="none";
		var npfpopMsg = document.getElementsByClassName("npfPopup-message");
		for (var i=0, len=npfpopMsg.length|0; i<len; i=i+1|0) {
		    npfpopMsg[i].innerHTML="";
		}
		//makes the notifier visible
		this.npfElement("popup-"+this.widgetId).style.display="none";
	}
};