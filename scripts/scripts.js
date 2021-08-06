function init(){
	let promise = getPromise();
	promise.then(loadMessages);

	setTimeout(init, 3000);
}

function getPromise(){
	const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages");
	console.log(promise);
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
}

init();


function showMenu(){
	const menu = document.querySelector("menu");
	menu.classList.remove("hidden");
}

function hideMenu(menuBg){
	menuBg.parentNode.classList.add("hidden");
}