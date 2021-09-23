"use strict";

window.addEventListener("DOMContentLoaded", start);

// Array for alle elever
let allStudents = [];

// prototype for en elev, og indholdet. 
let Student = {
   firstName: "",
   lastName: "",
   middleName: "",
   nickName: "",
   image: "",
   house: "",
   bloodStatus: "",
   expelled: false,
   prefect: false,
   squad: false
};

// Globale variable for filtrering og sotering
const settings = {
    filter: "all",
    sortBy: "firstName"
}

// hvis DOM er indlæst, inlæs Json og lyt efter klik. 
function start(){
    console.log("DOM is loaded");
    loadJSON();
    addEventListeners();
}


// Lytter efter Klik på filtresing og sotering
function addEventListeners(){
    document.querySelectorAll("[data-action='filter']").forEach(button => {
        button.addEventListener("click", selectFilter);
    })
    document.querySelectorAll("[data-action='sort']").forEach(button => {
        button.addEventListener("click", selectSorting);
    })
    document.querySelector("#searchfunction").addEventListener("input", search);
document.querySelector(".hack").addEventListener("click", hackTheSystem);

}

// Load json filen
async function loadJSON(){
    await Promise.all([fetch("https://petlatkea.dk/2021/hogwarts/students.json").then((res) => res.json()), fetch("https://petlatkea.dk/2021/hogwarts/families.json").then((res) => res.json())]).then((jsonData) => {
    // When loaded, prepare data objects
    prepareObjects(jsonData[0], jsonData[1]);   
    });
    // const respons = await fetch("https://petlatkea.dk/2021/hogwarts/students.json");
    // const jsonData = await respons.json();

    
}

// Prepare data objects - forbereder json data
function prepareObjects(students, bloodStatus){
    students.forEach(element => {
        const student = Object.create(Student);
    
        student.firstName = getFirstName(element.fullname);
        student.lastName = getLastName(element.fullname);
        student.middleName = getMidddelName(element.fullname);
        student.nickName = getNickName(element.fullname);
        student.image = getImage(student.firstName, student.lastName);
        student.house = getHouse(element.house); 
        student.bloodStatus = getBloodStatus(student.lastName, bloodStatus);
        allStudents.push(student);
    });
    buildList();
}

//function addSelf
    //Create new student
    // add atribeutes
    //Push object to arry

    //Update view

//function hack
    //call for example addSelf

// FIRSTNAME : Get firstname from fullname
function getFirstName(fullname){
    let firstName = fullname.trim();
    // If fullname includes a space, firstname is what comes before that first space
    if (fullname.includes(" ")) {
        firstName = firstName.substring(0, firstName.indexOf(" "));
        firstName = firstName.substring(0,1).toUpperCase() + firstName.substring(1).toLowerCase();
    } else {
        // if fullname only has one name - no space
        firstName = firstName;
    }
    return firstName;
}

// LASTNAME - Get lastname from fullname
function getLastName(fullname){
    let lastName = fullname.trim();
    lastName = lastName.substring(lastName.lastIndexOf(" ")+1);
    lastName = lastName.substring(0,1).toUpperCase() + lastName.substring(1).toLowerCase();
    // If fullname contains -, make first character uppercase
    if (fullname.includes("-")){
        let lastNames = lastName.split("-");
        lastNames[1] = lastNames[1].substring(0,1).toUpperCase() + lastNames[1].substring(1).toLowerCase();
        lastName = lastNames.join('-');
    }
    return lastName;
}

// MIDDLENAME : Get middlename from fullname
function getMidddelName(fullname){
    let middleName = fullname.trim();
    middleName = middleName.split(" ");
    // If fullname includes "", ignore that name and make middlename none
    if (fullname.includes(' "')) {
        middleName = ""; 
    } else if (middleName.length > 2) { // if fullname is longer than 2, make second name middlename
        middleName = middleName[1];
        middleName = middleName.substring(0,1).toUpperCase() + middleName.substring(1).toLowerCase();
    } else{
        middleName = "";
    }
    return middleName;
}

// NICKNAME : Get nickname from fullname
function getNickName(fullname){
    let nickName = fullname.trim();
    nickName = nickName.split(" ");
    // if fullname contains "", make second name the nickname
    if (fullname.includes(' "')){
        nickName = nickName[1];
    } else {
        nickName = "";
    }
 return nickName;
}

// Get house
function getHouse(house){
    house = house.trim();
    house = house.substring(0,1).toUpperCase() + house.substring(1).toLowerCase();
    return house;
}



