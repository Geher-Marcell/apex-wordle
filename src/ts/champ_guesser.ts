import SeededRandom from "./SeededRandom.ts";

export default class ChampGuesser{
    rnd = new SeededRandom(new Date().getDate().toString()); //SEEDED RANDOM NUMBER
    
    numOfGuesses = 0;
    guesses: string[] = [];

    constructor(){
        // this.GetChamps();
        this.Initialize();
    };

    async GetChamps(){        
        const response = await fetch("http://localhost:4000/characters");
        
        return await response.json();
    };

    async Initialize(){
        await this.CheckForSave();
        localStorage.setItem('date', new Date().getDate().toString());
        const champs = await this.GetChamps();
        
        const randomChampIndex = Math.abs(Math.floor(this.rnd.next() * champs.length));
        const randomChamp = champs[randomChampIndex];
        
        this.GetRandomQuote(randomChamp);
        document.querySelector("#guess_champ_btn")?.addEventListener('click', async () => {
            this.DisplayGuess(randomChamp, champs);
        });

    };

    GetRandomQuote(champ: any){
        let randomLineIndex = Math.abs(Math.floor(this.rnd.next() * champ.voicelines.length));
        console.log(randomLineIndex);
        document.querySelector("#quoteHolder p")!.innerHTML = champ.voicelines[randomLineIndex];
    };

    async DisplayGuess(champ: any, champs: any){
        const selectElement = document.querySelector("#champ_search") as HTMLSelectElement;
        const guess = selectElement.value;
        let champGuess;
        for(let i = 0; i < champs.length; i++){
            if(champs[i].name.toLowerCase().includes(guess.toLowerCase())) champGuess = champs[i];
        };

        if(champGuess == null) return;

        let isCorrect = champGuess.name == champ.name;

        this.guesses.push(champGuess.name);
        localStorage.setItem('guesses', JSON.stringify(this.guesses));

        let row: HTMLDivElement = this.NewRow(champGuess.name, isCorrect);
        
        document.querySelector("#guesses")?.insertAdjacentElement("afterbegin", row);  
        selectElement.querySelector(`option[value="${champGuess.name}"]`)?.remove();
        const remainingOptions = Array.from(selectElement.options).map(option => option.value);
        localStorage.setItem('availableChamps', JSON.stringify(remainingOptions));
        selectElement.value = "";
        
        (document.querySelector("#champ_search")as HTMLInputElement).value = "";

        this.numOfGuesses++;
        if(isCorrect) this.Win();
    };

    NewRow(champName: string, isCorrect: boolean){
        let row: HTMLDivElement = document.createElement("div") as HTMLDivElement;
        row.className = "flex flex-row items-center justify-center gap-2 bg-gray-900 w-min py-4 px-6";
        row.innerHTML = `
            <p class="text-center image w-20 h-20 bg-gray-800"><img src="./public/images/legends_cards/${champName}_Legend_Card.webp" class="-translate-y-2.5" alt="${champName}"></p>
            <p class="text-center name w-30 text-2xl ${(isCorrect ? "text-green-500" : "text-red-500")}">${champName}</p>
        `;

        return row;
    }

    Win() {
        document.querySelector("#search")!.innerHTML = `<h4>You Win!</h4><br><p>Number of guesses: ${this.numOfGuesses}</p>` ;
        
        localStorage.setItem('numOfChampGuesses', this.numOfGuesses.toString());
        localStorage.setItem('date', new Date().getDate().toString());
        localStorage.setItem('win', "true");
    };

    async CheckForSave(){
        const getNum = localStorage.getItem('numOfChampGuesses');
        const getDate = localStorage.getItem('date');
        const getWin = localStorage.getItem('win');
        const guesses = localStorage.getItem('guesses');
        const savedChamps = localStorage.getItem('availableChamps');        
        
        if(getNum && getDate){
            if(parseInt(getDate) == new Date().getDate()){
                document.querySelector("#search")!.innerHTML = `<h4>You have completed today's quiz!</h4><br><p>Number of guesses: ${getNum}</p>`;   
            };
        };

        if(guesses && (getDate && parseInt(getDate) == new Date().getDate())){
            console.log("Vannak guessek")
            this.guesses = JSON.parse(guesses);
            for(let i = 0; i < this.guesses.length; i++){
                let champGuess = this.guesses[i];
                let isWinner = (getWin && i == this.guesses.length - 1) ? true : false;

                document.querySelector("#guesses")?.insertAdjacentElement("afterbegin", this.NewRow(champGuess, isWinner));
                this.numOfGuesses++;
            };
        };

        if (savedChamps != null) {
            const selectElement = document.querySelector("#champ_search") as HTMLSelectElement;
            selectElement.innerHTML = "";
            
            JSON.parse(savedChamps).forEach((champName: string) => {
                const option = document.createElement("option");
                option.value = champName;
                option.textContent = champName;
                selectElement.appendChild(option);
            });
        } else {
            this.PopulateChampSelect(await this.GetChamps());
        }
    }  

    async PopulateChampSelect(champs: any) {
        const selectElement = document.querySelector("#champ_search") as HTMLSelectElement;
        selectElement.innerHTML = "";

        const sortedChamps = [...champs].sort((a: any, b: any) => a.name.localeCompare(b.name));
    
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        selectElement.appendChild(defaultOption);
    
        sortedChamps.forEach((champ: any) => {
            const option = document.createElement("option");
            option.value = champ.name;
            option.textContent = champ.name;
            selectElement.appendChild(option);
        });
    }
    
}
