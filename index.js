var kanban = {
    todoList: JSON.parse(localStorage.getItem('todoList')) || [], // Danh sách nhiệm vụ
    doingList: JSON.parse(localStorage.getItem('doingList')) || [], // Danh sách đang làm
    doneList: JSON.parse(localStorage.getItem('doneList')) || [], // Danh sách đã hoàn thành
    todoColumn: document.getElementById('todoColumn'), // bảng (cột) nhiệm vụ
    doingColumn: document.getElementById('doingColumn'), // bảng (cột) đang làm
    doneColumn: document.getElementById('doneColumn'), // bảng (cột) đã hoàn thành
    render: kanbanRender, // method hiển thị kanban

    // method thêm các event cần thiết cho cột
    addColumnEvent: function () {
        // thêm event drapover, drop cho bảng nhiệm vụ
        this.todoColumn.addEventListener('drop', drop, false);
        this.todoColumn.addEventListener('dragover', allowDrop, false);

        // thêm event drapover, drop cho bảng đang làm
        this.doingColumn.addEventListener('drop', drop, false);
        this.doingColumn.addEventListener('dragover', allowDrop, false);

        // thêm event drapover, drop cho bảng đã hoàn thành
        this.doneColumn.addEventListener('drop', drop, false);
        this.doneColumn.addEventListener('dragover', allowDrop, false);
    }
}

// các loại nhiệm vụ
var statusType = {
    todo: 'Nhiệm vụ',
    doing: 'Đang làm',
    done: 'Hoàn thành'
};
// Lưu trữ button xóa task
var removeBtns = [];
// Lưu trữ button lưu task
var saveBtns = [];

/**  */
kanban.render(); // hiển thị lần đầu
kanban.addColumnEvent() // add các event cần thiết cho các bảng ( cột )



/**Khai báo các function cần sử dụng trong project  */

// 1.Hiển thị toàn bộ kanban
function kanbanRender() {
    columnRender(kanban.todoList, 'todo');
    columnRender(kanban.doingList, 'doing');
    columnRender(kanban.doneList, 'done');

    // Thêm click event cho button xóa task
    removeBtns = document.getElementsByClassName('removeBtn');
    for (var i = 0; i < removeBtns.length; i++) {
        removeBtns[i].addEventListener('click', removeTask, false);
    }

    // Thêm click event cho button lưu task
    saveBtns = document.getElementsByClassName('saveBtn');
    for (var i = 0; i < saveBtns.length; i++) {
        saveBtns[i].addEventListener('click', saveTask, false);
    }

}


// 2.Hiển thị các cột (Column)
function columnRender(list, status) {
    // hiển thị số lượng
    var count = list.length;
    kanban[`${status}Column`].children[0].innerHTML = `${statusType[status]}<span class="kanban__count">${count}</span>`;
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
    kanban[`${status}Column`].children[1].innerHTML = tasks;
}

// 3.Tạo thêm task mới, vẫn còn rỗng ( chưa có nội dung )
function addNewTask(status) {
    kanban[`${status}List`].push({
        id: Math.floor(Math.random() * 100 + Math.random() * 20),
        status: status,
        content: ''
    });
    kanban.render();
}

// 4.Lưu task ( nhập xong nội dung và được lưu lại khi click vào button lưu )
function saveTask(e) {
    var task = e.currentTarget.previousElementSibling;
    var newContent = task.value;
    var index = parseInt(task.getAttribute('key'));
    kanban[`${task.name}List`][index].content = newContent;
    localStorage.setItem(`${task.name}List`, JSON.stringify(kanban[`${task.name}List`]));// lưu dữ liệu lên localStorage
    alert("Đã lưu thành công !");
    kanban.render();
}

// 5.Xóa task ( xóa task khi click vào button xóa )
function removeTask(e) {
    var task = e.currentTarget.previousElementSibling.previousElementSibling;
    var index = parseInt(task.getAttribute('key'));
    kanban[`${task.name}List`].splice(index, 1);
    localStorage.setItem(`${task.name}List`, JSON.stringify(kanban[`${task.name}List`]));// lưu dữ liệu lên localStorage
    alert("Đã xóa thành công !");
    kanban.render();
}

// 6.Kéo task ( drag )
function drag(e) {
    e.dataTransfer.setData("status", e.target.name);
    e.dataTransfer.setData("index", e.target.getAttribute('key'));
    // Chỉnh màu nền khi đang kéo task
    e.currentTarget.style.backgroundColor = '#fcebc9';
}

// 7.Thả task ( drop )
function drop(e) {
    e.preventDefault();
    var index = e.dataTransfer.getData("index");
    var status = e.dataTransfer.getData("status");

    var nextStatus = e.currentTarget.getAttribute('name')
    var task = kanban[`${status}List`][index];

    kanban[`${status}List`].splice(index, 1);
    kanban[`${nextStatus}List`].push(task);
    // lưu dữ liệu lên localStorage
    localStorage.setItem(`${status}List`, JSON.stringify(kanban[`${status}List`]));
    localStorage.setItem(`${nextStatus}List`, JSON.stringify(kanban[`${nextStatus}List`]));
    kanban.render();
}

// 8. Cho phép thả ( drop )
function allowDrop(ev) {
    ev.preventDefault();
}











