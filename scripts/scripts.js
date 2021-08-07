init();

function init(){
	
	getDataFromServer();
	const name = askName();
	setUserName(name);
}

function getDataFromServer(){
	loadMessages();
	setTimeout(getDataFromServer, 3000);
}

function loadMessages(){
	let promise = getMsgs();
	promise.then(showMessages);
}

function getMsgs(){
	const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages");
	console.log(promise)
	return promise;
}

function showMessages(resp){
	const chat = document.querySelector(".chat-container");
	const msgs = resp.data;

	chat.innerHTML = "";
	for (let i = 0; i < msgs.length; i++) {

		if(msgs[i].type === "status") {
			chat.innerHTML += 
			`<div class="${msgs[i].type}">
				<div class="time">
					(${msgs[i].time})
				</div>
				<div class="from-to">
					<span class="user-name">${msgs[i].from}</span>
				</div>
				<div class="text">
					${msgs[i].text}
				</div>
			</div>`;
		}
		else if (msgs[i].type === "private_message") {
			if (msgs[i].to === localStorage.getItem("username")){
				chat.innerHTML += 
				`<div class="${msgs[i].type}">
					<div class="time">
						(${msgs[i].time})
					</div>
					<div class="from-to">
						<span class="user-name">${msgs[i].from}</span> para <span class="user-name">${msgs[i].to}</span>:
					</div>
					<div class="text">
						${msgs[i].text}
					</div>
				</div>`;
			}
		}		
		else {
			chat.innerHTML += 
			`<div class="${msgs[i].type}">
				<div class="time">
					(${msgs[i].time})
				</div>
				<div class="from-to">
					<span class="user-name">${msgs[i].from}</span> para <span class="user-name">${msgs[i].to}</span>:
				</div>
				<div class="text">
					${msgs[i].text}
				</div>
			</div>`;
		}
	}

	const lastMsg = chat.lastChild;
	lastMsg.scrollIntoView();
}

function askName(){
	let user = {
		name: prompt("Qual o seu nome?")
	}
	if(!user.name){
		console.log("ops")
		askName();
	}
	return user;
}

function setUserName(name){	
	
	const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants", name);

	promise.then(IfUsernameOK(name));
	promise.catch(ifUsernameError);	
}

function IfUsernameOK(username) {
	localStorage.setItem("username", username.name);
	setInterval(keepConected, 5000, username);
}

function keepConected(username){
	console.log("estou online")
	const keepConexion = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status", username);

}

function nameInUse(){
	let user = {
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

function getParticipants(){
	const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants");
	console.log(promise);
	return promise;
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

	console.log(msg);

	const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages", msg);
	promise.then(updateChat);
	promise.catch(sendMsgError);
}

function updateChat(){
	const promise = getMsgs();
	promise.then(showMessages);
}

function sendMsgError(){
	window.location.reload();
}

function showMenu(){
	const menu = document.querySelector("menu");
	menu.classList.remove("hidden");
}

function hideMenu(menuBg){
	menuBg.parentNode.classList.add("hidden");
}

