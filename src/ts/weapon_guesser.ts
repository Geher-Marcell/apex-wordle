import SeededRandom from "./SeededRandom.ts";


export default class WeaponGuesser{
    rnd = new SeededRandom(new Date().getDate().toString()); //SEEDED RANDOM NUMBER
    
    numOfTries = 0;
    
    constructor() {
        this.Initialize();
    };

    async Initialize(){
        this.CheckForSave();
        const weapons = await this.GetWeapons();
        const randomWeaponIndex = Math.abs(Math.floor(this.rnd.next() * weapons.length));
        // console.log(weapons);
        // console.log(randomWeaponIndex)
        const randomWeapon = weapons[randomWeaponIndex];
        
        
        (document.querySelector("#guess_champ_btn") as HTMLButtonElement)?.addEventListener('click', async () => {
            this.DisplayGuess(weapons, randomWeapon);
        });
    };

    async GetWeapons(){
        const response = await fetch("http://localhost:3000/weapons");
        return await response.json();
    };

    async DisplayGuess(weapons: any, rndWeapon: any){
        const nameInput: string = (document.querySelector("#champ_search") as HTMLInputElement).value;
        let weaponInput;
        for(let i = 0; i<weapons.length; i++){
            // console.log(weapons[i].name);
            if((weapons[i].name.toLowerCase()).includes( nameInput.toLowerCase())){
                weaponInput = weapons[i];
            };
        };
        // console.log(rndWeapon);
        // console.log(weaponInput);
        if(weaponInput != null){
            let row: HTMLDivElement = document.createElement("div") as HTMLDivElement;
            row.className = "flex flex-row items-center gap-20 h-20 bg-gray-900 p-3";
            row.innerHTML = `
              <p class="border text-center w-40 bg-red-700 bg-green-700 bg-${((weaponInput.name == rndWeapon.name)? "green" : "red")}-700">${weaponInput.name}</p>
              <p class="border text-center w-40 bg-${((weaponInput.weapon_type == rndWeapon.weapon_type)? "green" : "red")}-700">${weaponInput.weapon_type}</p>
              <p class="border text-center w-40 bg-${((weaponInput.ammo_type == rndWeapon.ammo_type)? "green" : "red")}-700">${weaponInput.ammo_type}</p>
              <p class="border text-center w-40 bg-${((weaponInput.rpm == rndWeapon.rpm)? "green" : "red")}-700">${weaponInput.rpm} ${this.CompareNumericalData(weaponInput.rpm, rndWeapon.rpm)}</p>
              <p class="border text-center w-40 bg-${((weaponInput.dps == rndWeapon.dps)? "green" : "red")}-700">${weaponInput.dps} ${this.CompareNumericalData(weaponInput.dps, rndWeapon.dps)}</p>
              <p class="border text-center w-40 bg-${((weaponInput.base_mag_size == rndWeapon.base_mag_size)? "green" : "red")}-700"};">${weaponInput.base_mag_size} ${this.CompareNumericalData(weaponInput.base_mag_size, rndWeapon.base_mag_size)}</p>
              <p class="border text-center w-40 bg-${((weaponInput.damage_profile.head == rndWeapon.damage_profile.head)? "green" : "red")}-700">${weaponInput.damage_profile.head}</p>
            `;

            // Insert the row after the first element in the table
            const table = document.querySelector("#table");
            if(table && table.children.length > 0){
                table.insertBefore(row, table.children[1] || null);
            } else {
                table?.appendChild(row);
            }

            (document.querySelector("#champ_search") as HTMLInputElement).value = "";
            this.numOfTries++;
            this.CheckGuess(weaponInput.name, rndWeapon.name);
        };
    };

    CheckGuess(guess: string, name: string): void{
        if(guess == name) {
            document.querySelector("#search")!.innerHTML = `<h3>Gratulálok, eltaláltad!</h3><h5>Próbálkozások száma: ${this.numOfTries}</h5>`;
            this.Save();
        };
    };

    CompareNumericalData(guessData: number, data: number): string{
        if(guessData < data) return "<i class='fa fa-caret-up fa-lg' aria-hidden='true'></i>";
        else if(guessData > data) return "<i class='fa fa-caret-down fa-lg' aria-hidden='true'></i>";
        return "";
    };

    Save(): void{
        localStorage.setItem('numOfWeaponGuesses', this.numOfTries.toString());
        localStorage.setItem('date', new Date().getDate().toString());
    };

    CheckForSave(): void{
        const num = localStorage.getItem('numOfWeaponGuesses');
        const date = localStorage.getItem('date');
        if(num && date){
            if(parseInt(date) == new Date().getDate()){
                document.querySelector("#search")!.innerHTML = `<h4>A mai feladványt már teljesítetted!</h4><br><p>Próbálozások száma:${num}</p>`;   
            };
        };
    };
}