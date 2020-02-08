let mode;   
if(localStorage.getItem('dark') === null)
    localStorage.setItem('dark', 'auto')
const html = document.querySelector('html');
if(localStorage.dark === 'yes')
{
    nightlight();
    document.getElementById('manual-mode').checked = true;
    clearInterval(mode);
} 
else if(localStorage.dark === 'auto'){
    document.getElementById('auto-mode').checked = true;
    document.getElementById('manual-mode').checked = false;
    autoMode();
    mode = setInterval(() => {
        let d = new Date(),
            t = d.getHours();
        if(t> 6 && t < 18){
            daylight();
        }
        else{
            nightlight();
        }
    }, 60000);
}
else
{
    daylight();
    document.getElementById('manual-mode').checked = false;
    clearInterval(mode);
}
function daylight(){
    html.setAttribute("style", `--rgb-bw: 0,0,0;--alpha: 1;--light-text: #222;--background: #EBEBEB;--foreground:#f6f6f6;--light-color: 170,170,170;--dark-color: #ddd;`);
}
function nightlight(){
    html.setAttribute("style", `--rgb-bw: 255,255,255;--alpha: 0.04;--light-text: #eee;--background: #222;--foreground: #2a2a2a;--light-color: 51, 51, 51;--dark-color: #111;`);
}
function autoMode()
{
    let x = document.getElementById('auto-mode');
    if(x.checked){
        localStorage.setItem('dark', 'auto');
        document.getElementById('manual-mode').checked = false;
        let d = new Date();
        let t = d.getHours();
        if(t> 6 && t < 18){
            daylight();
        }
        else{
            nightlight();
        }
    }
    else{
        localStorage.setItem('dark', 'no');
        daylight();
        clearInterval(mode);
    }
}   
function theme(){
    let x = document.getElementById('manual-mode');
    if(!x.checked){
        daylight();
        localStorage.setItem('dark' ,'no');
    }
    else{
        nightlight();
        localStorage.setItem('dark' ,'yes');
        document.getElementById('auto-mode').checked = false;
    }
}  
// Method object for creating various UI elements
const render = {
projectCard: function(projectName, projectCode){ // creates cards containing project information
    let card = document.createElement('div');
    card.classList.add('project-card','hover','card')
    setAttributes(card, {'title': "Project information", 'data-project-code': projectCode})
    card.innerHTML = `<span>${projectName}</span>`;
    return card;
},
taskCard: function(taskNo){
    let card = document.createElement('div'),
        left = document.createElement('div'),
        right = document.createElement('div'),
        title = document.createElement('h4'),
        description = document.createElement('p'),
        assignedInterns = RIBC.getAssignedInterns(currentProject, currentBranch, taskNo),
        assignedInternsContainer = document.createElement('div'),
        frag = document.createDocumentFragment();
    left.classList.add('left')
    right.classList.add('right')
    if(RIBC.getTaskStatus(currentProject, currentBranch, taskNo) === 'completed')
        card.classList.add('task','completed-task')
    else
        card.classList.add('task')
    left.innerHTML = `<div class="circle"></div><div class="line"></div>`;
    left.firstElementChild.textContent = taskNo;
    let taskDetails = RIBC.getTaskDetails(currentProject, currentBranch, taskNo)
    title.textContent = taskDetails.taskTitle;
    if(assignedInterns){
        getInternDetails(assignedInterns).forEach((intern) => {
            frag.appendChild(render.assignedInternCard(intern));
        })
        assignedInternsContainer.appendChild(frag)
    }
    assignedInternsContainer.classList.add('assigned-interns')
    description.textContent = taskDetails.taskDescription;
    right.append(title, assignedInternsContainer, description)
    card.append(left, right)
    return card;
},
internCard: function(internName, internFLOID, internPoints, container){// creates cards containing intern information
    let card = document.createElement('div'),
        nameCircle = document.createElement('span'),
        internNameSpan = document.createElement('span'),
        pointsBox = document.createElement('span'),
        points = document.createTextNode(internPoints);
        pointsBox.innerHTML = `<svg viewBox="0 0 69.81 69.69">
                            <path d="M34.18,58.59L15.33,69.01c-1.09,0.6-2.39-0.32-2.19-1.54l3.64-22.29c0.08-0.47-0.07-0.94-0.4-1.28L0.92,28.06
                                c-0.85-0.87-0.36-2.33,0.84-2.51l21.23-3.24c0.49-0.07,0.91-0.39,1.12-0.84l9.44-20.11c0.54-1.14,2.16-1.14,2.69,0l9.44,20.11
                                c0.21,0.45,0.63,0.76,1.12,0.84l21.23,3.24c1.2,0.18,1.69,1.64,0.84,2.51L53.43,43.9c-0.33,0.34-0.48,0.81-0.4,1.28l3.64,22.29
                                c0.2,1.23-1.1,2.14-2.19,1.54L35.62,58.59C35.17,58.34,34.63,58.34,34.18,58.59z"/>
                            </svg>`;
    pointsBox.append(points)
    setAttributes(card, {'data-intern-id': internFLOID, 'title': 'Intern Information'})
    card.classList.add('intern-card','card', 'hover');
    nameCircle.textContent = internName.charAt(0);
    internNameSpan.textContent = internName;
    points.textContent = internPoints;
    card.append(nameCircle, internNameSpan, pointsBox)
    return card;
},
updateCard: function(internName, projectName, message){// creates cards containing updates provided by interns
    let card = document.createElement('div');
    card.classList.add('update')
        card.innerHTML = `  <h5>${internName}</h5>  
                            <h4>${projectName}</h4>
                            <p>${message}</p>`;
    return card;
},
branchBtn: function(branch){
    let btn = document.createElement('button');
    btn.classList.add('branch-btn')
    btn.textContent = branch;
    return btn;
},
assignedInternCard: function(intern, options){
    let thisIntern = document.createElement('span');
    thisIntern.classList.add('assigned-intern')
    thisIntern.setAttribute('data-floid', intern.split(':',1))
    thisIntern.textContent = intern.split(':')[1]
    if(options === 'yes'){
        let closeBtn = document.createElement('button');
        closeBtn.innerHTML = `<svg class="close-svg" viewBox="0 0 50.71 50.71">
                            <line x1="50.35" y1="0.35" x2="0.36" y2="50.35"/>
                            <line x1="0.35" y1="0.35" x2="50.35" y2="50.35"/>
                        </svg>`;
        thisIntern.appendChild(closeBtn)
    }
    return thisIntern;
},
taskListItem: function(taskNo){
    let card = document.createElement('div'),
        title = document.createElement('h4'),
        options = document.createElement('span'),
        description = document.createElement('p'),
        assignedInterns = RIBC.getAssignedInterns(currentProject, currentBranch, taskNo),
        assignedInternsContainer = document.createElement('div'),
        frag = document.createDocumentFragment(),
        checkbox = document.createElement('label');
        checkbox.classList.add('checkbox');
        checkbox.innerHTML = `  <input type="checkbox">
                                <svg viewBox="0 0 100 100">
                                    <path class="box" d="M82,89H18c-3.87,0-7-3.13-7-7V18c0-3.87,3.13-7,7-7h64c3.87,0,7,3.13,7,7v64C89,85.87,85.87,89,82,89z"/>
                                    <polyline class="check" points="25.5,53.5 39.5,67.5 72.5,34.5 "/>
                                </svg>`;
    options.innerHTML = `<svg viewBox="0 0 9 45">
                            <circle cx="4.5" cy="4.5" r="4.5"/>
                            <circle cx="4.5" cy="22.5" r="4.5"/>
                            <circle cx="4.5" cy="40.5" r="4.5"/>
                        </svg>`;
    setAttributes(card,{'class': 'task-list-item', 'id': taskNo})
    if(RIBC.getTaskStatus(currentProject, currentBranch, taskNo) === 'incomplete')
        checkbox.firstElementChild.checked = false;              
    else
        checkbox.firstElementChild.checked = true;
       
    let taskDetails = RIBC.getTaskDetails(currentProject, currentBranch, taskNo)
    title.textContent = taskDetails.taskTitle;
    if(assignedInterns){
        getInternDetails(assignedInterns).forEach((intern) => {
            frag.appendChild(render.assignedInternCard(intern, 'yes'));
        })
        assignedInternsContainer.appendChild(frag)
    }
    options.classList.add('task-option')
    assignedInternsContainer.classList.add('assigned-interns')
    description.textContent = taskDetails.taskDescription;
    card.append(checkbox, title, options, assignedInternsContainer, description)
    return card;
},
projectMapCard: function(projectCode){
    let card = document.createElement('div'),
        header = document.createElement('div'),
        title = document.createElement('h2'),
        para = document.createElement('p'),
        branchContainer = document.createElement('div'),
        timeline = document.createElement('h4')
        mapBody = document.createElement('div'),
        frag = document.createDocumentFragment(),
        projectDetails = RIBC.getProjectDetails(projectCode),
        mapItems = [];
    card.id = `${projectCode}_map`;
    currentProject = projectCode;
    branchContainer.id = `${projectCode}_branch_container`;
    title.textContent = projectDetails.projectName;
    para.textContent = projectDetails.projectDescription;
    timeline.textContent = 'Timeline';
    mapBody.id = `${projectCode}_map_body`
    RIBC.getProjectBranches(projectCode).forEach((branch) => {
        frag.appendChild(render.branchBtn(branch))
    })
    branchContainer.appendChild(frag);
    header.appendChild(title)
    card.append(header, para, branchContainer, timeline, mapBody)
    mapItems.push(card, card.id, branchContainer.id, mapBody.id)
    return mapItems;
}
}


