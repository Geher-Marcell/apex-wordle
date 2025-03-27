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
        const randomWeaponIndex = Math.floor(this.rnd.next() * weapons.length);
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
              <p class="border text-center w-40 image" style="background-color: ${(weaponInput.name == rndWeapon.name)? "green" : "red"};">${weaponInput.name}</p>
              <p class="border text-center w-40 nationality" style="background-color: ${(weaponInput.weapon_type == rndWeapon.weapon_type)? "green" : "red"};">${weaponInput.weapon_type}</p>
              <p class="border text-center w-40 gender" style="background-color: ${(weaponInput.ammo_type == rndWeapon.ammo_type)? "green" : "red"};">${weaponInput.ammo_type}</p>
              <p class="border text-center w-40 hitboxSize" style="background-color: ${(weaponInput.rpm == rndWeapon.rpm)? "green": "red"};">${weaponInput.rpm} ${this.CompareNumericalData(weaponInput.rpm, rndWeapon.rpm)}</p>
              <p class="border text-center w-40 speed" style="background-color: ${(weaponInput.dps == rndWeapon.dps)? "green": "red"};">${weaponInput.dps} ${this.CompareNumericalData(weaponInput.dps, rndWeapon.dps)}</p>
              <p class="border text-center w-40 role" style="background-color: ${(weaponInput.base_mag_size == rndWeapon.base_mag_size)? "green": "red"};">${weaponInput.base_mag_size} ${this.CompareNumericalData(weaponInput.base_mag_size, rndWeapon.base_mag_size)}</p>
              <p class="border text-center w-40 role" style="background-color: ${(weaponInput.damage_profile.head == rndWeapon.damage_profile.head)? "green": "red"};">${weaponInput.damage_profile.head}</p>
            `;
            document.querySelector("#table")?.appendChild(row);
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
        if(guessData < data) return "↑";
        else if(guessData > data) return "↓";
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