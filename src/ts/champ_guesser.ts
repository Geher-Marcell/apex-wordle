export default class ChampGuesser{
    random = Math.floor(Math.random() * 24)
    numOfGuesses = 0;
    
    constructor(){
        // this.GetChamps();
        this.Initialize();
    }

    async GetChamps(){
        const response = await fetch("http://localhost:3000/characters");
        // console.log(response.json())
        return await response.json();
    }

    async Initialize(){
        const rnd = (await this.GetChamps())[this.random];
        document.querySelector("#guess_champ_btn")?.addEventListener('click', async () => {
            this.DisplayGuess(rnd, await this.GetChamps())
        })

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
            row.className = "flex flex-row items-center gap-20 h-10";
            row.innerHTML = `
                <p class="border text-center w-40 image" style="background-color: ${(champ.name == champGuess.name)? "green" : "red"}">${champGuess.name}</p>
                <p class="border text-center w-40 nationality" style="background-color: ${(champ.nationality == champGuess.nationality)? "green" : "red"}">${champGuess.nationality}</p>
                <p class="border text-center w-40 gender" style="background-color: ${(champ.gender == champGuess.gender)? "green" : "red"}">${champGuess.gender}</p>
                <p class="border text-center w-40 hitboxSize" style="background-color: ${(champ.hitbox_size == champGuess.hitbox_size)? "green" : "red"}">${champGuess.hitbox_size}</p>
                <p class="border text-center w-40 speed" style="background-color: ${(champ.speed == champGuess.speed)? "green" : "red"}">${champGuess.speed}</p>
                <p class="border text-center w-40 role" style="background-color: ${(champ.role == champGuess.role)? "green" : "red"}">${champGuess.role}</p>
            `;
            document.querySelector("#table")?.appendChild(row);
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