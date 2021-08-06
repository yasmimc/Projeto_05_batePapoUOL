init();

function init(){
	
	getDataFromServer();
	const name = askName();
	setUserName(name);
}

function getDataFromServer(){
	let promise = getMsgs();
	promise.then(loadMessages);
	setTimeout(getDataFromServer, 3000);
}

function getMsgs(){
	const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages");
	return promise;
}

function loadMessages(resp){
	const chat = document.querySelector(".chat-container");

	chat.innerHTML = "";
	for (let i = 0; i < resp.data.length; i++) {
		
		chat.innerHTML += 
		`<div class="${resp.data[i].type}">
			<div class="time">
				(${resp.data[i].time})
			</div>
			<div class="from-to">
				<span class="user-name">${resp.data[i].from}</span> para <span class="user-name">${resp.data[i].to}</span>:
			</div>
			<div class="text">
				${resp.data[0].text}
			</div>
		</div>`;
	}

	const lastMsg = chat.lastChild;
	lastMsg.scrollIntoView();
}

function askName(){
	let name = {
		name: prompt("Qual o seu nome?")
	}
	return name;
}

function setUserName(name){	
	
	const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants", name);

	promise.then(ifSucess(name));
	promise.catch(identifyError);	
}

function ifSucess(username) {
	setInterval(keepConected, 5000, username);
}

function keepConected(username){
	console.log("estou online")
	axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status", username);
}

function nameInUse(){
	let name = {
		name: prompt("Este nome já está em uso. Digite outro, por favor.")
	}
	return name;
}

function identifyError(error){
	const errorStatusCode = error.response.status;
	if(errorStatusCode === 400) {
		const newName = nameInUse();
		setUserName(newName);
	}
}

function getParticipants(){
	const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants");
	console.log(promise);
	return promise;
}

function showMenu(){
	const menu = document.querySelector("menu");
	menu.classList.remove("hidden");
}

function hideMenu(menuBg){
	menuBg.parentNode.classList.add("hidden");
}

