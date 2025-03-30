import SeededRandom from "./SeededRandom.ts";


export default class WeaponGuesser{
    rnd = new SeededRandom(new Date().getDate().toString()); //SEEDED RANDOM NUMBER
    
    numOfTries = 0;

    guesses: string[] = [];

    randomWeapon: any = null;
    
    constructor() {
        this.Initialize();
    };

    async Initialize(){
        this.ClearOldData();
        const weapons = await this.GetWeapons();
        const randomWeaponIndex = Math.abs(Math.floor(this.rnd.next() * weapons.length));
        this.randomWeapon = weapons[randomWeaponIndex];
        await this.CheckForSave();
        localStorage.setItem('date', new Date().getDate().toString());
        
        (document.querySelector("#guess_weapon_btn") as HTMLButtonElement)?.addEventListener('click', async () => {
            this.DisplayGuess(weapons, this.randomWeapon);
        });

        console.log(this.randomWeapon);
    };

    async GetWeapons(){
        const response = await fetch("http://localhost:3000/weapons");
        return await response.json();
    };

    async DisplayGuess(weapons: any, rndWeapon: any){
        const selectElement = document.querySelector("#weapon_search") as HTMLSelectElement;
        const guess = selectElement.value;

        let weaponGuess;
        for(let i = 0; i<weapons.length; i++){
            if((weapons[i].name.toLowerCase()).includes( guess.toLowerCase())){
                weaponGuess = weapons[i];
            };
        };
        if(weaponGuess == null) return;
        let row: HTMLDivElement = document.createElement("div") as HTMLDivElement;
        row.className = "flex flex-row items-center gap-20 h-20 bg-gray-900 p-3";
        console.log(weaponGuess);
        row.innerHTML = `
            <p class="border text-center w-40 bg-${((weaponGuess.name == rndWeapon.name)? "green" : "red")}-700">${weaponGuess.name}</p>
            <p class="border text-center w-40 bg-${((weaponGuess.weapon_type == rndWeapon.weapon_type)? "green" : "red")}-700">${weaponGuess.weapon_type}</p>
            <p class="border text-center w-40 bg-${((weaponGuess.ammo_type == rndWeapon.ammo_type)? "green" : "red")}-700">${weaponGuess.ammo_type}</p>
            <p class="border text-center w-40 bg-${((weaponGuess.rpm == rndWeapon.rpm)? "green" : "red")}-700">${weaponGuess.rpm} ${this.CompareNumericalData(weaponGuess.rpm, rndWeapon.rpm)}</p>
            <p class="border text-center w-40 bg-${((weaponGuess.dps == rndWeapon.dps)? "green" : "red")}-700">${weaponGuess.dps} ${this.CompareNumericalData(weaponGuess.dps, rndWeapon.dps)}</p>
            <p class="border text-center w-40 bg-${((weaponGuess.base_mag_size == rndWeapon.base_mag_size)? "green" : "red")}-700"};">${weaponGuess.base_mag_size} ${this.CompareNumericalData(weaponGuess.base_mag_size, rndWeapon.base_mag_size)}</p>
            <p class="border text-center w-40 bg-${((weaponGuess.damage_profile.head == rndWeapon.damage_profile.head)? "green" : "red")}-700">${weaponGuess.damage_profile.head}</p>
        `;

        // Insert the row after the first element in the table
        const table = document.querySelector("#table");
        if(table && table.children.length > 0){
            table.insertBefore(row, table.children[1] || null);
        } else {
            table?.appendChild(row);
        }

        this.guesses.push(weaponGuess);
        localStorage.setItem('weaponGuesses', JSON.stringify(this.guesses));

        selectElement.querySelector(`option[value="${weaponGuess.name}"]`)?.remove();
        const remainingOptions = Array.from(selectElement.options).map(option => option.value);
        localStorage.setItem('availableWeapons', JSON.stringify(remainingOptions));
        selectElement.value = "";

        (document.querySelector("#weapon_search") as HTMLInputElement).value = "";
        this.numOfTries++;
        this.CheckGuess(weaponGuess.name, rndWeapon.name);
    };
    
    ClearOldData() {
        const storedDate = localStorage.getItem('date');
        const currentDate = new Date().getDate().toString();

        if (storedDate !== currentDate) {
            localStorage.removeItem('numOfWeaponGuesses');
            localStorage.removeItem('weaponGuesses');
            localStorage.removeItem('availableWeapons');
            localStorage.removeItem('win');
            localStorage.setItem('date', currentDate);
        }
    }

