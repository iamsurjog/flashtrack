class flashTrack{
    constructor(){
        this.url = window.location.href
        this.referrer = document.referrer || 'Direct'
        this.screenResolution = `${window.screen.width}x${window.screen.height}`
        this.timestamp = new Date().toISOString()

    }

} 

export function tracker(config) {
  return new flashTrack(config);
}
