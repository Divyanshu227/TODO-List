let taskInput = document.getElementById('task-input');
let deadlineInput = document.getElementById('deadline-input');
let timeInput = document.getElementById('time-input');
let btn = document.getElementById('btn');
let downloadJsonBtn = document.getElementById('download-json');
let downloadCsvBtn = document.getElementById('download-csv');
let tasklist = document.getElementById('task-list');
let task = [];
let localstoragedata = localStorage.getItem('task array');
if(localstoragedata != null){
    let ogdata =JSON.parse(localstoragedata);
    task = ogdata;
    maketodo();
}
btn.addEventListener("click", function () {
    let query = taskInput.value;
    let deadlineVal = deadlineInput.value;
    let timeVal = timeInput.value;
    if (deadlineVal && timeVal) {
        deadlineVal = deadlineVal + " " + timeVal;
    }
    taskInput.value = "";
    deadlineInput.value = "";
    if(query.trim() === ""){
        alert("No value entered");
        return;
    }
    let taskObj = {
        id: Date.now(),
        text: query,
        deadline: deadlineVal || null
    };
    task.push(taskObj);
    localStorage.setItem("task array", JSON.stringify(task));
    maketodo();
});
function maketodo() {
    tasklist.innerHTML="";
    for (let i = 0; i < task.length; i++) {
        let {id, text, deadline} = task[i];
        let element = document.createElement('div');
        element.innerHTML = `<div class="todo-left"><span class="task" contenteditable="false">${text}</span>` +
            (deadline ? `<span class="deadline" style="color: black;">${deadline}</span>` : '') +
            `</div>
            <div class="todo-right">
              <button class='edit'>Edit</button>
              <span class="delete"><svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM13.4142 13.9997L15.182 15.7675L13.7678 17.1817L12 15.4139L10.2322 17.1817L8.81802 15.7675L10.5858 13.9997L8.81802 12.232L10.2322 10.8178L12 12.5855L13.7678 10.8178L15.182 12.232L13.4142 13.9997ZM9 4V6H15V4H9Z"></path></svg></span>
            </div>`;
    let delbtn = element.querySelector('.delete');
    let editbtn = element.querySelector('.edit');
    let taskText = element.querySelector('.task');
    delbtn.addEventListener("click" ,function () {
        let filteredarray = task.filter(function (taskObj) {
            return taskObj.id != id;
        });
        task = filteredarray;
        localStorage.setItem("task array", JSON.stringify(task));
        tasklist.removeChild(element);
    });
    editbtn.addEventListener("click", function(){
        if(editbtn.innerText==="Edit"){
            taskText.setAttribute('contenteditable', 'true');
            taskText.focus();
            editbtn.innerText = 'Save';
        }
        else{
            taskText.setAttribute('contenteditable', 'false');
            let updatedText = taskText.innerText.trim();
            if (updatedText!=="") {
                task = task.map(function(taskObj){
                    if (taskObj.id===id) {
                        taskObj.text = updatedText;
                    }
                    return taskObj;
                });
                localStorage.setItem("task array", JSON.stringify(task));
            }
            editbtn.innerText = 'Edit';
        }
    });
    element.classList.add('todo');
    tasklist.appendChild(element);
    }
}

function downloadJSON(){
    const dataStr = JSON.stringify(task, null, 2);
    const blob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'todos.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

function downloadCSV(){
    const header = ['id','text','deadline'];
    const rows = task.map(t => [t.id, (`"${String(t.text).replace(/"/g,'""')}"`), t.deadline || '']);
    const csv = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'todos.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

if (downloadJsonBtn) downloadJsonBtn.addEventListener('click', downloadJSON);
if (downloadCsvBtn) downloadCsvBtn.addEventListener('click', downloadCSV);