//helper functions

function setAttributes(el, attrs) {
for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
}
}

function clearAllInputs(parent){
parent.querySelectorAll("input, textarea").forEach((field) => {
    field.value = '';
})
}

function getInternDetails(floid){
    let internInfo = [];
    if(Array.isArray(floid))
        floid.forEach((id) => {
            Object.keys(iList).forEach((key) => {
                if(id === key)
                    internInfo.push(`${key}:${iList[key]}`)
            })
        })
    else
        Object.keys(iList).forEach((key) => {
            if(floid === key)
                internInfo.push(`${key}:${iList[key]}`)
        })
    return internInfo;
}

var simulateClick = function (elem) {
    let evt = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
    });
    let canceled = !elem.dispatchEvent(evt);
};

let recentPage = 'dashboard_btn',i = currentProgress = projectIndex = 0, prevProject = '',iList,
frag = document.createDocumentFragment(), watchList = [];

document.getElementById('best_interns').addEventListener('click', (event) => {
if(event.target.closest('.intern-card'))
    showInternInfo(event.target.closest('.intern-card'))
})
document.getElementById('show_all').addEventListener('click', (event) => {
if(event.target.closest('.intern-card'))
    showInternInfo(event.target.closest('.intern-card'))
})
document.getElementById('interns').addEventListener('click', (event) => {
if(event.target.closest('.intern-card'))
    showInternInfo(event.target.closest('.intern-card'))
})
document.getElementById('projects').addEventListener('click', (event) => {
if(event.target.closest('.project-card'))
    editProjectInfo(event.target.closest('.project-card'))
})

