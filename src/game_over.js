
var game_over = function () {

}

game_over.prototype = {

	preload: function () {

	},

	create: function () {
		game_over_text = game.add.text(0, 0, 'Game Over: You Died', { fontSize: '32px', fill: '#fff', boundsAlignH: 'center', boundsAlignV: 'middle' })
	},

	update: function () {

	}

}