// Get image
 function getImage(firstName, lastName){
    let image;
    // If lastname is patil, use both lastname and firstname to get image
    if (lastName === 'Patil') {
        image = `./images/${lastName.toLowerCase()}_${firstName.toLowerCase()}.png`;
      } else if (firstName === 'Leanne') { // If lastname is Leanne, show no image avaliable picture
        image = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'
      } else if (firstName === 'Justin') { // If lastname is Justin, split the lastname and use second lastname
          lastName = lastName.split("-");
          image = `./images/${lastName[1].toLowerCase()}_${firstName.substring(0, 1).toLowerCase()}.png`;
      }
      else {
        image = `./images/${lastName.toLowerCase()}_${firstName.substring(0, 1).toLowerCase()}.png`;
      }
     return image;
 }

 // Get blood-status
 function getBloodStatus(lastName, bloodStatus) {
     if (bloodStatus.half.includes(lastName)){
         bloodStatus = "Half-blood";
     } else if (bloodStatus.pure.includes(lastName)) {
         bloodStatus = "Pure-blood";
     } else {
         bloodStatus = "Muggle-born";
     }
     return bloodStatus;
 }

 // vælg filter hændelse/event
function selectFilter(event){
    const filter = event.target.dataset.filter;
    setFilter(filter);
}
 // indsti/klargør filter 
function setFilter(filter){
    settings.filterBy = filter;
    buildList();
}
// filterings liste
function filterList(filteredList){

    if (settings.filterBy === "gryffindor"){
        filteredList = allStudents.filter(isGryffindor);
    } else if (settings.filterBy === "hufflepuff"){
        filteredList = allStudents.filter(isHufflepuff);
    } else if (settings.filterBy === "ravenclaw"){
        filteredList = allStudents.filter(isRavenclaw);
    } else if (settings.filterBy === "slytherin"){
        filteredList = allStudents.filter(isSlytherin);
    } else if (settings.filterBy === "prefect"){
        filteredList = allStudents.filter(isPrefect);
    } else if (settings.filterBy === "squad"){
        filteredList = allStudents.filter(isSquad);
    } else if (settings.filterBy === "expelled"){
        filteredList = allStudents.filter(isExpelled);
    }
    return filteredList;
}

// tildel elev hus 
function isGryffindor(student){
    return student.house === "Gryffindor";
}
// tildel elev hus 
function isHufflepuff(student){
    return student.house === "Hufflepuff";
}
// tildel elev hus 
function isRavenclaw(student){
    return student.house === "Ravenclaw";
}
// tildel elev hus 
function isSlytherin(student){
    return student.house === "Slytherin";
}
// tildel elev perfect 
function isPrefect(student){
    return student.prefect === true;
}
// tildel elev squad
function isSquad(student){
    return student.squad === true;
}
// tildel elev bortvisning/expelled
function isExpelled(student){
    return student.expelled === true;
}

// data Sortering , data attributes from event object
function selectSorting(event){
    const sortBy = event.target.dataset.sort;
    setSort(sortBy);
}

 // sæt sotering = sotere efter --> 
function setSort(sortBy){
    settings.sortBy = sortBy;
    buildList();
}

//Sorteringslite:  sotere efter = property 
function sortList(sortedList){
    sortedList = sortedList.sort(sortByProperty);
    
    function sortByProperty(nameA, nameB){
        if (nameA[settings.sortBy] < nameB[settings.sortBy]){
            return -1;
        } else {
            return 1;
        }
    }
    return sortedList;
}

// Searching = søgefelt for at sotere efter elev fornavn eller efternavn. 
function search(){
    const searchWord = document.querySelector("#searchfunction").value.toLowerCase();
    const filteredSearch = allStudents.filter((student) => {
        return (
            student.firstName.toLowerCase().includes(searchWord) ||
            student.lastName.toLowerCase().includes(searchWord)
        );
    });
    displayList(filteredSearch);
}

// lav den nuværende liste, om til en soteret/filtereret liste 
function buildList(){
    const currentList = filterList(allStudents.filter((student) => student.expelled === false));
    const sortedList = sortList(currentList);
    displayList(sortedList);
}

// Displaying filtered list --> vis den soterende liste 
function displayList(students){
    // Clear the list 
    document.querySelector("#students").innerHTML = "";

    // Build a new list  .--> lav en ny liste 
    students.forEach(displayStudent);
}