// function required for popups or modals to appear
function showPopup(popup, permission){ 
let thisPopup = document.getElementById(popup);
if(thisPopup.querySelector('input'))
    thisPopup.querySelector('input').focus()
thisPopup.parentNode.classList.remove('hide');    
thisPopup.classList.add('no-transformations');    
window.onclick = function(event) {
    if (event.target == thisPopup.parentNode && permission !== 'no')
        hidePopup(popup);
}
}

// hides the popup or modal 
function hidePopup(pop, permission){
if(permission === 'no') return;
let popup = document.getElementById(pop)
popup.parentNode.classList.add('hide');    
popup.classList.remove('no-transformations'); 
clearAllInputs(popup)   
}

function showMessage(mode, message){
let banner = document.getElementById('show_message')
if(mode === 'error')
    banner.style.background = '#D32F2F';
else
    banner.style.background = '#00C853';
banner.classList.add('no-transformations')
banner.children[0].textContent = message;
banner.children[1].onclick = function() {
    banner.classList.remove('no-transformations')
}
let timeout = 4000;
setTimeout(()=>{
    banner.classList.remove('no-transformations')
}, timeout)
}
let askConfirmation = function(message){
return new Promise((resolve, reject) => {
    let popup = document.getElementById('confirmation')
    popup.classList.remove('hide')
    popup.children[0].textContent = message;
    popup.children[1].firstElementChild.onclick = function() {
        popup.classList.add('hide')
        resolve(false)
    }
    popup.children[1].children[1].onclick = function() {
        popup.classList.add('hide')
        resolve(true);
    }
})
}

