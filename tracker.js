class flashTrack{
    constructor(getList = {}, watchList = {}){
        this.url = window.location.href
        this.referrer = document.referrer || 'Direct'
        this.screenResolution = `${window.screen.width}x${window.screen.height}`
        this.timestamp = new Date().toISOString()

        // For custom parameters
        Object.assign(this, getList)

    }

} 

export function tracker(config) {
  return new flashTrack(config);
}
