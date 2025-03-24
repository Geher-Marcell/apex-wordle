

export default class WeaponGuesser{
    weapons: [];
    randomWeapon: any;
    random = Math.floor(Math.random() * 28);
    numOfTries = 0;
    
     
    constructor() {
        this.weapons = []    

        this.randomWeapon = null;

        this.Initialize();
        
    }
    
    async Initialize(){
        const rnd =(await this.GetWeapons())[this.random];
        (document.querySelector("#guess_btn") as HTMLButtonElement)?.addEventListener('click', async () => {
            this.CompareWeapons(await this.GetWeapons(), rnd)

        });
    }

    async GetWeapons(){
        const response = await fetch("http://localhost:3000/weapons");

        return await response.json()

    }

    

    async CompareWeapons(weapons: any, rndWeapon: any){
        const nameInput: string = (document.querySelector("#weapon_search") as HTMLInputElement).value;
        let weaponInput;
        for(let i = 0; i<weapons.length; i++){
            console.log(weapons[i].name);
            if((weapons[i].name.toLowerCase()).includes( nameInput.toLowerCase())){
                weaponInput = weapons[i];
            }
        }
        console.log(rndWeapon);
        console.log(weaponInput);
        if(weaponInput != null){
            let row: HTMLDivElement = document.createElement("div") as HTMLDivElement;
            row.className = "flex flex-row items-center gap-20 h-10";
            let nameBg = (weaponInput.name == rndWeapon.name)? "green" : "red";
            let typeBg = (weaponInput.weapon_type == rndWeapon.weapon_type)? "green" : "red";
            let ammoBg = (weaponInput.ammo_type == rndWeapon.ammo_type)? "green" : "red";
            let rpmBg = (weaponInput.rpm == rndWeapon.rpm)? "green": "red";
            let dpsBg = (weaponInput.dps == rndWeapon.dps)? "green": "red";
            let magBg = (weaponInput.base_mag_size == rndWeapon.base_mag_size)? "green": "red";
            let dmgBg = (weaponInput.damage_profile.head == rndWeapon.damage_profile.head)? "green": "red";
            row.innerHTML = `
              <p class="border text-center w-40 image" style="background-color: ${nameBg};">${weaponInput.name}</p>
              <p class="border text-center w-40 nationality" style="background-color: ${typeBg};">${weaponInput.weapon_type}</p>
              <p class="border text-center w-40 gender" style="background-color: ${ammoBg};">${weaponInput.ammo_type}</p>
              <p class="border text-center w-40 hitboxSize" style="background-color: ${rpmBg};">${weaponInput.rpm}</p>
              <p class="border text-center w-40 speed" style="background-color: ${dpsBg};">${weaponInput.dps}</p>
              <p class="border text-center w-40 role" style="background-color: ${magBg};">${weaponInput.base_mag_size}</p>
              <p class="border text-center w-40 role" style="background-color: ${dmgBg};">${weaponInput.damage_profile.head}</p>
            `;
            document.querySelector("#table")?.appendChild(row);
            this.numOfTries++;
            if(nameBg == "green"){
                this.GuessedCorrectly();
            }
        }

        
    };
    GuessedCorrectly(): void {
        document.querySelector("#search")!.innerHTML = `<h3>Gratulálok, eltaláltad!</h3><h5>Próbálkozások száma: ${this.numOfTries}</h5>`;
    }
}