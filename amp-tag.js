const SDK_VERSION = '2.4.3'

initProfigAndTag()

function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function setFirstPartyCookie() {
    const COOKIE_NAME = 'ogury-ssp'

    const d = new Date()
    d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000)
    const expires = 'expires=' + d.toUTCString()
    const cookieValue = uuidv4()
    document.cookie = COOKIE_NAME + '=' + cookieValue + ';' + expires + ';path=/'
    return cookieValue
}

function initProfigAndTag() {
    const userId = setFirstPartyCookie()
    const httpSendObject = {
        url: 'https://pad-v3.presage.io/v3/p-wm',
        httpData: {
            headers: { user: userId },
            body: {
                device: {
                    screen: {
                        height: window.screen.height,
                        width: window.screen.width,
                        density: window.devicePixelRatio,
                    },
                },
            },
        }
    }

    const httpRequest = new XMLHttpRequest()
    httpRequest.open('POST', httpSendObject.url)

    httpRequest.setRequestHeader('Content-Type', 'application/json')
    Object.keys(httpSendObject.httpData.headers).forEach((key) => {
        httpRequest.setRequestHeader(key, httpSendObject.httpData.headers[key])
    })

    httpRequest.timeout = 3000

    httpRequest.withCredentials = true

    httpRequest.onload = () => {
        if (httpRequest.status === 200) {
            requestAd(userId)
        }
    }
    
    httpRequest.onerror = () => {
        console.log('onerror profig')
    }
    
    httpRequest.ontimeout = () => {
        console.log('ontimeout profig')
    }

    httpRequest.send(JSON.stringify(httpSendObject.httpData.body))
}

function requestAd(userId) {
    const adRequests = [{
        ad_unit_id: '304747_default',
        params: {
            max_height: 180,
            max_width: 180,
        },
    }];

    const adRequestData = {
        headers: {
            asset_key: 'OGY-F52E9FC5009F',
            request_id: uuidv4(),
            consent: 'CPFuZORPFuZORAtACAENAwCMAP_AAH_AAAqIAPgAAAAIAPgAAAAIAAA.IGLtV_T9fb2vj-_Z99_tkeYwf95y3p-wzhheMs-8NyZeH_B4Wv2MyvBX4JiQKGRgksjLBAQdtHGlcTQgBwIlViTLMYk2MjzNKJrJEilsbO2dYGD9Pn8HT3ZCY70-vv__7v3ff_3g',
            User: userId
        },
        body: {
            context: {
                location: window.location.href,
                advert_delivery_type: 'GAM',
            },
            ad_requests: adRequests,
            test_campaign_ids: ["105823"]
        },
    }

    const httpSendObject = {
        url: 'https://webmobile.presage.io/api/request-ad',
        method: 'POST',
        httpData: {
            headers: {
                'X-Asset-Key': adRequestData.headers.asset_key,
                'X-Request-ID': adRequestData.headers.request_id,
                'X-Web-Sdk-Version': SDK_VERSION,
                'User': adRequestData.headers.User,
            },
            body: adRequestData.body,
        },
    }

    if (adRequestData.headers.consent) {
        httpSendObject.httpData.headers['X-Consent'] = adRequestData.headers.consent
    }

    if (adRequestData.headers.user) {
        httpSendObject.httpData.headers['User'] = adRequestData.headers.user
    }

    const httpRequest = new XMLHttpRequest()
    httpRequest.open('POST', httpSendObject.url)

    httpRequest.setRequestHeader('Content-Type', 'application/json')
    Object.keys(httpSendObject.httpData.headers).forEach((key) => {
        httpRequest.setRequestHeader(key, httpSendObject.httpData.headers[key])
    })

    httpRequest.timeout = 3000

    httpRequest.withCredentials = true

    httpRequest.onload = () => {
        console.log('onload requestad')
        
        if (httpRequest.status === 200) {
            let adResponse = JSON.parse(httpRequest.responseText)
            adResponse = adResponse[0]
            
            if (adResponse.hasOwnProperty('ad_content')) {
                console.log('Ad request fill')
                const msAdsURL = adResponse.ad_content
                loadFormat(msAdsURL)
            } else {
                console.log('Ad request no fill')
                document.body.innerHTML="<div style='width:100%;height:100%;padding-top:25px;text-align:center;'><a href='https://www.ogury.com'><img src='https://jogury.github.io/og-logo.png' /></a></div>";
            }
        } else if (httpRequest.status === 204) {
            console.log('Ad request no fill')
            document.body.innerHTML="<div style='width:100%;height:100%;padding-top:25px;text-align:center;'><a href='https://www.ogury.com'><img src='https://jogury.github.io/og-logo.png' /></a></div>";
            return    
        } else {
            document.body.innerHTML="<div style='width:100%;height:100%;padding-top:25px;text-align:center;'><a href='https://www.ogury.com'><img src='https://jogury.github.io/og-logo.png' /></a></div>";
            return
        }
    }
    
    httpRequest.onerror = () => {
        console.log('onerror requestad')
    }
    
    httpRequest.ontimeout = () => {
        console.log('ontimeout requestad')
    }

    httpRequest.send(JSON.stringify(httpSendObject.httpData.body))
}