function displayStudent(student){
    // Create clone - klon
    const clone = document.querySelector("template#student").content.cloneNode(true);
   
    //Set clone data - data til klonen 
    clone.querySelector("[data-field=image]").src = student.image;
    clone.querySelector("[data-field=firstname]").textContent = student.firstName;
    clone.querySelector("[data-field=lastname]").textContent = student.lastName;
    clone.querySelector("[data-field=house]").textContent = student.house;

    //Make clickable to see more details
    clone.querySelector("#studenttext").addEventListener("click", () => showDetails(student));

    // --------------- INQUISITORIAL SQUAD-------------------------
    //  Change textcontent if student is part of inquisitorial squad or not
    // hvis eleven er medlem ja fjner , nej tilføjer ! 
    if (student.squad === true){
        clone.querySelector(".squad").classList.remove("gray");
    } else if (student.squad === false){
        clone.querySelector(".squad").classList.add("gray");
    }

    // Add eventlistener to squad , hvis klikkes tilføjes 
    clone.querySelector(".squad").addEventListener("click", clickSquad);

    // Toggle squad true or false on click , Kun elever fra slytherin som er pureblod kan være medlem af inquisitorial sqad
    function clickSquad() {
        if (student.house === "Slytherin" || student.bloodStatus === "Pure-blood"){
            student.squad = !student.squad;
        } else {
            
        }
        //Is system hacked: setInterval(remove)
        buildList();
    }

    // ------------------PREFECT----------------------------------
    // ændre textcontent på student, prefect or not  
    // tilføjer eller fjerner classen gray = grayscale fra Perfect logo/knappen 
 
    if (student.prefect === true){
        clone.querySelector(".prefect").classList.remove("gray");
    } else if (student.squad === false){
        clone.querySelector(".prefect").classList.add("gray");
    }

    // // Add eventlistener to prefect
    clone.querySelector(".prefect").addEventListener("click", clickPrefect);

    // // Toggle prefect true or false on click
    function clickPrefect() {
        if (student.prefect === true) {
            student.prefect = false;
        } else {
            tryToMakePrefect(student);
        }
        buildList();
    }

    //-------------------- EXPELLED-----------------------------
    // Ændre textcontent hvis eleven er expelled eller ej
    // hvis bortvist tilføjes classen grayscale til hele firkanten (Article studeninfo)
     if (student.expelled === true){
         // fjerner class hvis expelled.
        clone.querySelector(".expell").classList.remove("gray");
        // tilføjer class hvis expelled.
        clone.querySelector(".studentinfo").classList.add("gray");
        //tilføjer class på pop-up
        popup.classList.add("gray");
    
    } else if (student.expelled === false){
// er student expelled tilføjes class 
        clone.querySelector(".expell").classList.add("gray");
    }

    // // Add eventlistener to prefect
    clone.querySelector(".expell").addEventListener("click", clickExpell);

    // // Toggle prefect true or false on click
    function clickExpell() {
        student.expelled = !student.expelled;
        buildList();
    }

    //Append clone to list
    document.querySelector("#students").appendChild(clone);
}

//removeSquad()
//  for each student: set false
//  buildList

function showDetails(student){
    const clone = document.querySelector("#info").cloneNode(true).content;
    popup.textContent="";
    clone.querySelector("[data-field=image]").src = student.image;
    clone.querySelector("[data-field=firstname]").textContent = `Firstname: ${student.firstName}`;
    clone.querySelector("[data-field=middelname]").textContent = `Middelname: ${student.middleName}`;
    clone.querySelector("[data-field=nickname]").textContent = `Nickname: ${student.nickName}`;
    clone.querySelector("[data-field=lastname]").textContent = `Lastname: ${student.lastName}`;
    clone.querySelector("[data-field=bloodstatus]").textContent = `Blood status: ${student.bloodStatus}`;
    clone.querySelector("[data-field=house]").textContent = `House: ${student.house}`;
   
   // farve på de forskellige og banner
    if (student.house === "Gryffindor"){
        popup.style.background = "DarkRed";
        clone.querySelector(".housecrest").style.backgroundImage = "url('./images/gryf.png')";    
    } else if (student.house === "Hufflepuff"){
        popup.style.background = "Goldenrod";
        clone.querySelector(".housecrest").style.backgroundImage = "url('./images/huff.png')";
    } else if (student.house === "Slytherin"){
        popup.style.background = "DarkGreen";
        clone.querySelector(".housecrest").style.backgroundImage = "url('./images/slyt.png')";
    } else {
        popup.style.background = "SteelBlue";
        clone.querySelector(".housecrest").style.backgroundImage = "url('./images/rav.png')";
    }

    popup.classList.add('active');
    overlay.classList.add('active');
    clone.querySelector("#close").addEventListener("click", closeDetails);
    popup.appendChild(clone);
}

