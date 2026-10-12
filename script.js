
const greeting = document.getElementById("greeting");

const templatesSection = document.getElementById("templatesSection");
const projectFormSection = document.getElementById("projectFormSection");

const templateCards = document.querySelectorAll(".templateCard");
const customProjectButton = document.getElementById("customProjectButton");
const backButton = document.getElementById("backButton");

const projectForm = document.getElementById("projectForm");
const projectName = document.getElementById("projectName");
const projectWhy = document.getElementById("projectWhy");
const projectOutcome = document.getElementById("projectOutcome");
const projectFirstAction = document.getElementById("projectFirstAction");
const projectMessage = document.getElementById("projectMessage");

const projectsList = document.getElementById("projectsList");
const emptyProjectsMessage = document.getElementById("emptyProjectsMessage");

// Progress overview elements
const totalProjectsElement = document.getElementById("totalProjects");
const activeProjectsElement = document.getElementById("activeProjects");
const completedProjectsElement = document.getElementById("completedProjects");
const completionPercentageElement = document.getElementById("completionPercentage");
const completionProgress = document.getElementById("completionProgress");
const completionBar = document.getElementById("completionBar");

const STORAGE_KEY = "buildersDashboardProjects";


// 1. Greeting
function updateGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) {
        greeting.textContent = "Good morning, Builder.";
    } else if (hour < 18) {
        greeting.textContent = "Good afternoon, Builder.";
    } else {
        greeting.textContent = "Good evening, Builder.";
    }
}

updateGreeting();


// 2. Template details
const templateDetails = {
    website: {
        name: "My Website",
        why: "I want to create a useful online presence.",
        outcome: "A working website I can share with others.",
        firstAction: "Sketch the homepage."
    },

    learning: {
        name: "My Learning Project",
        why: "I want to develop a valuable skill.",
        outcome: "A completed project that demonstrates what I learned.",
        firstAction: "Choose one small lesson to complete."
    },

    business: {
        name: "My Business Idea",
        why: "I want to turn an idea into something valuable.",
        outcome: "A clear offer and a plan to test it with real people.",
        firstAction: "Describe the problem I want to solve."
    },

    growth: {
        name: "My Personal Growth Project",
        why: "I want to make progress in an area that matters to me.",
        outcome: "A consistent habit or measurable improvement.",
        firstAction: "Choose one small action I can repeat."
    }
};


// 3. Load saved projects
function loadProjects() {
    try {
        const savedProjects = localStorage.getItem(STORAGE_KEY);

        if (!savedProjects) {
            return [];
        }

        const savedData = JSON.parse(savedProjects);

        return Array.isArray(savedData) ? savedData : [];
    } catch (error) {
        console.error("Could not load projects:", error);
        return [];
    }
}

let projects = loadProjects();


// 4. Save projects
function saveProjects() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
        return true;
    } catch (error) {
        console.error("Could not save projects:", error);

        projectMessage.textContent =
            "Your project could not be saved. Check your browser storage settings.";

        return false;
    }
}


// 5. Update progress overview
function updateProgressOverview() {
    const total = projects.length;

    const completed = projects.filter(function(project) {
        return project.completed === true;
    }).length;

    const active = total - completed;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    totalProjectsElement.textContent = total;
    activeProjectsElement.textContent = active;
    completedProjectsElement.textContent = completed;
    completionPercentageElement.textContent = `${percentage}%`;

    completionBar.style.width = `${percentage}%`;
    completionProgress.setAttribute("aria-valuenow", percentage);
}


// 6. Render saved projects
function renderProjects() {
    // Keep the overview synchronized with the project list.
    updateProgressOverview();

    projectsList.replaceChildren();

    emptyProjectsMessage.hidden = projects.length > 0;

    if (projects.length === 0) {
        projectsList.appendChild(emptyProjectsMessage);
        return;
    }

    projects.forEach(function(project) {
        const card = document.createElement("article");
        card.className = "projectCard";

        if (project.completed) {
            card.classList.add("isCompleted");
        }

        const title = document.createElement("h3");
        title.textContent = project.name;

        const status = document.createElement("span");
        status.className = "projectStatus";
        status.textContent = project.completed ? "Completed" : "Active";

        if (project.completed) {
            status.classList.add("completed");
        }

        const why = document.createElement("p");
        why.textContent = "Why it matters: " + project.why;

        const outcome = document.createElement("p");
        outcome.textContent = "Desired outcome: " + project.outcome;

        const firstAction = document.createElement("p");
        firstAction.className = "projectFirstAction";
        firstAction.textContent = "First action: " + project.firstAction;

        const actions = document.createElement("div");
        actions.className = "projectActions";

        const toggleButton = document.createElement("button");
        toggleButton.className = "completeProjectButton";
        toggleButton.textContent = project.completed
            ? "Reopen Project"
            : "Mark Complete";

        toggleButton.addEventListener("click", function() {
            toggleProjectStatus(project.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.className = "deleteProjectButton";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {
            deleteProject(project.id);
        });

        actions.append(toggleButton, deleteButton);

        card.append(
            title,
            status,
            why,
            outcome,
            firstAction,
            actions
        );

        projectsList.appendChild(card);
    });
}


// 7. Change a project's status
function toggleProjectStatus(projectId) {
    const project = projects.find(function(item) {
        return item.id === projectId;
    });

    if (!project) {
        return;
    }

    project.completed = !project.completed;

    if (!saveProjects()) {
        project.completed = !project.completed;
        return;
    }

    renderProjects();
}


// 8. Delete a project
function deleteProject(projectId) {
    const originalProjects = projects;

    projects = projects.filter(function(project) {
        return project.id !== projectId;
    });

    if (!saveProjects()) {
        projects = originalProjects;
        return;
    }

    renderProjects();
}


// 9. Open the project form
function openProjectForm(templateKey = null) {
    templatesSection.classList.add("hidden");
    projectFormSection.classList.remove("hidden");

    projectForm.reset();
    projectMessage.textContent = "";

    if (templateKey && templateDetails[templateKey]) {
        const template = templateDetails[templateKey];

        projectName.value = template.name;
        projectWhy.value = template.why;
        projectOutcome.value = template.outcome;
        projectFirstAction.value = template.firstAction;
    }

    projectName.focus();
}


// 10. Template buttons
templateCards.forEach(function(card) {
    card.addEventListener("click", function() {
        openProjectForm(card.dataset.template);
    });
});


// 11. Custom project button
customProjectButton.addEventListener("click", function() {
    openProjectForm();
});


// 12. Back button
backButton.addEventListener("click", function() {
    projectFormSection.classList.add("hidden");
    templatesSection.classList.remove("hidden");
    projectMessage.textContent = "";
});


// 13. Create and save a project
projectForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const project = {
        id: crypto.randomUUID(),
        name: projectName.value.trim(),
        why: projectWhy.value.trim(),
        outcome: projectOutcome.value.trim(),
        firstAction: projectFirstAction.value.trim(),
        completed: false,
        createdAt: new Date().toISOString()
    };

    projects.unshift(project);

    if (!saveProjects()) {
        projects.shift();
        return;
    }

    renderProjects();

    projectMessage.textContent =
        `Project "${project.name}" has been saved successfully.`;

    projectForm.reset();
});


// 14. Initial display
renderProjects();
