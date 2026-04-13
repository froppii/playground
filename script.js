const apps = [
    {
        title: "welcome.txt",
        icon: "file.png",
        content: `
            <p>testing</p>
        `
    },
    {
        title: "guide.txt",
        icon: "file.png",
        content: `
            <p>coming soon!!</p>
        `
    },
    {
        title: "ship.exe",
        icon: "iconplaceholder.png",
        content: `
            <form action="https://example.com" method="get">
                <input type="checkbox" id="age" name="age">
                <label for="age">i am 18 years old or under</label><br>
                <input type="checkbox" id="submission" name="submission">
                <label for="submission">project has not been submitted to any other ysws</label><br>
                <button type="submit">submit</button>
            </form>
        `
    }
];

const appsContainer = document.getElementById("apps");

apps.forEach(app => {
    const div = document.createElement("div");
    div.className = "app";
    div.innerHTML = `
        <img class="appicon" src="${app.icon}" alt="${app.title}">
        <p>${app.title}</p>
    `;
    div.addEventListener("dblclick", () => openWindow(app));
    if (app.title.toLowerCase() === "welcome.txt") {
        div.addEventListener("click", () => openWindow(app));
    }
    appsContainer.appendChild(div);
});

const guideLink = document.getElementById("guide-link");
if (guideLink) {
    guideLink.addEventListener("click", event => {
        event.preventDefault();
        openWindowByTitle("guide.txt");
    });
}

const pet = document.getElementById("desktop-pet");
const bar = document.getElementById("bar");
const petCanvas = document.createElement("canvas");
let petDragging = false;
let petDragOffsetX = 0;
let petDragOffsetY = 0;
let petFallAnimation = null;
let petStopTimeout = null;
let petResumeTimeout = null;

petCanvas.id = "desktop-pet-static";
petCanvas.style.display = "none";
document.body.appendChild(petCanvas);

if (pet) {
    pet.addEventListener("mousedown", petDragStart);
    pet.addEventListener("touchstart", petTouchStart, { passive: false });
    pet.addEventListener("dragstart", e => e.preventDefault());
    pet.classList.add("walking");
    schedulePetStop();
}

function schedulePetStop() {
    if (!pet || petDragging) return;
    clearTimeout(petStopTimeout);
    clearTimeout(petResumeTimeout);
    petStopTimeout = setTimeout(() => {
        stopPet();
    }, 2500 + Math.random() * 4000);
}

function stopPet() {
    if (!pet || petDragging) return;
    pet.classList.remove("walking");
    pet.classList.add("stopped");
    pet.style.animation = "none";
    pet.style.animationPlayState = "paused";
    showStaticPetFrame();

    const stopDuration = 1500 + Math.random() * 2200;
    petResumeTimeout = setTimeout(() => {
        if (!petDragging) {
            resumePetWalking();
        }
    }, stopDuration);
}

function resumePetWalking() {
    if (!pet) return;
    pet.classList.remove("stopped");
    hideStaticPetFrame();
    pet.classList.add("walking");
    pet.style.animation = "";
    pet.style.animationPlayState = "running";
    schedulePetStop();
}

function showStaticPetFrame() {
    if (!pet) return;
    const rect = pet.getBoundingClientRect();
    petCanvas.width = rect.width;
    petCanvas.height = rect.height;
    const ctx = petCanvas.getContext("2d");
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.drawImage(pet, 0, 0, rect.width, rect.height);
    petCanvas.style.left = `${rect.left}px`;
    petCanvas.style.top = `${rect.top}px`;
    petCanvas.style.width = `${rect.width}px`;
    petCanvas.style.height = `${rect.height}px`;
    petCanvas.style.bottom = "auto";
    petCanvas.style.position = "fixed";
    petCanvas.style.display = "block";
    petCanvas.classList.add("pet-dragging");
    pet.style.display = "none";
}

function hideStaticPetFrame() {
    if (!petCanvas || !pet) return;
    petCanvas.style.display = "none";
    petCanvas.classList.remove("pet-dragging");
    pet.style.display = "block";
}

function petTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    petDragStart(touch);
}

