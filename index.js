// We have to get the dynamic values for the card section from multiple users. 
// To store the inputs from users we use array of objects.

var state ={
   taskList : []   //To store the dynamic inputs from local storage
};

// DOM manipulation => To access and modify contents of HTML.

var taskContents =document.querySelector(".task__content");
var taskModal = document.querySelector( ".task__modal");

// console.log(taskContents);

// To write the dyanamic contents of Html.
// Card Contents

const htmlTaskContent =( { id,url,title,type,description}) =>
` <div class="col-md-6 col-lg-4 mt-3" id=${id}>
   <div class="card" style="width: 18rem;">
      <div class="card-header d-flex justify-content-end gap-2">
         <button type="button" class="btn btn-outline-primary" onclick="editTaskButton()" id=${id}>
            <i class="fa-solid fa-pencil" id=${id}></i>
         </button>
         <button type="button" class="btn btn-outline-danger" onclick="deleteTaskButton()" id=${id}>
            <i class="fa-solid fa-trash" id=${id}></i>
         </button>
      </div> 
      <div class="card-body">
         <img src="${url}" class="card-img-top" alt="card image">
         <h5 class="card-title">${title}</h5>
         <p class="card-text trim-3-lines">${description}</p>
         <div class='taskType text-white d-flex flex-wrap'>
            <span class='badge text-bg-primary'>${type}</span>
         </div>
      </div>
      <div class='card-footer'>
         <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#showTask" onclick="openTaskButton()" id= ${id}>
           Open Task
         </button>
      </div>
   </div>
</div>`;

// Modal contents after clicking the Open task button
const htmlTaskModal =( { id,url,title,description}) => {
   var date= new Date(parseInt(id));
   return `
   <div id=${id}>
      <img src="${url}" class="img-fluid" alt="card image">
      <strong class='text-muted'>Created on : ${date.toDateString()}</strong>
      <h4 class=''>${title}</h4>
      <p class='text-muted'>${description}</p>
   </div>
   `
};

// Converting Json into strings to store in local storage of browswer.
const updateLocalStorage = () => {
   localStorage.setItem(
      "task" , JSON.stringify({
         tasks: state.taskList,
      })
   );
};

// converting string => Json to load the output in JSON format.
const loadInitialItem =() => {
   const localStoragecopy = JSON.parse(localStorage.task);
   if(localStoragecopy) state.taskList = localStoragecopy.tasks;

   state.taskList.map((cardDate) => {
      taskContents.insertAdjacentHTML("beforeend" , htmlTaskContent(cardDate));
   });
};

// 
const saveChangesButton = (event) => {
   const id = `${Date.now()}`;
   const input ={
      url : document.getElementById("imageUrl").value,
      title : document.getElementById("taskTitle").value,
      type : document.getElementById("taskType").value,
      description : document.getElementById("taskDescription").value
   };

   if(input.title === '' || input.description=== '' || input.type===''){
      return alert("Please fill out the all the necessary fileds!");
  };
  
   taskContents.insertAdjacentHTML("beforeend" , htmlTaskContent({...input,id}));
   state.taskList.push({ ...input,id} );
   updateLocalStorage();
}

const openTaskButton = (e) =>{
   if (!e) e=window.event;

   const getTask = state.taskList.find(({id}) => id === e.target.id);   //Finding the selected ID to open the task
    taskModal.innerHTML = htmlTaskModal(getTask);
   //  taskModal.insertAdjacentHTML("beforeend" ,htmlTaskModal(getTask));
};

const deleteTaskButton =(e) => {
   if(!e) e=window.event;                             // Mandatory event 

   const targetId = e.target.getAttribute("id");    // To find the Selected Id.
   const type = e.target.tagName;     
   console.log(type); 
   const removeTask = state.taskList.filter(({id}) => id !== targetId);      //All id's except the selected id will store in remove task

   
   state.taskList = removeTask;    //Except selected id all are put into our array.
   
   updateLocalStorage();

   if (type=== "BUTTON") {
      return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
         e.target.parentNode.parentNode.parentNode
      );
   } else {
      return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
         e.target.parentNode.parentNode.parentNode.parentNode
      )
   }

};

const editTaskButton = (e) => {
   if(!e) e= window.event;
   const targetId = e.target.id;
   const type = e.target.tagName;

   let parentNode;
   let taskTitle;
   let taskDescription;
   let taskType;
   let submitButton;

   if(type === "BUTTON") {
      parentNode = e.target.parentNode.parentNode;
   }
   else{
      parentNode = e.target.parentNode.parentNode.parentNode;
   }

   taskTitle = parentNode.childNodes[3].childNodes[3];
   taskDescription = parentNode.childNodes[3].childNodes[5];
   taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
   submitButton = parentNode.childNodes[5].childNodes[1];
   // console.log(submitButton);
   // console.log(taskTitle);
   // console.log(taskType);
   // taskTitle = parentNode.childNodes;
   // console.log(taskTitle);
   //console.log(taskTitle , taskDescription, taskType, submitButton);

   taskTitle.setAttribute("contenteditable" , "true");
   taskDescription.setAttribute("contenteditable" , "true");
   taskType.setAttribute("contenteditable" , "true");
   submitButton.setAttribute("onclick" ,"saveEdit()");

   submitButton.removeAttribute("data-bs-toggle");
   submitButton.removeAttribute("data-bs-target");

   submitButton.innerHTML = "Save Changes";  // innerHTML => to change(replace) the contents of html with another html.

}

const saveEdit =(e) => {
   if(!e) e = window.event;

   const targetId = e.target.id;

   const parentNode = e.target.parentNode.parentNode;

   const taskTitle= parentNode.childNodes[3].childNodes[3];
   const taskDescription=  parentNode.childNodes[3].childNodes[5];
   const taskType =  parentNode.childNodes[3].childNodes[7].childNodes[1];
   const submitButton = parentNode.childNodes[5].childNodes[1];

   const updateData ={
      taskTitle : taskTitle.innerHTML,
      taskDescription : taskDescription.innerHTML,
      taskType : taskType.innerHTML
   }

   let stateCopy = state.taskList;

   stateCopy = stateCopy.map ((task) => 
   task.id ===targetId ?{           
      id: task.id,
      url :task.url,
      title : updateData.taskTitle,
      description : updateData.taskDescription,
      type: updateData.taskType
   }
   : task
   )
   state.taskList =stateCopy;
   updateLocalStorage();
   taskTitle.setAttribute("contenteditable" , "false");
   taskDescription.setAttribute("contenteditable" , "false");
   taskType.setAttribute("contenteditable" , "false");
   submitButton.setAttribute("onclick" ,"openTaskButton()");

   
   submitButton.setAttribute("data-bs-toggle","modal");
   submitButton.setAttribute("data-bs-target" , "#showTask");

   submitButton.innerHTML = "Open Task";

}

const searchTask =(e) => {
   if(!e) e = window.event;

   while (taskContents.firstChild) {
      taskContents.removeChild(taskContents.firstChild);
   }

   var searchData = state.taskList.filter(({title}) => 
      title.toLowerCase().includes(e.target.value.toLowerCase())
   );

    console.log(searchData);

   searchData.map((cardData) => {
      taskContents.insertAdjacentHTML("beforeend" , htmlTaskContent(cardData));
   })
}
