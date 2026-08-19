class flashTrack{
    constructor(getList = {}, watchList = {}){
        this.url = window.location.href
        this.referrer = document.referrer || 'Direct'
        this.screenResolution = `${window.screen.width}x${window.screen.height}`
        this.timestamp = new Date().toISOString()

        // For custom parameters
        Object.assign(this, getList)

        this.watchList = watchList

        this.listeners = {};

        this.initWatchers()

    }

    // Method to register event hooks (e.g., tracker.on('mouseMove', (data) => {}))
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
        return this; // Allows method chaining
    }
    
    // Internal emitter method
    _emit(event, data) {
        // Trigger any custom .on() listeners
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }

        // Optional: Also allow passing direct callbacks in the watchList config
        if (typeof this.watchList[event] === 'function') {
            this.watchList[event](data);
        }
    }

    initWatchers() {
        // Optional: Throttle this if performance becomes an issue
        window.addEventListener('mousemove', (e) => {
            this._emit('mouseMove', {
                x: e.clientX,
                y: e.clientY,
                timestamp: new Date().toISOString(),
                element: e?.target?.innerText
            });
        });


        for (const [eventName, dataExtractor] of Object.entries(this.watchList)) {
            
            // Only attach an event listener if they provided a function
            if (typeof dataExtractor === 'function') {
                
                // eventName will automatically be 'mouseover', 'resize', 'click', etc.
                window.addEventListener(eventName, (e) => {
                    
                    // Call the user's function and pass the event object 'e'
                    const userFields = dataExtractor(e) || {};
                    
                    const payload = {
                        timestamp: new Date().toISOString(),
                        ...userFields
                    };

                    // Emit using the exact name of the event
                    this._emit(eventName, payload);
                });
            }
        }
    }

} 

export function tracker(getList, watchList) {
  return new flashTrack(getList, watchList);
}
