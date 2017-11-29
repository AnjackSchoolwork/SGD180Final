
var menu = function () {

}

menu.prototype = {
	preload: function () {

	},

	create: function () {
		var logo_title = this.game.add.sprite(this.game.world.width / 2, this.game.world.height / 3, "logo_title")
		logo_title.anchor.set(0.5, 0.5)
	},

	update: function () {

	}
}