export default class Countdown{
    constructor(){
        this.countdown();

    }
//

    countdown(){
        var startWindowName = window.location.pathname;
        var interval = setInterval(() => {
            const now = new Date();
            const hours = 24 - now.getHours() - 1;
            const minutes = 60 - now.getMinutes() - 1;
            const seconds = 60 - now.getSeconds();

            //console.log(`${hours} hours ${minutes} minutes ${seconds} seconds`);
            (document.getElementById("refreshTime") as HTMLParagraphElement).innerHTML = `${hours}:${minutes}:${seconds}`;

            if(window.location.pathname != startWindowName)
                clearInterval(interval);

        }, 1000);
    }
}