// Adds interns to the database **Only SubAdmins can add interns
function addInternToList(){
let internName = document.getElementById('intern_name_field').value.trim(),
    internFLOID = document.getElementById('intern_flo_id_field').value.trim();
if(!internName){
    showMessage('error', `please enter intern's name`)
    return;
}
if(internFLOID && RIBC.manage.addIntern(internFLOID, internName))
{
    document.getElementById('interns').appendChild(render.internCard(internName, internFLOID, '1', 'interns'))
    hidePopup('add_intern_popup');
    showMessage('', `${internName} added as an intern.`)
}
else{
    document.getElementById('intern_flo_id_field').setAttribute('style', 'outline: solid 1px red');
    showMessage('error', `please enter intern's FLO ID`)
    setTimeout(()=> {
        document.getElementById('intern_flo_id_field').setAttribute('style', 'oultine: none');
    },1000)
}
}
function addProjectToList(){
let projectName = document.getElementById('project_name_field').value.trim(),
    projectDescription = document.getElementById('project_description_field').value.trim();
if(!projectName){
    showMessage('error', 'Project name is important!')
    return
}
if(!projectDescription){
    showMessage('error', 'Project description is important!')
    return
}   
    let date = new Date(),
        projectCode;
        if(typeof RIBC.getProjectList() === undefined)
            projectCode = `${date.getFullYear()}_project_1`;
        else
            projectCode = `${date.getFullYear()}_project_${RIBC.getProjectList().length+1}`;
    RIBC.manage.createProject(projectCode)
    RIBC.manage.addProjectDetails(projectCode,{projectName: projectName, projectDescription: projectDescription})
    document.getElementById('projects').appendChild(render.projectCard(projectName, projectCode))
    hidePopup('add_project_popup');
}

// opens a popup containing various intern information
function showInternInfo(intern) { 
showPopup('intern_info');
let popup = document.getElementById('intern_info');
popup.children[0].textContent = intern.children[1].textContent; // intern name
popup.children[1].innerHTML = `<h5>Points</h5>${intern.children[2].textContent}`; // points earned by intern
popup.children[2].firstElementChild.innerHTML = `${intern.dataset.internId}`; // intern 
}

// opens a popup containing various project information
function showProjectInfo(project, contain, clicked){ 
let container = document.getElementById(contain);
if(clicked === 'no'){
    currentProject = project;
}
else{
    currentProject = project.dataset.projectCode;
}
let projectDetails = RIBC.getProjectDetails(currentProject);
container.firstElementChild.children[0].textContent = projectDetails.projectName; // project name
if(JSON.parse(localStorage.getItem('watchList')).includes(currentProject)){
    container.firstElementChild.children[1].textContent = 'Already watching';
}
else{
    container.firstElementChild.children[1].textContent = 'Watch this project';
}
container.children[1].textContent = projectDetails.projectDescription;
container.children[2].innerHTML = ``;
RIBC.getProjectBranches(currentProject).forEach((branch) => {
    frag.appendChild(render.branchBtn(branch))
})
container.children[2].appendChild(frag);
container.children[2].children[0].click()
}

