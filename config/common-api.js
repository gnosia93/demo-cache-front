module.exports = (() => {
    return {
       // 'endpoint': 'http://InternetFacingLB-1710592160.ap-northeast-2.elb.amazonaws.com',
       'endpoint': () => { return process.env.API_ENDPOINT },
       'prettyJson' :
             (str) => { 
                return JSON.stringify(JSON.parse(str), null, 4);        
             },  
        'toJson' :
             (str) => { return JSON.parse(str); },
        'session':
             (req) => { return {
                            "id" : req.sessionID, 
                            "age": req.session.cookie.maxAge,
                            "expires": req.session.cookie.expires
                        } 
                      },
        'newSession' : 
             (req) => {
                         var agent = req.headers['user-agent'];
                         if(!agent.includes('ELB-HealthChecker')) {

                              console.log("session id " + req.sessionID);
                              req.session.endpoint =  req.hostname + ":" + 
                                                  req.socket.localPort + req.baseUrl + req.url;
                              req.session.agent = req.headers['user-agent'];
                         }
                      }              
    }
}) ();
