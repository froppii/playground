const apps = [
    {
        title: "welcome.txt",
        icon: "iconplaceholder.png",
        content: `
            <p>testing</p>
        `
    },
    {
        title: "guide.txt",
        icon: "iconplaceholder.png",
        content: `
            <p>testing</p>
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