let currentBranch = 'mainLine',
currentProject = '',
currentTask = '',
lastProject,
dashboardProject = '';
function editProjectInfo(project){
if(lastProject != project){
    let thisContainer = document.getElementById('edit_data'),
        container = document.getElementById('branch_container'),
        branchList = document.querySelectorAll('.branch-btn'),
        frag = document.createDocumentFragment();
        container.innerHTML = '',
        document.getElementById('task_list').innerHTML = '';
    currentProject = project.dataset.projectCode;
    branchList.forEach((branch) => {
        branch.classList.remove('active-branch')
    })
    thisContainer.firstElementChild.firstElementChild.textContent = project.children[0].textContent;
    document.getElementById('admin_project_description').textContent = RIBC.getProjectDetails(currentProject).projectDescription;
    RIBC.getProjectBranches(currentProject).forEach((branch) => {
        frag.appendChild(render.branchBtn(branch))
    })
    container.appendChild(frag)
    container.firstElementChild.click()
    document.getElementById('add_task').onclick = function(){
        addTask()
    }
}
lastProject = project
}
function showTasksOfBranch(btn, destination, taskListContainer){
currentBranch = btn.textContent;
let content = RIBC.getProjectMap(currentProject)[currentBranch],
    taskList = document.getElementById(taskListContainer),
    frag = document.createDocumentFragment(),
    allbranches = document.getElementById(destination).querySelectorAll('.branch-btn');
    taskList.innerHTML = '';
allbranches.forEach((branchBtn) => {
    branchBtn.classList.remove('active-branch')
})
btn.classList.add('active-branch')
if(!content[1] && !taskListContainer === 'task_list'){
    taskList.textContent = "No tasks added yet, Please explore other projects :)"
}
else{
    if(taskListContainer === 'task_list'){
        showInnerPage('edit_data')
        content.slice(4).forEach((taskNo) => {
            frag.appendChild(render.taskListItem(taskNo))
        })
    }
    else{
        content.slice(4).forEach((taskNo) => {
            frag.appendChild(render.taskCard(taskNo))
        })
    }
    taskList.appendChild(frag);
}
}
document.getElementById('task_list').addEventListener('click', (event) => {
    let contextMenu = document.getElementById('task_context');
    if(event.target.closest('.task-list-item'))
        currentTask = event.target.closest('.task-list-item');
    if(event.target.closest('.task-option')){
        if((event.target.closest('.task-option').getBoundingClientRect().top - window.pageYOffset) > window.innerHeight - (contextMenu.getBoundingClientRect().height + 80))
            contextMenu.setAttribute('style',`top: ${event.target.closest('.task-option').offsetTop - contextMenu.getBoundingClientRect().height - 16}px`)
        else
            contextMenu.setAttribute('style',`top: ${event.target.closest('.task-option').offsetTop + 32}px`)
        contextMenu.classList.toggle('hide')
        let y =document.addEventListener("click", function(event) {
            if (event.target.closest('#context_menu') || event.target.closest('.task-option')) return;
            contextMenu.classList.add('hide')
            document.removeEventListener('click', y);
        });
        let z =document.addEventListener("touchstart", function(event) {
            if (event.target.closest('#context_menu') || event.target.closest('.task-option')) return;
            contextMenu.classList.add('hide')
            document.removeEventListener('click', z);
        });
        return
    }
    if(event.target.closest('input')){
        if(event.target.closest('input').checked){
            RIBC.manage.putTaskStatus('completed', currentProject, currentBranch, currentTask.id)
        }
        else{
            RIBC.manage.putTaskStatus('incomplete', currentProject, currentBranch, currentTask.id)
        }
        return
    }
    if(event.target.closest('.assigned-intern button')){
        RIBC.manage.unassignInternFromTask(event.target.closest('.assigned-intern').dataset.floid, currentProject, currentBranch, currentTask.id)
        event.target.closest('.assigned-intern').remove()
        showMessage('', 'Intern removed from the task')
    }

})
function addTask(){
let title = document.createElement('input'),
    inputLabel = document.createElement('label'),
    description = document.createElement('textarea'),
    textareaLabel = document.createElement('label'),
    btn = document.createElement('button'),
    parent = document.getElementById('task_list'),
    card = document.createElement('div'),
    closeBtn = document.createElement('button'),
    taskno;
card.classList.add('temp-task')
btn.innerHTML = `<svg class="tick-mark" viewBox="0 0 100 100">
                    <polyline points="25.5,53.5 39.5,67.5 72.5,34.5 "/>
                </svg>add`;
closeBtn.innerHTML = `<svg class="close-svg" viewBox="0 0 50.71 50.71">
                            <line x1="50.35" y1="0.35" x2="0.36" y2="50.35"/>
                            <line x1="0.35" y1="0.35" x2="50.35" y2="50.35"/>
                        </svg>cancel`;
setAttributes(title, {'id': "title", 'placeholder': "Task title"})
setAttributes(description, {'id': "description", 'placeholder': "Task description", "rows": "4"})
inputLabel.classList.add('input')
textareaLabel.classList.add('input')
inputLabel.appendChild(title)
card.appendChild(inputLabel)
textareaLabel.appendChild(description)
card.appendChild(textareaLabel)
card.appendChild(closeBtn)
card.appendChild(btn); 
parent.appendChild(card)
card.scrollIntoView({behavior: 'smooth'})
disableBtn('add_task')
btn.onclick = function(){
    let titleContent = document.getElementById('title').value,
        descriptionContent = document.getElementById('description').value;
    if(titleContent === ''){
        showMessage('error', 'Please enter task title')
        return
    }
    if(descriptionContent === ''){
        showMessage('error', 'Please enter description of the task')
        return
    }
    taskno = RIBC.manage.addTaskInMap(currentProject, currentBranch)
    RIBC.manage.putTaskDetails({taskTitle: titleContent, taskDescription: descriptionContent}, currentProject, currentBranch, taskno)
    RIBC.manage.putTaskStatus('incomplete', currentProject, currentBranch, taskno)
    showMessage('', 'Task added to current branch')
    card.remove();
    parent.appendChild(render.taskListItem(taskno))
    enableBtn('add_task')
}
closeBtn.onclick = function(){
    card.remove();
    enableBtn('add_task')
}
}
function commitToChanges(){
askConfirmation("Do you want to commit to changes?").then((result) => {
    if(result){
        RIBC.manage.updateObjects()
        showMessage('', 'Changes saved.')
    }
})
}
function removeThisTask(){
askConfirmation("Are you sure to delete this task?").then((result) => {
    if(result){
        RIBC.manage.deleteTaskInMap(currentProject, currentBranch, currentTask.id)
        currentTask.remove();
    }  
})
}
function enableBtn(btn){
let thisBtn = document.getElementById(btn);
    if(thisBtn.disabled)
        thisBtn.disabled = false;
}

