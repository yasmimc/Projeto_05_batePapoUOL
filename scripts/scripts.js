function updateChat(){
	const promise = getMsgs();
	promise.then(showMessages);
}

function sendMsgError(){
	window.location.reload();
}

function sendMsg(){
	let input =  document.querySelector("input");
	let msgText = input.value;
	input.value = null;

	const msg =
	{
		from: localStorage.getItem("username"),
		to: "Todos",
		text: msgText,
		type: "message" 
	}

	const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages", msg);
	promise.then(updateChat);
	promise.catch(sendMsgError);
}

function insertStatusMsg(chat, msg){
	chat.innerHTML += 
		`<div class="${msg.type}">
			<div class="time">
				(${msg.time})
			</div>
			<div class="from-to">
				<span class="user-name">${msg.from}</span>
			</div>
			<div class="text">
				${msg.text}
			</div>
		</div>`;
}

function insertPrivateMsg(chat, msg){
	chat.innerHTML += 
		`<div class="${msg.type}">
			<div class="time">
				(${msg.time})
			</div>
			<div class="from-to">
				<span class="user-name">${msg.from}</span> para <span class="user-name">${msg.to}</span>:
			</div>
			<div class="text">
				${msg.text}
			</div>
		</div>`;		
}

function insertPublicMsg(chat, msg){
	chat.innerHTML += 
			`<div class="${msg.type}">
				<div class="time">
					(${msg.time})
				</div>
				<div class="from-to">
					<span class="user-name">${msg.from}</span> para <span class="user-name">${msg.to}</span>:
				</div>
				<div class="text">
					${msg.text}
				</div>
			</div>`;
}

function showMessages(resp){
	const chat = document.querySelector(".chat-container");
	const msgs = resp.data;
	let isStatus, isPrivateMsg, isPublicMsg;
	let isToLoggedUser;

	chat.innerHTML = "";
	for (let i = 0; i < msgs.length; i++) {
		isStatus = msgs[i].type === "status";
		isPrivateMsg = msgs[i].type === "private_message";
		isPublicMsg = msgs[i].type === "message";
		isToLoggedUser = msgs[i].to === localStorage.getItem("username");

		if(isStatus) {
			insertStatusMsg(chat, msgs[i]);
		}
		if (isPrivateMsg && isToLoggedUser) {			
			insertPrivateMsg(chat, msgs[i]);	
		}		
		if(isPublicMsg) {
			insertPublicMsg(chat, msgs[i]);			
		}
	}

	const lastMsg = chat.lastChild;
	lastMsg.scrollIntoView();
}

function getMsgs(){
	const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages");
	return promise;
}

function loadMessages(){
	let promise = getMsgs();
	promise.then(showMessages);
}

function getMsgsFromServer(){
	loadMessages();
	setTimeout(getMsgsFromServer, 3000);	
}

function askName(){
	const user = {
		name: prompt("Qual o seu nome?")
	}
	if(!user.name){
		askName();
	}
	return user;
}

function nameInUse(){
	const user = {
		name: prompt("Este nome já está em uso. Digite outro, por favor.")
	}
	if(!user.name){
		askName();
	}
	return user;
}

function ifUsernameError(error){
	const errorStatusCode = error.response.status;
	if(errorStatusCode === 400) {
		const newName = nameInUse();
		setUserName(newName);
	}
}

function keepConected(username){
	const keepConexion = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status", username);

}

function IfUsernameOK(username) {
	localStorage.setItem("username", username.name);
	setInterval(keepConected, 5000, username);
}

function setUserName(name){		
	const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants", name);
	promise.then(IfUsernameOK(name));
	promise.catch(ifUsernameError);	
}

function init(){	
	getMsgsFromServer();
	setInterval(getParticipants, 10000);
	const name = askName();
	setUserName(name);
}

init();


// BONUS FUNCTIONS
function getParticipants(){
	const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants");
	return promise;
}

function insertParticipants(resp){
	const participantsList = resp.data;
	const participants = document.querySelector(".participants");	

	participants.innerHTML = 
	`<h1>Escolha um contato para enviar mensagem:</h1>
	<div class="option">
		<ion-icon name="people"></ion-icon>
		Todos
	</div>`;

	for (let i = 0; i < participantsList.length; i++) {
		let isNotTodos = participantsList[i].name !== "Todos";

		if(isNotTodos){
			participants.innerHTML += 
			`<div class="option">
				<ion-icon name="person-circle"></ion-icon>
				${participantsList[i].name}
			</div>`
		}		
	}
}

function showMenu(){
	const menu = document.querySelector("menu");
	
	
	const promise = getParticipants();
	promise.then(insertParticipants);

	
	menu.classList.remove("hidden");
}

function hideMenu(menuBg){
	menuBg.parentNode.classList.add("hidden");
}

