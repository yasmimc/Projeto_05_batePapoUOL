function addReceiverAndType(){
	const textMsg = document.querySelector(".text-msg").querySelector("p");

	const receiver = localStorage.getItem("receiver");
	if(receiver){
		textMsg.innerHTML = `<p>Enviando para ${receiver}</p>`;
	}

	const type = localStorage.getItem("type");
	if(type === "private_message"){
		textMsg.innerHTML = `<p>Enviando para ${receiver} (reservadamente)</p>`;
	}
	else{
		textMsg.innerHTML = `<p>Enviando para ${receiver}</p>`;
	}

	if(receiver === "Todos"){
		textMsg.innerHTML = "";
	}	
}

function disablePrivateMsg(){
	const private = document.querySelector(".private");
	private.classList.remove("selected");
	private.querySelector(".check").classList.add("hidden");
	const public = document.querySelector(".public");
	public.classList.add("selected");
	public.querySelector(".check").classList.remove("hidden");
}

function selectOption(clickedOption){	
	const selectedOption = clickedOption.parentNode.querySelector(".selected");
	
	if(selectedOption){
		selectedOption.classList.remove("selected");
		const selectedOptionCheck = selectedOption.querySelector(".check");
		selectedOptionCheck.classList.add("hidden");
	}

	clickedOption.classList.add("selected");
	const check = clickedOption.querySelector(".check");
	check.classList.remove("hidden");

	const option = clickedOption.querySelector("p");

	const optionType = option.parentNode.parentNode.getAttribute("class");
	if(optionType === "participants"){
		localStorage.setItem("receiver", option.innerHTML);
	}
	if(optionType === "visibility"){

		if(option.innerHTML === "Reservadamente"){
			localStorage.setItem("type", "private_message");
		}	
		else {
			localStorage.setItem("type", "message");
		}
	}
	
	if(localStorage.getItem("receiver")==="Todos"){
		localStorage.setItem("type", "message");
		disablePrivateMsg();
	}
	addReceiverAndType();
}

function getParticipants(){
	const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants");
	return promise;
}

function insertParticipants(resp){
	const participantsList = resp.data;
	const participants = document.querySelector(".participants");	

	participants.innerHTML = 
	`<h1>Escolha um contato para enviar mensagem:</h1>
	<div class="option selected" onclick="selectOption(this);">
		<ion-icon name="people"></ion-icon>
		<p>Todos</p>
		<ion-icon class="check" name="checkmark-outline"></ion-icon>
	</div>`;

	for (let i = 0; i < participantsList.length; i++) {
		let isNotTodos = participantsList[i].name !== "Todos";

		if(isNotTodos){
			participants.innerHTML += 
			`<div class="option" onclick="selectOption(this);">
				<ion-icon name="person-circle"></ion-icon>
				<p>${participantsList[i].name}</p>
				<ion-icon class="hidden check" name="checkmark-outline"></ion-icon>
			</div>`;
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

function updateChat(){
	const promise = getMsgs();
	promise.then(showMessages);
}

function sendMsgError(){
	window.location.reload();
}

function sendMsg(){
	let input =  document.querySelector(".text-msg input");
	let msgText = input.value;
	input.value = null;

	const msg =
	{
		from: localStorage.getItem("username"),
		to: localStorage.getItem("receiver"),
		text: msgText,
		type: localStorage.getItem("type") 
	}

	const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages", msg);
	promise.then(updateChat);
	promise.catch(sendMsgError);
}

function insertStatusMsg(chat, msg){
	chat.innerHTML += 
		`<div class="${msg.type}">
			<div class="time">
				<p>(${msg.time})</p>
			</div>
			<div class="text">
				<p><span class="user-name">${msg.from}</span>: ${msg.text}</p>
			</div>
		</div>`;
}

function insertPrivateMsg(chat, msg){
	chat.innerHTML += 
		`<div class="${msg.type}">
			<div class="time">
				<p>(${msg.time})</p>
			</div>
			<div class="text">
				<p><span class="user-name">${msg.from}</span> para <span class="user-name">${msg.to}</span>: ${msg.text}</p>
			</div>
		</div>`;		
}

function insertPublicMsg(chat, msg){
	chat.innerHTML += 
			`<div class="${msg.type}">
				<div class="time">
					<p>(${msg.time})</p>
				</div>
				<div class="text">
					<p><span class="user-name">${msg.from}</span> para <span class="user-name">${msg.to}</span>: ${msg.text}</p>
				</div>
			</div>`;
}

function showMessages(resp){
	const chat = document.querySelector(".chat-container");
	const msgs = resp.data;
	let isStatus, isPrivateMsg, isPublicMsg;
	let isToOrFromLoggedUser;

	chat.innerHTML = "";
	for (let i = 0; i < msgs.length; i++) {
		isStatus = msgs[i].type === "status";
		isPrivateMsg = msgs[i].type === "private_message";
		isPublicMsg = msgs[i].type === "message";
		isToOrFromLoggedUser = msgs[i].to === localStorage.getItem("username") || msgs[i].from === localStorage.getItem("username");

		if(isStatus) {
			insertStatusMsg(chat, msgs[i]);
		}
		if (isPrivateMsg && isToOrFromLoggedUser) {			
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

function ifUsernameError(error){
	const errorStatusCode = error.response.status;
	if(errorStatusCode === 400) {
		const loginScreen = document.querySelector(".login-screen");
		loginScreen.innerHTML += 
		`<p>Este nome já está em uso ou é inválido. </p>
		<p>Por favor, entre com outro nome.</p>`;
	}
}

function keepConected(username){
	axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status", username);
}

function IfUsernameOK(promiseResult, username) {
	if(promiseResult.status === 200) {
		localStorage.setItem("username", username.name);
		setInterval(keepConected, 5000, username);
		const loginScreen = document.querySelector(".login-screen");
		loginScreen.classList.add("hidden");
	}	
}

function setUsername(name){	
	const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants", name);
	promise.then(promiseResult => IfUsernameOK(promiseResult, name));
	promise.catch(ifUsernameError);	
}

function login(){
	const name = {
		name:  document.querySelector(".login-screen input").value
	}
	setUsername(name);
}

function enableEnterToLoginIn(){
	document.querySelector(".login-screen input")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
		if (event.key === "Enter") {
			login();
		}
	});
}

function enableEnterToSendMsg(){
	document.querySelector(".text-msg input")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
		if (event.key === "Enter") {
			document.querySelector(".sendBtn").click();
		}
	});
}

function onLoad(){	
	getMsgsFromServer();
	setInterval(getParticipants, 10000);
	
	localStorage.setItem("receiver", "Todos");
	localStorage.setItem("type", "message");
	enableEnterToSendMsg();
	enableEnterToLoginIn();
}

onLoad();