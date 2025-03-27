export default class ChampGuesser{
    random = Math.floor(Math.random() * 13)
    numOfGuesses = 0;
    
    constructor(){
        // this.GetChamps();
        this.Initialize();
    }

    async GetChamps(){
        const response = await fetch("http://localhost:4000/characters");
        // console.log(response.json())
        return await response.json();
    }

    async Initialize(){
        const rnd = (await this.GetChamps())[this.random];
        // console.log(await this.GetChamps())
        this.GetRandomQuote(rnd);
        document.querySelector("#guess_champ_btn")?.addEventListener('click', async () => {
            this.DisplayGuess(rnd, await this.GetChamps())
        })

    }

    GetRandomQuote(champ: any){
        console.log(champ);
        // console.log(champ.voicelines.length);
        let randomLineIndex = Math.floor(Math.random() * champ.voicelines.length);
        document.querySelector("#quoteHolder p")!.innerHTML = champ.voicelines[randomLineIndex];
    }

    async DisplayGuess(champ: any, champs: any){
        const guess = (document.querySelector("#champ_search")as HTMLInputElement).value;
        let champGuess;
        for(let i = 0; i < champs.length; i++){
            if(champs[i].name.toLowerCase().includes(guess.toLowerCase())) champGuess = champs[i];
        }
        
        console.log(champ);
        console.log(champGuess);

        if(champGuess != null){
            let row: HTMLDivElement = document.createElement("div") as HTMLDivElement;
            row.className = "flex flex-row items-center justify-center gap-2 bg-gray-900 w-min py-4 px-6";
            row.innerHTML = `
                <p class="text-center image w-20 h-20 bg-gray-800"><img src="./public/images/legends_cards/${champGuess.name}_Legend_Card.webp" class="-translate-y-2.5" alt="${champGuess.name}"></p>
                <p class="text-center name w-30 text-2xl">${champGuess.name}</p>
            `;
            document.querySelector("#guesses")?.appendChild(row);
            this.numOfGuesses++;
            this.CheckCorrectGuess(champGuess.name, champ.name);
        }

    }

    CheckCorrectGuess(guess: string, champ: string) {
        if(guess == champ){
            document.querySelector("#search")!.innerHTML = `<h4>Gratulálok eltaláltad!</h4><p>Próbálozások száma: ${this.numOfGuesses}</p>` ;
        }
    }
}