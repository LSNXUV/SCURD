


const apihost = 'http://localhost:8080';


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
        })
        .catch(function (error) {
            console.error(error);
        });
}

function initAddModal() {
    const addStudentModalElement = document.getElementById('addStudentModal');

    addStudentModalElement.removeEventListener('submit', addClick);
    addStudentModalElement.addEventListener('submit', addClick);
}


function SearchStudents() {
    let name = document.getElementById('searchName').value;
    let major = document.getElementById('searchMajor').value;
    if (!name && !major) {
        initAllStudents();
        return;
    }
    if(major){
        SearchStudentsByNameAndMajor()
        return
    }
    axios.get(apihost + '/student/search?name=' + name)
        .then(function (response) {
            updateTable(response.data.data);
        })
        .catch(function (error) {
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
        initAllStudents();
    }).catch(function (error) {
        console.error(error);
    });
}

/**
 * 打开编辑学生模态框
 */
function initUpdateModal(student) {
    // 填充模态框表单
    document.getElementById('updateStudentId').value = student.id;
    document.getElementById('updateStudentName').value = student.name;
    document.getElementById('updateStudentMajor').value = student.major;
    document.getElementById('updateStudentAge').value = student.age;
    document.getElementById('updateStudentGender').value = student.gender;
    document.getElementById('updateStudentPhone').value = student.phone;
    document.getElementById('updateStudentEmail').value = student.email;

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
        .then(function (response) {
            initAllStudents();
        })
        .catch(function (error) {
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

function initAllStudents() {
    axios.get(apihost + '/student/all')
        .then(function (response) {
            updateTable(response.data.data);
        })
        .catch(function (error) {
            console.error(error);
        });
}

function start() {
    initAllStudents();
}

start();