function petDragStart(e) {
    if (!pet) return;
    petDragging = true;
    pet.classList.add("pet-dragging");
    pet.classList.remove("walking");
    pet.classList.remove("stopped");
    pet.style.animation = "none";
    pet.style.animationPlayState = "paused";
    clearTimeout(petStopTimeout);
    clearTimeout(petResumeTimeout);

    const rect = pet.getBoundingClientRect();
    petDragOffsetX = e.clientX - rect.left;
    petDragOffsetY = e.clientY - rect.top;

    // Capture the current GIF frame to canvas and show it instead of the animated image.
    petCanvas.width = rect.width;
    petCanvas.height = rect.height;
    const ctx = petCanvas.getContext("2d");
    ctx.drawImage(pet, 0, 0, rect.width, rect.height);
    petCanvas.style.left = `${rect.left}px`;
    petCanvas.style.top = `${rect.top}px`;
    petCanvas.style.bottom = "auto";
    petCanvas.style.position = "fixed";
    petCanvas.style.display = "block";
    petCanvas.classList.add("pet-dragging");
    pet.style.display = "none";

    pet.style.left = `${rect.left}px`;
    pet.style.top = `${rect.top}px`;
    pet.style.bottom = "auto";
    pet.style.transform = "none";

    document.addEventListener("mousemove", petDraggingMove);
    document.addEventListener("mouseup", petDragEnd);
    document.addEventListener("touchmove", petTouchMove, { passive: false });
    document.addEventListener("touchend", petDragEnd);
}

function petTouchMove(e) {
    e.preventDefault();
    if (!e.touches || e.touches.length === 0) return;
    petDraggingMove(e.touches[0]);
}

function petDraggingMove(e) {
    if (!petDragging || !pet) return;
    e.preventDefault();
    const left = e.clientX - petDragOffsetX;
    const top = e.clientY - petDragOffsetY;

    pet.style.left = `${left}px`;
    pet.style.top = `${top}px`;
    petCanvas.style.left = `${left}px`;
    petCanvas.style.top = `${top}px`;
}

function petDragEnd() {
    if (!petDragging || !pet) return;
    petDragging = false;
    pet.classList.remove("pet-dragging");

    document.removeEventListener("mousemove", petDraggingMove);
    document.removeEventListener("mouseup", petDragEnd);
    document.removeEventListener("touchmove", petTouchMove);
    document.removeEventListener("touchend", petDragEnd);

    if (petCanvas) {
        petCanvas.style.display = "none";
        petCanvas.classList.remove("pet-dragging");
        pet.style.display = "block";
    }

    if (!pet.classList.contains("stopped")) {
        pet.classList.add("walking");
    }

    if (petFallAnimation) {
        cancelAnimationFrame(petFallAnimation);
    }
    petFallAnimation = requestAnimationFrame(petFall);
}

function petFall() {
    if (!pet) return;

    const petRect = pet.getBoundingClientRect();
    const targetTop = window.innerHeight - petRect.height - 6;
    const currentTop = petRect.top;
    const distance = targetTop - currentTop;

    if (Math.abs(distance) < 1) {
        pet.style.top = "";
        pet.style.bottom = "-9px";
        pet.classList.add("walking");
        return;
    }

    const step = Math.min(Math.abs(distance), 20);
    pet.style.top = `${currentTop + Math.sign(distance) * step}px`;
    petFallAnimation = requestAnimationFrame(petFall);
}

function openWindowByTitle(title) {
    const app = apps.find(app => app.title.toLowerCase() === title.toLowerCase());
    if (!app) {
        console.warn(`App not found: ${title}`);
        return;
    }
    openWindow(app);
}

function showWelcomeWindow() {
    const welcome = document.getElementById('welcome');
    if (!welcome) return;
    welcome.style.display = 'flex';
}

function openWindow(app) {
    if (app.title.toLowerCase() === 'welcome.txt') {
        showWelcomeWindow();
        return;
    }

    const id = 'window-' + app.title.replace(/\s+/g, '-');

    if (document.getElementById(id)) {
        document.getElementById(id).style.display = 'flex';
        return;
    }

    const win = document.createElement('div');
    win.className = 'window';
    win.id = id;
    win.style.top = '80px';
    win.style.left = '80px';

    win.innerHTML = `
        <div class="windowheader" id="${id}header">
            <h1 class="headertext">${app.title}</h1>
        </div>
        <div class="windowcontent">
            ${app.content}
        </div>
    `;

    document.body.appendChild(win);
    dragElement(win);
}

dragElement(document.getElementById("welcome"));

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        document.getElementById(elmnt.id + "header").onmousedown =  dragMouseDown;
    } else {
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        const newTop = elmnt.offsetTop - pos2;
        const newLeft = elmnt.offsetLeft - pos1;
        const minTop = -(elmnt.offsetHeight - 40);
        const maxTop = window.innerHeight - 40;
        const minLeft = -(elmnt.offsetWidth - 40);
        const maxLeft = window.innerWidth - 40;

        elmnt.style.top = Math.min(Math.max(newTop, minTop), maxTop) + "px";
        elmnt.style.left = Math.min(Math.max(newLeft, minLeft), maxLeft) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}