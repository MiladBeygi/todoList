let myDbArray;
let editId;
let deleteId;
const homePage = document.querySelector(".home-page");
const editpage = document.querySelector(".edit-page");
const successfulMessage = document.querySelector(".successful-message");
const pageNumbersSection = document.querySelector(".page-numbers");
const pagesSection = document.querySelector(".pages-section");
const todoSecction = document.querySelector(".todo-section");
const deleteModal = document.querySelector(".delete-modal");
const homeButton = document.getElementById("home-but");
const todosButton = document.getElementById("todos-but");
const titleHomePage = document.getElementById("title");
const titleEditPage = document.getElementById("title-edit");
const descHomePage = document.getElementById("description");
const descEditPage = document.getElementById("description-edit");
const timeHomePage = document.getElementById("date");
const timeEditPage = document.getElementById("date-edit");
const submitButton = document.querySelector(".sumbit-button");
const saveButton = document.querySelector(".sumbit-button-edit");
const todoPerPageSelectEl = document.getElementById("todoPerPage");
let currentPage = 1;
let pageNumbers;
let todosPerPage = 4;

todoPerPageSelectEl.addEventListener("change", () => {
    todosPerPage = todoPerPageSelectEl.value;
    if (todosPerPage >= 8) {
        document.body.style.height = 'fit-content';
    } else {
        document.body.style.height = '100vh';
    }
    editpage.classList.add("hidden");
    homePage.classList.add("hidden");
    todoSecction.classList.remove("hidden");
    pagesSection.style.display = "flex";
    render();
})

homeButton.addEventListener("click", () => {
    editpage.classList.add("hidden");
    homePage.classList.remove("hidden");
    todoSecction.classList.add("hidden");
    pagesSection.style.display = "none";
})
todosButton.addEventListener("click", () => {
    editpage.classList.add("hidden");
    homePage.classList.add("hidden");
    todoSecction.classList.remove("hidden");
    pagesSection.style.display = "flex";
    render();
})

class Todo {
    constructor(title, description, time, checked) {
        this.title = title,
            this.description = description,
            this.createdAt = time,
            this.updatedAt = this.createdAt,
            this.checked = checked
    }
}
// fetch("https://60b77f8f17d1dc0017b8a2c4.mockapi.io").then((res) => res.json()).then((resp) => console.log(resp))
submitButton.addEventListener("click", () => {
    if ((timeHomePage.value !== "") && (titleHomePage.value !== "")) {
        titleHomePage.style.border = "2px solid black";
        timeHomePage.style.border = "2px solid black";
        const myTime = (new Date(timeHomePage.value)).getTime();
        const myTodo = new Todo(titleHomePage.value, descHomePage.value, myTime, false);
        // console.log(myTodo)
        fetch('https://63d1472b3f08e4a8ff94706a.mockapi.io/data', {
            method: 'POST',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(myTodo)
        }).then(res => res.json())
            .then(resp => {
                successfulMessage.classList.remove("hidden");
                successfulMessage.style.opacity = "1";
                timeHomePage.value = "";
                titleHomePage.value = "";
                descHomePage.value = "";

                // homePage.classList.add("hidden");
                // todoSecction.classList.remove("hidden");
                // console.log(resp);
                // pagesSection.style.display = "flex";
                render();
            })
            .catch((err) => alert(`failed to post todo data ${err}`))
        // console.log(myTime)
    } else if ((timeHomePage.value === "") && (titleHomePage.value !== "")) {
        timeHomePage.style.border = "2px solid red";
    } else if ((timeHomePage.value !== "") && (titleHomePage.value === "")) {
        titleHomePage.style.border = "2px solid red";
    } else {
        titleHomePage.style.border = "2px solid red";
        timeHomePage.style.border = "2px solid red";
    }
})






