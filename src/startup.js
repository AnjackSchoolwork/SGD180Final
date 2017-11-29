
var startup = function () {

}

startup.prototype = {
	preload: function () {
		this.game.load.image('logo_title', 'img/Logo_Title.png', 512, 128)
		this.game.load.spritesheet('button_play', 'img/Button_Play.png', 128, 64)
		this.game.load.image('placeholder_player', 'img/Placeholder_Player.png', 32, 64)
	},

	create: function () {
		this.game.state.start('Menu')
	}
}