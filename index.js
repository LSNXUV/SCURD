const apihost = 'http://localhost:8080';
const defaultPageSize = 13;

// 显示消息并在几秒后自动消失的函数
function showMessage(message, duration = 2500) {
    let messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.innerText = message;
    document.body.appendChild(messageElement);
    setTimeout(() => {
        messageElement.classList.add('show');
    }, 100);
    setTimeout(() => {
        messageElement.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(messageElement);
        }, 500);
    }, duration);

}
//关闭更新模态框
function closeUpdateModal() {
    let updateStudentModal = document.getElementById('updateStudentModal');
    let modal = bootstrap.Modal.getInstance(updateStudentModal);
    modal.hide();
}

//关闭添加模态框
function closeAddModal() {
    let addStudentModal = document.getElementById('addStudentModal');
    let modal = bootstrap.Modal.getInstance(addStudentModal);
    modal.hide();
}
//添加事件
const addClick = (event) => {
    event.preventDefault();

    // 获取表单数据
    let studentId = document.getElementById('studentId').value;
    let studentName = document.getElementById('studentName').value;
    let studentMajor = document.getElementById('studentMajor').value;
    let studentAge = document.getElementById('studentAge').value;
    let studentGender = document.getElementById('studentGender').value;
    let studentPhone = document.getElementById('studentPhone').value;
    let studentEmail = document.getElementById('studentEmail').value;
    if (!studentId || !studentName || !studentMajor || !studentAge || !studentGender || !studentPhone || !studentEmail) {
        return;
    }

    // 构建要提交的数据对象
    let studentData = {
        id: studentId,
        name: studentName,
        major: studentMajor,
        age: studentAge,
        gender: studentGender,
        phone: studentPhone,
        email: studentEmail
    };

    // 发送请求到后端保存数据
    axios.post(apihost + '/student/save', studentData)
        .then(function (response) {

            initAllStudents();
            closeAddModal();
            showMessage('添加成功');
        })
        .catch(function (error) {
            showMessage('添加失败：'+error.response.data.msg);
            console.error(error);
        });
}
//初始化添加模态框
function initAddModal() {
    const addStudentModalElement = document.getElementById('addStudentModal');

    addStudentModalElement.removeEventListener('submit', addClick);
    addStudentModalElement.addEventListener('submit', addClick);
}
//查询事件
function SearchStudents() {
    let name = document.getElementById('searchName').value;
    let major = document.getElementById('searchMajor').value;
    if (!name && !major) {
        initAllStudents();
        return;
    }
    if (major) {
        SearchStudentsByNameAndMajor()
        return
    }
    axios.get(apihost + '/student/search?name=' + name)
        .then(function (response) {
            updateTable(response.data.data);
            showMessage('查询成功');
        })
        .catch(function (error) {
            showMessage('查询失败：'+error);
            console.error(error);
        });
}

/**
 * 更新学生点击事件
 */
const updateClick = (event) => {
    event.preventDefault();

    // 获取表单数据
    let studentId = document.getElementById('updateStudentId').value;
    let studentName = document.getElementById('updateStudentName').value;
    let studentMajor = document.getElementById('updateStudentMajor').value;
    let studentAge = document.getElementById('updateStudentAge').value;
    let studentGender = document.getElementById('updateStudentGender').value;
    let studentPhone = document.getElementById('updateStudentPhone').value;
    let studentEmail = document.getElementById('updateStudentEmail').value;

    axios.post(apihost + '/student/save', {
        id: studentId,
        name: studentName,
        major: studentMajor,
        age: studentAge,
        gender: studentGender,
        phone: studentPhone,
        email: studentEmail
    }).then(function (response) {
        //不刷新，直接更新表格
        let studentBody = document.getElementById('studentBody');
        let tr = studentBody.getElementsByTagName('tr');
        for (let i = 0; i < tr.length; i++) {
            let id = tr[i].getElementsByTagName('td')[0];
            if (id.innerText === studentId) {
                tr[i].getElementsByTagName('td')[1].innerText = studentName;
                tr[i].getElementsByTagName('td')[2].innerText = studentMajor;
                tr[i].getElementsByTagName('td')[3].innerText = studentAge;
                tr[i].getElementsByTagName('td')[4].innerText = studentGender;
                tr[i].getElementsByTagName('td')[5].innerText = studentPhone;
                tr[i].getElementsByTagName('td')[6].innerText = studentEmail;
                break;
            }
        }
        closeUpdateModal();
        showMessage('更新成功');

    }).catch(function (error) {
        showMessage('更新失败：'+error.response.data.msg);
        console.error(error);
    });
}
/**
 * 打开编辑学生模态框
 */
