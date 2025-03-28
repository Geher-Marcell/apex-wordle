import SeededRandom from "./SeededRandom.ts";

export default class ChampGuesser{
    rnd = new SeededRandom(new Date().getDate().toString()); //SEEDED RANDOM NUMBER
    
    numOfGuesses = 0;
    
    constructor(){
        // this.GetChamps();
        this.Initialize();
    };

    async GetChamps(){
        let response;
        try{
            response = await fetch("http://localhost:3000/characters");
        }
        catch{
            response = await fetch("/public/jsons/character_wordle.json");
        }
        
        return await response.json();
    };

    async Initialize(){
        //this.CheckForSave();
        const champs = await this.GetChamps();
        
        const randomChampIndex = Math.abs(Math.floor(this.rnd.next()*champs.length));
        const randomChamp = champs[randomChampIndex];
        
        this.GetRandomQuote(randomChamp);
        document.querySelector("#guess_champ_btn")?.addEventListener('click', async () => {
            this.DisplayGuess(randomChamp, champs);
        });

    };

    GetRandomQuote(champ: any){
        let randomLineIndex = Math.floor(this.rnd.next() * champ.voicelines.length);
        document.querySelector("#quoteHolder p")!.innerHTML = champ.voicelines[randomLineIndex];
    };

    async DisplayGuess(champ: any, champs: any){
        const guess = (document.querySelector("#champ_search")as HTMLInputElement).value;
        let champGuess;
        for(let i = 0; i < champs.length; i++){
            if(champs[i].name.toLowerCase().includes(guess.toLowerCase())) champGuess = champs[i];
        };

        if(champGuess != null){
            let isCorrect = champGuess.name == champ.name;

            let row: HTMLDivElement = document.createElement("div") as HTMLDivElement;
            row.className = "flex flex-row items-center justify-center gap-2 bg-gray-900 w-min py-4 px-6";
            row.innerHTML = `
                <p class="text-center image w-20 h-20 bg-gray-800"><img src="./public/images/legends_cards/${champGuess.name}_Legend_Card.webp" class="-translate-y-2.5" alt="${champGuess.name}"></p>
                <p class="text-center name w-30 text-2xl ${(isCorrect ? "text-green-500" : "text-red-500")}">${champGuess.name}</p>
            `;
            document.querySelector("#guesses")?.appendChild(row);
            this.numOfGuesses++;
            this.CheckCorrectGuess(champGuess.name, champ.name);
        };

    };

    CheckCorrectGuess(guess: string, champ: string) {
        if(guess == champ){
            document.querySelector("#search")!.innerHTML = `<h4>Gratulálok eltaláltad!</h4><br><p>Próbálozások száma: ${this.numOfGuesses}</p>` ;
            this.Save();
        };
    };

    Save(): void{
        localStorage.setItem('numOfChampGuesses', this.numOfGuesses.toString());
        localStorage.setItem('date', new Date().getDate().toString());
    };

    CheckForSave(){
        const getNum = localStorage.getItem('numOfChampGuesses');
        const getDate = localStorage.getItem('date');
        if(getNum && getDate){
            if(parseInt(getDate) == new Date().getDate()){
                document.querySelector("#search")!.innerHTML = `<h4>A mai feladványt már teljesítetted!</h4><br><p>Próbálozások száma:${getNum}</p>`;   
            };
        };
    };
};