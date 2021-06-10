const tmi = require("tmi.js")
const chess = require("chess")

const user = "hhhhhhhhhn"

const client = new tmi.Client({
	options: { debug: false },
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

var white
var game

function newGame () {
	game = chess.create()
	white = true
}
newGame()

function draw() {
	board = ""
	for (let square of game.getStatus().board.squares) {
		board += drawSquare(square) + " "
	}
	console.clear()
	process.stdout.write(
		board.match(/.{1,16}/g).join("\n") + // splits into lines
		"Mueve con ! " + 
		(white ? "(B)" : "(N)")
	)
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
	if(message == "!nueva" && tags.username == user) {
		newGame()
		client.say(channel, "Empezando nueva partida")
		draw()
		return
	}
	// Move
	if(white && tags.username != user) {
		client.say(channel, "rEspera tu turno")
		return
	}
	try {
		game.move(message.slice(1))
	}
	catch {
		client.say(channel, "Movimiento no valido")
		return
	}
	draw()
	if (game.getStatus().isCheckmate) {
		console.clear()
		console.log("Gana " + (white ? "blanco" : "negro"))
	}
	white = !white
})