function loadFormat(msAdsURL) {
    const mraidScript = document.createElement('script')
    mraidScript.src = 'https://mraid.presage.io/f838b9b/mraid.js'
    
    const formatScript = document.createElement('script')
    formatScript.src = msAdsURL
    
    mraidScript.addEventListener('load', () => {
        document.body.appendChild(formatScript)
    })
    
    window.OGYClientMRAIDWeb = {
        mwebFlag: true,
    }
    
    window.addEventListener('calltag', (e) => {
        if (e.detail.method === 'bunaZiua') playVideo()
    })
    
    document.head.appendChild(mraidScript)
}

function playVideo() {
    const x = 0
    const y = 0
    const width = 200
    const height = 112
    const ogySdkMraidGateway = window.ogySdkMraidGateway

    ogySdkMraidGateway.updatePlacementType('inline')
    ogySdkMraidGateway.updateSupportFlags({
        sms: false,
        tel: false,
        calendar: false,
        storePicture: false,
        inlineVideo: false,
        vpaid: false,
        location: false,
    })
    ogySdkMraidGateway.updateScreenSize({ width: window.innerWidth, height: window.innerHeight })
    ogySdkMraidGateway.updateDefaultPosition({
        properties: { x, y, width, height },
    })
    ogySdkMraidGateway.updateCurrentPosition({
        properties: { x, y, width, height },
    })
    ogySdkMraidGateway.updateOrientationProperties({
        properties: { allowOrientationChange: true, forceOrientation: 'none' },
    })
    ogySdkMraidGateway.updateResizeProperties({
        properties: {
            width,
            height,
            offsetX: x,
            offsetY: y,
            customClosePosition: '',
            allowOffscreen: true,
        },
    })
    ogySdkMraidGateway.updateExpandProperties({
        properties: { width, height, useCustomClose: false, isModal: false },
    })
    ogySdkMraidGateway.updateState('default')
    ogySdkMraidGateway.updateMaxSize({ width, height })
    ogySdkMraidGateway.updateViewability(true)
    ogySdkMraidGateway.updateExposure({ exposedPercentage: 100 })
}
 
window.addEventListener('calltag', function (e) {
    switch (e.detail.method) {
        case 'expand':
            console.log("expand");
        case 'close':
            console.log("close");
        case 'open':
            console.log("open");
            openLink(e.detail.args.url)
        case 'useCustomClose':
            console.log("useCustomClose");
        case 'bunaZiua':
        break;
        case 'ogyForceClose':
            console.log("ogyForceClose");
            //document.getElementsByTagName("amp-sticky-ad")[0].style.display='none'; // unsuccessful attempt to close the sticky ad as we don't have access to the parent DOM in this context
            document.body.innerHTML="<div style='width:100%;height:100%;padding-top:25px;text-align:center;'><a href='https://www.ogury.com'><img src='' /></a></div>";
            break;
        default:
            console.log("event "+e.detail.method);
    }
});

function openLink(url) {
    if (url) {
        window.open(url)
        document.body.innerHTML="<div style='width:100%;height:100%;padding-top:25px;text-align:center;'><a href='https://www.ogury.com'><img src='https://jogury.github.io/og-logo.png' /></a></div>";
    }
}