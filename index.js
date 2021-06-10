const tmi = require("tmi.js")
const chess = require("chess")

const user = "hhhhhhhhhn"

const client = new tmi.Client({
	options: { debug: true },
	connection: {
		secure: true,
		reconnect: true
	},
	identity: {
		username: user,
		password: process.env.TWITCH_OAUTH
	},
	channels: [user]
});

client.connect()

var game

function newGame () {
	game = chess.create()
}
newGame()

function draw() {
	board = ""
	for (let square of game.getStatus().board.squares) {
		board += drawSquare(square) + " "
	}
	console.clear()
	process.stdout.write(board.match(/.{1,16}/g).join("\n") + "Mueve con !")
}

function drawSquare(square) {
	if (!square.piece) {
		return " "
	}
	switch(square.piece.type) {
		case "pawn":
			if(square.piece.side.name == "white")
				return "♙"
			return "♟"
		case "rook":
			if(square.piece.side.name == "white")
				return "♖"
			return "♜"
		case "knight":
			if(square.piece.side.name == "white")
				return "♘"
			return "♞"
		case "bishop":
			if(square.piece.side.name == "white")
				return "♗"
			return "♝"
		case "king":
			if(square.piece.side.name == "white")
				return "♔"
			return "♚"
		case "queen":
			if(square.piece.side.name == "white")
				return "♕"
			return "♛"
	}
}

draw()

client.on("message", (channel, tags, message, self) => {
	if(self || !message.startsWith('!')) {
		return
	}
	if(message == "!new") {
		newGame()
		client.say(channel, "Empezando nueva partida")
		draw()
		return
	}
	try {
		game.move(message.slice(1))
	}
	catch {
		client.say(channel, "Movimiento no valido")
	}
	draw()
})