function disableBtn(btn){
let thisBtn = document.getElementById(btn);
    if(!thisBtn.disabled)
        thisBtn.disabled = true;
}

document.getElementById(recentPage).click();

function showPage(elem, page, offsprings, type){
let thisPage = document.getElementById(page),
        element = document.getElementById(elem),
        allTabs = document.querySelectorAll('.tabs'),
        allPages = document.querySelectorAll('.page')
if(type !== 'innerPage')
    recentPage = elem;
if(elem === 'dashboard_btn')
    currentProject = dashboardProject;
if(page === 'lastPage'){
    console.log(recentPage)
    allPages.forEach(function(pages){
        pages.classList.add('hide-completely');
    });
    document.getElementById(recentPage).click();
}
else{
    allPages.forEach(function(pages){
        pages.classList.add('hide-completely');
    });
    allTabs.forEach(function(tab){
        tab.classList.remove('active');
    });
    if(element)
        element.classList.add('active');
    thisPage.classList.remove('hide-completely');
    if(offsprings === 'updates')
    {
        thisPage.children[1].innerHTML = '';
        thisPage.children[0].children[1].textContent = `Interns' Feed`
        let updates = RIBC.getInternUpdates();
        document.getElementById('updates').classList.add('hide')
        Object.keys(updates).forEach((entry) => {
            frag.appendChild(render.updateCard(getInternDetails(updates[entry].floID)[0].split(':')[1], updates[entry].update.topic, updates[entry].update.description))
        })
        thisPage.children[1].appendChild(frag)
    }
    else if(offsprings === 'interns')
    {
        thisPage.children[1].innerHTML = '';
        thisPage.children[0].children[1].textContent = 'Interns'
        iList = RIBC.getInternList();
        for(intern in iList){
            frag.appendChild(render.internCard(iList[intern],intern, RIBC.getInternRating(intern),'interns'))
        }
        thisPage.children[1].appendChild(frag)
    }
}
}
function showInnerPage(page){
if(window.innerWidth < 640)
document.querySelectorAll('.list-container').forEach((container) => {
    container.classList.add('hide-completely')
})
document.getElementById(page).classList.remove('hide-completely');
}

function showListCont(container){
if(window.innerWidth < 640)
document.querySelectorAll('.inner-page').forEach((container) => {
    container.classList.add('hide-completely')
})
document.getElementById(container).classList.remove('hide-completely');
}


// copies text from adjacent element to clipboard
function copyToClipboard(parent, childIndex) {
let input = document.createElement('textarea'),
    toast = document.getElementById('textCopied');
input.setAttribute('readonly', '');
input.setAttribute('style', 'position: absolute; left: -9999px');
document.body.appendChild(input);
input.value = parent.children[childIndex].textContent;
input.select();
document.execCommand('copy');
document.body.removeChild(input);
toast.classList.remove('hide');
setTimeout(() => {
    toast.classList.add('hide');
}, 1000)
}

function logout(){
askConfirmation("Do you want to logout?").then((result) => {
    if(result){
        floDapps.clearCredentials()
        compactIDB.deleteDB().then((message) => {
            onLoadStartUp()
            showMessage('','You have logged out successfully.')
        }).catch((error) => {
            console.log(error)
        })
    }
})
}
let allInterns = [];

document.getElementById('interns_list_container').addEventListener('click', (event) => {
if(event.target.closest('.intern-card')){
    let floid = event.target.closest('.intern-card').dataset.internId;
    if(RIBC.manage.assignInternToTask(floid, currentProject, currentBranch, currentTask.id)){
        showMessage('',`${event.target.closest('.intern-card').children[1].textContent} assigned to ${RIBC.getProjectDetails(currentProject).projectName}`)
        currentTask.querySelector('.assigned-interns').appendChild(render.assignedInternCard(getInternDetails(floid)[0], 'yes'))
        setTimeout(() => {
            allInterns.forEach((intern) => {
                intern.style.display = "";
            })
        },1000)
    }
    else    
        showMessage('error', 'Intern already assigned')
    hidePopup('interns_list')
}
})

function unassignIntern(){
RIBC.manage.unassignInternFromTask(currentProject, currentBranch, currentTask)
}

function populateIntens(){
iList = RIBC.getInternList();
let internsPopup = document.getElementById('interns_list_container');
for(intern in iList){
    frag.appendChild(render.internCard(iList[intern],intern, RIBC.getInternRating(intern)))
}
internsPopup.innerHTML = ''
internsPopup.appendChild(frag)
}

