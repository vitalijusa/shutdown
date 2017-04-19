const PubnubClass = require('pubnub');

module.exports = {
    Pubnub: Pubnub
};

function Pubnub(userId, publishKey, subscribeKey) {
    var self = this;
    var channel = "shutdown";

    var pubnub = new PubnubClass({
        publishKey: publishKey,
        subscribeKey: subscribeKey,
        uuid: userId
    });

    pubnub.addListener({
        status: function(statusEvent){
            console.log("status changed:", statusEvent);

            if (statusEvent.category === "PNConnectedCategory") {
                var newState = {
                    name: 'presence-tutorial-user',
                    timestamp: new Date()
                };
                pubnub.setState(
                    { 
                        channels: [channel],
                        state: newState 
                    }
                );
            }
        },
        message: function(message){
            console.log(message)
        },
        presence: function(presenceEvent){
            console.log(presenceEvent);
        }
    })

    pubnub.subscribe({
        channels: [channel],
        withPresence: true
    });



    self.hereNow = function() {
        pubnub.hereNow(
            {
                channels: [channel],
                includeState: true
            },
            function(status, response){
                console.log(response);
            }
        );
    };
}