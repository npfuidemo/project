function quora_pixel_npf(tracking_id, conversion_data) {
    !function(q,e,v,n,t,s){if(q.qp) return; n=q.qp=function(){n.qp?n.qp.apply(n,arguments):n.queue.push(arguments);}; n.queue=[];t=document.createElement(e);t.async=!0;t.src=v; s=document.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s);}(window, 'script', 'https://a.quora.com/qevents.js');
    qp('init', tracking_id);
    qp('track', 'Generic');
    if(conversion_data === 'complete_reg'){
        qp('track', 'Complete Registration');
    } else if(conversion_data === 'lead'){
        qp('track', 'Lead');
    } else if(conversion_data === 'purchase'){
        qp('track', 'Purchase');
    }
}