///// RENDER
function render() {

    fetch('https://63d1472b3f08e4a8ff94706a.mockapi.io/data').then(res => res.json())
        .then((resp) => {
            pageNumbersSection.textContent = "";
            pageNumbers = Math.ceil(resp.length / todosPerPage);
            for (let i = 0; i < pageNumbers; i++) {
                const myButton = document.createElement('button');
                myButton.textContent = `${i + 1}`;
                myButton.classList.add("page-num");
                myButton.addEventListener("click", pageButtonsFunc);
                pageNumbersSection.append(myButton);
                if (i + 1 === Number(currentPage)) {
                    myButton.style.backgroundColor = "cyan";
                } else {
                    myButton.style.backgroundColor = "inherit";
                }
            }
            todoSecction.innerHTML = "";
            resp.sort((a, b) => b.updatedAt - a.updatedAt)
            // console.log(resp)
            myDbArray = resp;
            resp.forEach((element, index) => {
                let todoStr = "";
                console.log(element.updatedAt)
                const myDate = new Date(element.updatedAt);
                const todos = document.createElement('div');
                todos.classList.add("todos");
                if (((Math.floor(index / todosPerPage)) + 1) === Number(currentPage)) {
                    todos.classList.remove("hidden");
                    todoStr = ` <div class="row space-between">
                        <div class="row">
                            <div class="checkbox" ><input type="checkbox" onclick="checkedFunc('${element.id}')" ${element.checked ? "checked" : ""}></div>
                            <div>
                                <h2 class="todo-title">${element.title}</h2>
                            </div>
                            <div class="todo-time">${String(myDate.getDate()).padStart(2, "0")}/${String(myDate.getMonth() + 1).padStart(2, "0")}/${String(myDate.getFullYear())}</div>
                        </div>
        
                        <div class="todo-buttons row">
                            <div><i class="fa fa-trash" onclick="trashFunc('${element.id}')"></i></div>
                            <div><i class="fa fa-pencil" onclick="editFunc('${element.id}')"></i></div>
                        </div>
                    </div>
                    <div class="todo-desc">
                        ${element.description}
                    </div>`;
                    todos.innerHTML += todoStr;
                    todoSecction.append(todos);
                } else {
                    todos.classList.add("hidden");
                    todoStr = ` <div class="row space-between">
                        <div class="row">
                            <div class="checkbox"><input type="checkbox" onclick="checkedFunc('${element.id}')" ${element.checked ? "checked" : ""}></div>
                            <div>
                                <h2 class="todo-title">${element.title}</h2>
                            </div>
                            <div class="todo-time">${String(myDate.getDate()).padStart(2, "0")}/${String(myDate.getMonth()).padStart(2, "0")}/${String(myDate.getFullYear())}</div>
                        </div>
        
                        <div class="todo-buttons row">
                            <div><i class="fa fa-trash" onclick="trashFunc('${element.id}')"></i></div>
                            <div><i class="fa fa-pencil" onclick="editFunc('${element.id}')"></i></div>
                        </div>
                    </div>
                    <div class="todo-desc">
                        ${element.description}
                    </div>`;
                    todos.innerHTML += todoStr;
                    todoSecction.append(todos);
                }
            });
            // console.log(resp);

        })
}
function pageButtonsFunc(event) {
    console.log(event.target.textContent);
    currentPage = event.target.textContent;
    if (Number(currentPage) === 1) {
        document.querySelector(".left").disabled = true;
        document.querySelector(".left").style.color = "darkgray";
    } else {
        document.querySelector(".left").disabled = false;
        document.querySelector(".left").style.color = "black";
    }
    if (Number(currentPage) === pageNumbers) {
        document.querySelector(".right").disabled = true;
        document.querySelector(".right").style.color = "darkgray";
    } else {
        document.querySelector(".right").disabled = false;
        document.querySelector(".right").style.color = "black";
    }
    render();

}
function prevPageFunc(e) {
    if (Number(currentPage) === 1) {
        e.target.disabled = true;
        e.target.style.color = "darkgray";
        return;
    } else {
        currentPage--;
        document.querySelector(".right").disabled = false;
        document.querySelector(".right").style.color = "black";
        if (Number(currentPage) === 1) {
            e.target.disabled = true;
            e.target.style.color = "darkgray";
        }
        render();
    }
}
function nextPageFunc(e) {
    if (Number(currentPage) === pageNumbers) {
        e.target.disabled = true;
        e.target.style.color = "darkgray";
        return;
    } else {

        currentPage++;
        document.querySelector(".left").disabled = false;
        document.querySelector(".left").style.color = "black";
        if (Number(currentPage) === pageNumbers) {
            e.target.style.color = "darkgray";
            e.target.disabled = true;
        }
        render();
    }
}
function checkedFunc(myId) {
    console.log(myId)
    console.log(myDbArray);
    let newObj;
    for (let j = 0; j < myDbArray.length; j++) {
        if (myDbArray[j].id == myId) {
            newObj = myDbArray[j];
        }
    }
    console.log(newObj);
    newObj.checked = !newObj.checked;
    console.log(newObj);
    fetch(`https://63d1472b3f08e4a8ff94706a.mockapi.io/data/${myId}`, {
        method: 'PUT',
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(newObj)
    })
}


