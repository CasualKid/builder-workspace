const buildButton = document.getElementById("buildButton");
const greeting = document.getElementById("greeting");

const buildingArea = document.getElementById("buildingArea");
const beginButton = document.getElementById("beginButton");

const projectInput = document.getElementById("projectInput");
const projectMessage = document.getElementById("projectMessage");


buildButton.addEventListener("click", function() {

    greeting.textContent = "The workshop is yours. What are you building?";

    buildingArea.classList.remove("hidden");

    buildButton.style.display = "none";

});


beginButton.addEventListener("click", function() {

    const project = projectInput.value.trim();

    if (project === "") {
        projectMessage.textContent = "Every build needs something to build.";
        return;
    }

    projectMessage.textContent =
        `You're building: ${project}`;

});