
var startup = function () {

}

startup.prototype = {
	preload: function () {
		this.game.load.image("logo_title", "img/Logo_Title.png", 512, 128)
	},

	create: function () {
		this.game.state.start("Menu")
	}
}