function addNewBranch(){
showPopup('create_branch')
let popup = document.getElementById('create_branch'),
    startPoint = document.getElementById('branch_start_point'),
    mergePoint = document.getElementById('branch_merge_point'),
    branchName = '';
startPoint.value = parseInt(currentTask.id);
document.getElementById('create_branch_btn').onclick = () =>{
    branchName = RIBC.manage.addBranch(currentProject, currentBranch, startPoint, parseInt(mergePoint.value));
    showMessage('',`branch added ${branchName}`)
    document.getElementById('branch_container').appendChild(render.branchBtn(branchName))
    hidePopup('create_branch')
}
}

function postUpdate(){
let updateTopic = document.getElementById('update_topic'),
    updateDescription = document.getElementById('update_description');

}

function showUpdatePanel(){
let container = document.getElementById('updates'),
    btn = document.getElementById('update_panel_btn');
btn.classList.toggle('opac')
container.classList.toggle('hide')
let y = document.addEventListener("click", function(event) {
    if (event.target.closest('#intern_updates')) return;
    container.classList.add('hide')
    btn.classList.remove('opac')
    document.removeEventListener('click', y);
});
}

function watchThisProject(thisBtn){
watchList = JSON.parse(localStorage.getItem('watchList'))
if(!watchList.includes(currentProject)){
    watchList.push(currentProject)
    thisBtn.textContent = 'Already watching'
    localStorage.setItem('watchList', JSON.stringify(watchList))
    showMessage('', `${RIBC.getProjectDetails(currentProject).projectName} added to your watch list.`)
}
else{
    watchList.splice(watchList.indexOf(currentProject), 1)
    thisBtn.textContent = 'Watch this project'
    localStorage.setItem('watchList', JSON.stringify(watchList))
    showMessage('', `${RIBC.getProjectDetails(currentProject).projectName} removed from your watch list.`)
}
}

function showProjectMap(projectCode, container){
let tempCard = render.projectMapCard(projectCode),
containerCard = document.getElementById(container);
containerCard.innerHTML =``;
containerCard.appendChild(tempCard[0])
document.getElementById(tempCard[2]).addEventListener('click', (event) => {
    if(event.target.closest('.branch-btn')){
        showTasksOfBranch(event.target.closest('.branch-btn'), tempCard[1], tempCard[3], '')
    }
})
document.getElementById(tempCard[2]).firstElementChild.click()
}

