var kanban = {
    todoList: JSON.parse(localStorage.getItem('todoList')) || [],
    doingList: JSON.parse(localStorage.getItem('doingList')) || [],
    doneList: JSON.parse(localStorage.getItem('doneList')) || [],
    todoBoard: document.getElementById('todoBoard'),
    doingBoard: document.getElementById('doingBoard'),
    doneBoard: document.getElementById('doneBoard'),
    render: kanbanRender
}

var statusTitle = {
    todo: 'Nhiệm vụ',
    doing: 'Đang làm',
    done: 'Hoàn thành'
};
var removeBtns = [];
var saveBtns = [];
kanban.render();




// Hiển thị toàn bộ kanban
function kanbanRender() {
    columnRender(kanban.todoList, 'todo');
    columnRender(kanban.doingList, 'doing');
    columnRender(kanban.doneList, 'done');

    // add event cho button xóa
    removeBtns = document.getElementsByClassName('removeBtn');
    for (var i = 0; i < removeBtns.length; i++) {
        removeBtns[i].addEventListener('click', removeTask, false);
    }
    //

    saveBtns = document.getElementsByClassName('saveBtn');
    for (var i = 0; i < saveBtns.length; i++) {
        saveBtns[i].addEventListener('click', saveTask, false);
    }


    //
    kanban.todoBoard.addEventListener('drop', drop, false);
    kanban.todoBoard.addEventListener('dragover', allowDrop, false);

    kanban.doingBoard.addEventListener('drop', drop, false);
    kanban.doingBoard.addEventListener('dragover', allowDrop, false);

    kanban.doneBoard.addEventListener('drop', drop, false);
    kanban.doneBoard.addEventListener('dragover', allowDrop, false);



}


// Hiển thị các cột
function columnRender(list, status) {
    // hiển thị số lượng
    var count = list.length;
    kanban[`${status}Board`].children[0].innerHTML = `${statusTitle[status]}<span class="kanban__count">${count}</span>`;
    // hiển thị các nhiệm vụ
    var tasks = list.map(function (item, index) {
        return `<div class="wrap-item">
                    <textarea   name="${status}"
                                key="${index}"
                                class="kanban__item ${status}-border-color"
                                draggable="true" ondragstart="drag(event)"
                                >${item.content}</textarea>
                    <button class="saveBtn"><i class="fas fa-check"></i></button>
                    <button class="removeBtn"><i class="fas fa-times"></i></button>
                </div>`
    }).join('');
    kanban[`${status}Board`].children[1].innerHTML = tasks;
}

function addNewTask(status) {
    kanban[`${status}List`].push({
        id: Math.floor(Math.random() * 100 + Math.random() * 20),
        status: status,
        content: ''
    });
    kanban.render();
}


function saveTask(e) {
    var task = e.currentTarget.previousElementSibling;
    var newContent = task.value;
    var index = parseInt(task.getAttribute('key'));
    kanban[`${task.name}List`][index].content = newContent;
    localStorage.setItem(`${task.name}List`, JSON.stringify(kanban[`${task.name}List`]));
    kanban.render();
}


function removeTask(e) {
    var task = e.currentTarget.previousElementSibling.previousElementSibling;
    var index = parseInt(task.getAttribute('key'));
    kanban[`${task.name}List`].splice(index, 1);
    localStorage.setItem(`${task.name}List`, JSON.stringify(kanban[`${task.name}List`]));
    kanban.render();
}



function drag(e) {
    e.dataTransfer.setData("status", e.target.name);
    e.dataTransfer.setData("index", e.target.getAttribute('key'));
}


function drop(e) {
    e.preventDefault();
    var index = e.dataTransfer.getData("index");
    var status = e.dataTransfer.getData("status");


    var nextStatus = e.currentTarget.getAttribute('name')
    var task = kanban[`${status}List`][index];

    kanban[`${status}List`].splice(index, 1);
    kanban[`${nextStatus}List`].push(task);
    localStorage.setItem(`${status}List`, JSON.stringify(kanban[`${status}List`]));
    localStorage.setItem(`${nextStatus}List`, JSON.stringify(kanban[`${nextStatus}List`]));
    kanban.render();
}


function allowDrop(ev) {
    ev.preventDefault();
}