function tryToMakePrefect(selectedStudent){
    //Variable for prefects
    const prefects = allStudents.filter(student => student.prefect);

    //Variable for other prefects from same house
    const other = prefects.filter(student => student.house === selectedStudent.house);
    const numberOfPrefects = other.length;

    //If there is two other students from the same house
    //    // There can only be two prefects from each house
    // if over two chosse to remove other or other (student name)

    if (numberOfPrefects >= 2){
        console.log("There can only be two prefects from each house");
        removeAorB(other[0], other[1]);
    } else {
        makePrefect(selectedStudent);
    }

    function removeAorB(prefectA, prefectB){
        console.log(prefectA.firstName);
        console.log(prefectB.firstName);

        // Ask user to igore or remove A eller B 
        document.querySelector("#remove_AorB").classList.remove("hide");
        document.querySelector("#remove_AorB .close_dialog").addEventListener("click", closeDialog);
        document.querySelector("#remove_AorB #removeA").addEventListener("click", clickRemoveA);
        document.querySelector("#remove_AorB #removeB").addEventListener("click", clickRemoveB);

        // Show names on buttons
        document.querySelector("#remove_AorB [data-field=prefectA]").textContent = `${prefectA.firstName} ${prefectA.lastName}`;
        document.querySelector("#remove_AorB [data-field=prefectB]").textContent = `${prefectB.firstName} ${prefectB.lastName}`;
        
        // If ignore - do nothing
        function closeDialog(){
            document.querySelector("#remove_AorB").classList.add("hide");
            document.querySelector("#remove_AorB .close_dialog").removeEventListener("click", closeDialog);
            document.querySelector("#remove_AorB #removeA").removeEventListener("click", clickRemoveA);
            document.querySelector("#remove_AorB #removeB").removeEventListener("click", clickRemoveB);
        }

        // If remove a
        function clickRemoveA(){
            removePrefect(prefectA);
            makePrefect(selectedStudent);
            buildList();
            closeDialog();
        }
        

        // If remove b
        function clickRemoveB(){
            removePrefect(prefectB);
            makePrefect(selectedStudent);
            buildList();
            closeDialog();
        }
    }

    function removePrefect(studentPrefect){
        studentPrefect.prefect = false;
    }

    function makePrefect(student) {
        student.prefect = true;

    }
    
}  

function closeDetails(){
    popup.classList.remove('active');
    overlay.classList.remove('active');
}


// ----- HACKING ---

function hackTheSystem(){
    console.log("hej");
    //tilføjer animation på svg
document.querySelector(".hack").classList.add("flyaway");
// når animation er slut, kaldes function HideDementor
document.querySelector(".hack").addEventListener("animationend",hideDementor);
// variable kalder createMe
    const mySelf = createMe();
    // sætter "mig" først på listen.
    allStudents.unshift(mySelf);
    displayList(allStudents);

    console.log("med");
    hackBlood();
}

function createMe(){
    console.log("dig");
    //hacker details
    const maisen = Object.create(Student);
    maisen.lastName = "Creature";
    maisen.middleName = "Dark";
    maisen.firstName = "Dementor";
    maisen.nickName = "The gliding Soul-sucker";
    maisen.image = "images/hackerprofil.png";
    maisen.house = "Slytherin";
    maisen.expelled = false;
    maisen.squad = false;
    maisen.prefect = false;
    maisen.bloodStatus = "Pure-blood";
    maisen.hacker = true;

    console.log("HACKER!!");

  //viser detaljerne 
    return maisen;
  
} 

function hideDementor(){
    //fjerner class hide efter animationen er færdig 
    document.querySelector(".hack").classList.add("hide");
}



//hackBlood()
//  for each student
//      if pureblood set to muggler / half ramdomly
//      else set to pure

function hackBlood() {
    console.log("hejIgen");
    const bloodStatuses = [true, false];
  
    allStudents.forEach((student) => {
      if (student.bloodStatus = "Pure-blood" & !student.hacker) {
        student.bloodStatus = bloodStatuses[Math.floor(Math.random() * 2)];
      } else {
        student.bloodStatus = "Muggle-born";
      }
    });
    displayList(allStudents);

  }

//   function canNotExpell() {
//       console.log("STOP KARO MAN")
//       alert("The hacker dementor can NOT be expelled!! ");


//     // document.querySelector("#noExpell").classList.remove("hide");
//     // document.querySelector("#noExpell .close").addEventListener("click", closeDialog);
  
//     // function closeDialog() {
//     //   document.querySelector("#noExpell").classList.add("hide");
//     //   document.querySelector("#noExpell .close").removeEventListener("click", closeDialog);
//     // }
//   }
