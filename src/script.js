// * Grabbing body to change background color
document.addEventListener('DOMContentLoaded', (event) => {
    console.log('here');
    const body = document.querySelector("body");
    const toggleDarkMode = document.querySelector(".toggle-dark-mode");
    console.log(toggleDarkMode);
    toggleDarkMode.addEventListener("click", () => {
        console.log('dsfasdf');
        if(body.classList.contains('snowy')){
            body.classList.remove('snowy');
            body.classList.add('sunny');
        }
        else{
            body.classList.remove('sunny');
            body.classList.add('snowy');
        }
    });
});