//handling trash button to delete a todo 
function trashFunc(myId) {
    deleteId = myId;
    todoSecction.classList.add("blur");
    pagesSection.classList.add("blur");
    let newObj;
    for (let j = 0; j < myDbArray.length; j++) {
        if (myDbArray[j].id == myId) {
            newObj = myDbArray[j];
        }
    }
    deleteModal.innerHTML = `<h2><i class="fa fa-exclamation-triangle"></i> Delete </h2>
    <hr>
    <h2>Do you want to Delete this item?</h2>
    <div class="row delete-infos-modal">
        <h3 class="delete-title-modal">${newObj.title}</h3>
        <p class="delete-time-moadal">${String((new Date(newObj.updatedAt)).getDate()).padStart(2, "0")}/${String((new Date(newObj.updatedAt)).getMonth()).padStart(2, "0")}/${String((new Date(newObj.updatedAt)).getFullYear())}</p>
    </div>
    <hr>
    <div class="row delete-modal-buttons">
        <button onclick="deleteTodo(event)">Delete</button>
        <button onclick="cancelDelete(event)">Cancel</button>
    </div>`
    deleteModal.classList.remove("hidden");
}

//Handling buttons of delete modal
function deleteTodo(e) {
    fetch(`https://63d1472b3f08e4a8ff94706a.mockapi.io/data/${deleteId}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    }).then((res) => res.json())
        .then((resp) => {
            deleteModal.classList.add("hidden");
            todoSecction.classList.remove("blur");
            pagesSection.classList.remove("blur");
            render();
        })
}
function cancelDelete(e) {
    deleteModal.classList.add("hidden");
    todoSecction.classList.remove("blur");
    pagesSection.classList.remove("blur");
}

///handling edit button
function editFunc(myId) {
    editId = myId;
    todoSecction.classList.add("hidden");
    pagesSection.style.display = "none";
    editpage.classList.remove("hidden");
    let newObj;
    for (let j = 0; j < myDbArray.length; j++) {
        if (myDbArray[j].id == myId) {
            newObj = myDbArray[j];
        }
    }
    titleEditPage.value = newObj.title;
    descEditPage.value = newObj.description;
    timeEditPage.value = newObj.updatedAt;
}

//handling save button on edit page related to upper part (edit button)
saveButton.addEventListener("click", () => {
    let newObj;
    for (let j = 0; j < myDbArray.length; j++) {
        if (myDbArray[j].id == editId) {
            newObj = myDbArray[j];
        }
    }
    newObj.title = titleEditPage.value;
    newObj.description = descEditPage.value;
    newObj.updatedAt = (new Date(timeEditPage.value));
    fetch(`https://63d1472b3f08e4a8ff94706a.mockapi.io/data/${editId}`, {
        method: 'PUT',
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(newObj)
    }).then((res) => res.json())
        .then((resp) => {
            todoSecction.classList.remove("hidden");
            pagesSection.style.display = "flex";
            editpage.classList.add("hidden");
            render();
        })
})

//handling successful Message closing button
function closeSuccessfulMessage(event) {
    successfulMessage.style.opacity = "0";
    setTimeout(() => {
        successfulMessage.classList.add("hidden");
    }, 2000)
}
