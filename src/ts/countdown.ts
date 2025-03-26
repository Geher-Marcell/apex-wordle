export default class Countdown{
    constructor(){
        this.countdown();

    }
//

    countdown(){
        var startWindowName = window.location.pathname;
        var interval = setInterval(() => {
            if(window.location.pathname != startWindowName)
                clearInterval(interval);


            const now = new Date();
            const hours = 24 - now.getHours() - 1;
            const minutes = 60 - now.getMinutes() - 1;
            const seconds = 60 - now.getSeconds();

            //console.log(`${hours} hours ${minutes} minutes ${seconds} seconds`);
            var p = (document.getElementById("refreshTime") as HTMLParagraphElement);
            if(p) p.innerHTML = `${hours}:${minutes}:${seconds}`; //FIXED BY geher-marcell


        }, 1000);
    }
}