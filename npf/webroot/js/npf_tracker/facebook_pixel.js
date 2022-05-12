function facebook_pixel_npf(tracking_id, conversion_data) {
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', tracking_id);
    fbq('track', 'PageView');
    if(conversion_data === 'complete_reg'){
        fbq('track', 'Complete Registration');
    } else if(conversion_data === 'lead'){
        fbq('track', 'Lead');
    } else if(conversion_data === 'purchase'){
        fbq('track', 'Purchase');
    }
}