    CheckGuess(guess: string, name: string): void{
        if(guess == name) {
            document.querySelector("#search")!.innerHTML = `<h3>You Win!</h3><h5>Number of guesses: ${this.numOfTries}</h5>`;
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

    async CheckForSave() {
        const num = localStorage.getItem('numOfWeaponGuesses');
        const date = localStorage.getItem('date');
        const guesses = localStorage.getItem('weaponGuesses');
        const savedWeapons = localStorage.getItem('availableWeapons');

        if(num && date){
            if(parseInt(date) == new Date().getDate()){
                document.querySelector("#search")!.innerHTML = `<h4>A mai feladványt már teljesítetted!</h4><br><p>Próbálozások száma:${num}</p>`;   
            };
        };

        if(guesses && (date && parseInt(date) == new Date().getDate())){
            this.guesses = JSON.parse(guesses);
            for(let i = 0; i < this.guesses.length; i++){
                let weaponGuess = this.guesses[i];

                this.NewRow(weaponGuess);
                this.numOfTries++;
            };
        };

        if (savedWeapons) {
            const selectElement = document.querySelector("#weapon_search") as HTMLSelectElement;
            selectElement.innerHTML = "";
    
            JSON.parse(savedWeapons).forEach((weaponName: string) => {
                const option = document.createElement("option");
                option.value = weaponName;
                option.textContent = weaponName;
                selectElement.appendChild(option);
            });
        } else {
            this.PopulateWeaponSelect(await this.GetWeapons());
        }
    };

    NewRow(weaponGuess: any){
        const table = document.querySelector("#table");
        
        let row: HTMLDivElement = document.createElement("div") as HTMLDivElement;
        row.className = "flex flex-row items-center gap-20 h-20 bg-gray-900 p-3";
        row.innerHTML = `
        <p class="border text-center w-40 bg-${((weaponGuess.name == this.randomWeapon.name)? "green" : "red")}-700">${weaponGuess.name}</p>
        <p class="border text-center w-40 bg-${((weaponGuess.weapon_type == this.randomWeapon.weapon_type)? "green" : "red")}-700">${weaponGuess.weapon_type}</p>
        <p class="border text-center w-40 bg-${((weaponGuess.ammo_type == this.randomWeapon.ammo_type)? "green" : "red")}-700">${weaponGuess.ammo_type}</p>
        <p class="border text-center w-40 bg-${((weaponGuess.rpm == this.randomWeapon.rpm)? "green" : "red")}-700">${weaponGuess.rpm} ${this.CompareNumericalData(weaponGuess.rpm, this.randomWeapon.rpm)}</p>
        <p class="border text-center w-40 bg-${((weaponGuess.dps == this.randomWeapon.dps)? "green" : "red")}-700">${weaponGuess.dps} ${this.CompareNumericalData(weaponGuess.dps, this.randomWeapon.dps)}</p>
        <p class="border text-center w-40 bg-${((weaponGuess.base_mag_size == this.randomWeapon.base_mag_size)? "green" : "red")}-700"};">${weaponGuess.base_mag_size} ${this.CompareNumericalData(weaponGuess.base_mag_size, this.randomWeapon.base_mag_size)}</p>
        <p class="border text-center w-40 bg-${((weaponGuess.damage_profile.head == this.randomWeapon.damage_profile.head)? "green" : "red")}-700">${weaponGuess.damage_profile.head}</p>
        `;
        
        if(table && table.children.length > 0){
            table.insertBefore(row, table.children[1] || null);
        } else {
            table?.appendChild(row);
        }
    }

    async PopulateWeaponSelect(weapons: any) {
        const selectElement = document.querySelector("#weapon_search") as HTMLSelectElement;
        selectElement.innerHTML = "";

        const sortedWeapons = [...weapons].sort((a: any, b: any) => a.name.localeCompare(b.name));
    
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        selectElement.appendChild(defaultOption);
    
        sortedWeapons.forEach((weapon: any) => {
            const option = document.createElement("option");
            option.value = weapon.name;
            option.textContent = weapon.name;
            selectElement.appendChild(option);
        });
    }
    
    
}