function initUpdateModal(event, student) {
    // 填充模态框表单，如果tr存在studentId相同的数据，则填充
    let studentBody = document.getElementById('studentBody');
    // console.log('stu:', studentBody)
    if (studentBody.getElementsByTagName('tr').length === 0) {
        // console.log('初始化填充')
        document.getElementById('updateStudentId').value = student.id;
        document.getElementById('updateStudentName').value = student.name;
        document.getElementById('updateStudentMajor').value = student.major;
        document.getElementById('updateStudentAge').value = student.age;
        document.getElementById('updateStudentGender').value = student.gender;
        document.getElementById('updateStudentPhone').value = student.phone;
        document.getElementById('updateStudentEmail').value = student.email;
    } else {
        // console.log('更新填充'); 
        let tr = studentBody.getElementsByTagName('tr');
        for (let i = 0; i < tr.length; i++) {
            let id = tr[i].getElementsByTagName('td')[0];
            if (id.innerHTML == student.id) {
                document.getElementById('updateStudentId').value = student.id;
                document.getElementById('updateStudentName').value = tr[i].getElementsByTagName('td')[1].innerText;
                document.getElementById('updateStudentMajor').value = tr[i].getElementsByTagName('td')[2].innerText;
                document.getElementById('updateStudentAge').value = tr[i].getElementsByTagName('td')[3].innerText;
                document.getElementById('updateStudentGender').value = tr[i].getElementsByTagName('td')[4].innerText;
                document.getElementById('updateStudentPhone').value = tr[i].getElementsByTagName('td')[5].innerText;
                document.getElementById('updateStudentEmail').value = tr[i].getElementsByTagName('td')[6].innerText;
                break;
            }
        }
    }
    const updateStudentModalElement = document.getElementById('updateStudentModal');

    updateStudentModalElement.removeEventListener('submit', updateClick);
    updateStudentModalElement.addEventListener('submit', updateClick);
}
/**
 * 更新学生列表
 */
function updateTable(data) {
    let studentBody = document.getElementById('studentBody');
    studentBody.innerHTML = ''; // 清空现有数据
    data.forEach(student => {
        let row = document.createElement('tr');
        row.className = 'text-center';
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.major}</td>
            <td>${student.age}</td>
            <td>${student.gender}</td>
            <td>${student.phone}</td>
            <td>${student.email}</td>
        `;
        row.style.cursor = 'pointer';
        // 添加点击事件监听器
        row.setAttribute('data-bs-target', '#updateStudentModal')
        row.setAttribute('data-bs-toggle', 'modal')
        row.addEventListener('click', (event) => initUpdateModal(event, student));
        studentBody.appendChild(row);
    });
}
/**
 * 删除学生
 */
function deleteStudent() {
    let id = document.getElementById('updateStudentId').value;
    axios.delete(apihost + '/student/delete/' + id)
        .then(res => {
            // initAllStudents();
            let studentBody = document.getElementById('studentBody');
            let tr = studentBody.getElementsByTagName('tr');
            for (let i = 0; i < tr.length; i++) {
                if (tr[i].getElementsByTagName('td')[0].innerText === id) {
                    studentBody.removeChild(tr[i]);
                    break;
                }
            }
            showMessage('删除成功');
            closeUpdateModal();
        })
        .catch(function (error) {
            showMessage('删除失败：'+error);
            console.error(error);
        });
}
function SearchStudentsByNameAndMajor() {
    let input, table, tr, i;
    let filterName, filterMajor;
    input = document.getElementById("searchName");
    filterName = input.value.toUpperCase();
    input = document.getElementById("searchMajor");
    filterMajor = input.value.toUpperCase();
    table = document.getElementById("studentsTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        let name = tr[i].getElementsByTagName("td")[1]; //根据名字筛选
        let major = tr[i].getElementsByTagName("td")[2]; //根据专业筛选
        if (name || major) {
            name = name.textContent || name.innerText;
            major = major.textContent || major.innerText;
            
            if (name.toUpperCase().indexOf(filterName) > -1 && major.toUpperCase().indexOf(filterMajor) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

//初始化所有学生
function initAllStudents(page = 1, size = 13) {
    axios.get(apihost + '/student/all?page=' + page + '&size=' + size)
        .then(function (response) {
            updateTable(response.data.data.content);
            updatePagination(response.data.data);
        })
        .catch(function (error) {
            showMessage('查询失败：'+error);
            console.error(error);
        });
}

/**
 * 更新分页器
 */
function updatePagination(data) {
    let pagination = document.getElementById('pagination');
    pagination.innerHTML = ''; // 清空分页器

    // 添加“前一页”按钮
    let prevLi = document.createElement('li');
    prevLi.className = 'page-item ' + (data.first ? 'disabled' : '');
    prevLi.innerHTML = `<a class="page-link" href="#" ${data.first ? '' : 'onclick="initAllStudents(' + (data.number) + ', ' + data.size + ')"'}><</a>`;
    pagination.appendChild(prevLi);

    // 生成分页按钮
    for (let i = 0; i < data.totalPages; i++) {
        let li = document.createElement('li');
        li.className = 'page-item ' + (data.number === i ? 'active' : '');
        li.innerHTML = `<a class="page-link" href="#" onclick="initAllStudents(${i + 1}, ${data.size})">${i + 1}</a>`;
        pagination.appendChild(li);
    }

    // 添加“后一页”按钮
    let nextLi = document.createElement('li');
    nextLi.className = 'page-item ' + (data.last ? 'disabled' : '');
    nextLi.innerHTML = `<a class="page-link" href="#" ${data.last ? '' : 'onclick="initAllStudents(' + (data.number + 2) + ', ' + data.size + ')"'}>></a>`;
    pagination.appendChild(nextLi);
}
function start() {
    initAllStudents();
}
start();