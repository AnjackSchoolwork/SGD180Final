
var menu = function () {

}

menu.prototype = {
	preload: function () {
		this.game.stage.backgroundColor = '#66B2AF'
	},

	create: function () {
		var logo_title = this.game.add.sprite(
			this.game.world.width / 2,
			this.game.world.height / 3,
			'logo_title')
		logo_title.anchor.set(0.5, 0.5)

		var button_play = this.game.add.button(
			this.game.world.width / 2, (this.game.world.height / 3) * 2, 
			'button_play', clickButtonPlay, this, 0, 0, 1)
		button_play.anchor.set(0.5, 0.5)

		
	},

	update: function () {

	}
}

function clickButtonPlay() {
	this.game.state.start('Game Play')
}