function renderAllElements(){
let frag = document.createDocumentFragment();

//creates cards for highest performing interns
//sort interns earned points


iList = RIBC.getInternList();

if(floGlobals.subAdmins.includes(myFloID)){
    document.querySelectorAll('.admin-options').forEach((option) => {
        option.classList.remove('hide-completely')
    })
}

if(!Object.keys(iList).includes(myFloID))
    document.getElementById('floating_btn').classList.add('hide-completely')

document.getElementById('interns').innerHTML = ``;
for(intern in iList){
    frag.appendChild(render.internCard(iList[intern],intern, RIBC.getInternRating(intern),'interns'))
}
document.getElementById('interns').appendChild(frag)

document.getElementById('best_interns').innerHTML = ``;
let limit = 4;
for(intern in iList){
    frag.appendChild(render.internCard(iList[intern],intern, RIBC.getInternRating(intern)))
    limit--;
    if(!limit)
        break;
}
document.getElementById('best_interns').appendChild(frag)


// displays recent updates given by interns
document.getElementById('update_container').innerHTML='';
let updates = RIBC.getInternUpdates(8);
Object.keys(updates).forEach((entry) => {
    frag.appendChild(render.updateCard(getInternDetails(updates[entry].floID)[0].split(':')[1], updates[entry].update.topic, updates[entry].update.description))
})
document.getElementById('update_container').appendChild(frag)
// displays recent projects
//document.getElementById('project_list_container').innerHTML='';
RIBC.getProjectList().forEach((project) => {
    let pc;
    if((RIBC.getProjectDetails(project).projectName !== undefined))
        pc = RIBC.getProjectDetails(project).projectName;
    else
        pc = project
    frag.appendChild(render.projectCard(pc, project))
})
document.getElementById('project_list_container').appendChild(frag)

document.getElementById('projects').innerHTML = ``;
let pList = RIBC.getProjectList();
for(i = 0; i < pList.length; i++){
    frag.appendChild(render.projectCard(RIBC.getProjectDetails(pList[i]).projectName, pList[i]))
}

document.getElementById('projects').appendChild(frag)

if(localStorage.getItem('watchList') === null)
    localStorage.setItem('watchList', JSON.stringify(watchList))

populateIntens()

allInterns = document.getElementById('interns_list_container').querySelectorAll('.intern-card');

document.getElementById('branch_container').addEventListener('click', (event) => {
    if(event.target.closest('.branch-btn')){
        showTasksOfBranch(event.target.closest('.branch-btn'), 'edit_data','task_list')
    }
})

document.getElementById('intern_search_field').addEventListener('keyup', (event) => {
    let container = document.getElementById('interns_list_container'),
        inputField = document.getElementById('intern_search_field');
    if(event.keyCode === 13)
    {
        for(let i = 0;i < container.children.length; i++){
            if(container.children[i].style.display != 'none'){
                container.children[i].click()
                break;
            }
        }  
    }
    else
        allInterns.forEach((intern) => {
            if (intern.children[1].textContent.toLowerCase().indexOf(inputField.value.toLowerCase().trim()) > -1) {
                intern.style.display = "";
            } else {
                intern.style.display = "none";
            }
        })
})

document.getElementById('post_update_btn').addEventListener('click',() => {
    let topic = document.getElementById('update_topic').value.trim(),
        description = document.getElementById('update_description').value.trim();
        if(topic !== '' && description !== ''){
            RIBC.postInternUpdate({topic: topic,description: description})
            .then((result) => {
                showMessage('', 'update posted')
                hidePopup('post_update')
            })
            .catch((error) => {
                showMessage('error', error)
            })
        }
        else{
            showMessage('error', 'Please enter topic and description')
        }
})

document.getElementById('update_panel_btn').addEventListener('click', showUpdatePanel)

let projectExplorer = document.getElementById('project_explorer');
for(i = 0; i < pList.length; i++){
    frag.appendChild(render.projectCard(RIBC.getProjectDetails(pList[i]).projectName, pList[i]))
}

projectExplorer.children[1].appendChild(frag)
projectExplorer.children[1].addEventListener('click', (event) => {
    if(event.target.closest('.project-card')){
        showProjectInfo(event.target.closest('.project-card'), 'right')
    }
})
projectExplorer.children[2].children[2].addEventListener('click', (event) => {
    if(event.target.closest('.branch-btn'))
        showTasksOfBranch(event.target.closest('.branch-btn'), 'project_explorer', 'explorer_task_list')
})
if(JSON.parse(localStorage.getItem('watchList')).length){
    showProjectMap(JSON.parse(localStorage.getItem('watchList'))[0], 'status_map_container')
    dashboardProject = JSON.parse(localStorage.getItem('watchList'))[0];
}
}
function loader(mode){
let loader = document.getElementById('loader');
if(mode === 'show'){
    loader.classList.remove('hide')
    loader.firstElementChild.children[0].classList.add('loading-animation')
}
else{
    loader.classList.add('hide')
    loader.firstElementChild.children[0].classList.remove('loading-animation')
}
}
let myInput = function(){
return new Promise((resolve, reject) => {
    loader('hide')
    showPopup('sign_in' ,'no');
    let container = document.getElementById('priv_key_sign_in'),
        signIn = document.getElementById('sign_in'),
        privField = document.getElementById('priv_key_field'),
        btn = document.getElementById('back_to_main_page');
    document.getElementById('guest_btn').onclick = function(){
        hidePopup('sign_in')
        reject(null);
    }
    document.getElementById('priv_key_btn').onclick = function(){
        container.classList.remove('hide-completely')
        signIn.children[2].classList.add('hide-completely')
        btn.classList.remove('hide-completely')
    }
    btn.onclick = function(){
        container.classList.add('hide-completely')
        signIn.children[2].classList.remove('hide-completely')
        btn.classList.add('hide-completely')
    }
    privField.addEventListener('keyup', (event) =>{
        if(privField.value.trim() !== '')
            enableBtn('sign_in_btn')
        else
            disableBtn('sign_in_btn')
        if(event.keyCode === 13){
            if(privField.value.trim().length === 52){
                resolve(privField.value.trim())
                hidePopup('sign_in')
                loader('show')
            }
            else{
                showMessage('error', 'Please enter correct private key.')
            }
        }
    })
    document.getElementById('sign_in_btn').onclick = function(){
        if(privField.value.trim().length === 52){
            resolve(privField.value.trim())
            hidePopup('sign_in')
            loader('show')
        }
        else{
            showMessage('error', 'Please enter correct private key.')
        }
    }
})
let confirmationDialog = document.getElementById('confirmation');
confirmationDialog.addEventListener('keyup', (event) => {
    if(event.keycode === 13)
        confirmationDialog.children[1].children[1].click()
})  
}
