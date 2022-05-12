window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', google_ads_conversion_id);

function gtag_report_conversion(url) {
    var callback = function () {
      if (typeof(url) != 'undefined') {
        window.location = url;
      }
    };
    gtag('event', 'conversion', {
        'send_to': google_ads_conversion_id+'/'+google_ads_conversion_label,
        'event_callback': callback
    });
    return false;
}

