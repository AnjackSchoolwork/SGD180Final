
var game_play = function () {

}

game_play.prototype = {

	preload: function () {
		// Load test map
		this.game.load.tilemap('map_test', 'maps/Map_Test.json', null, Phaser.Tilemap.TILED_JSON)
		this.game.load.image('tileset_test', 'img/Tileset_Test.png')

		cursors = this.game.input.keyboard.createCursorKeys()
	},

	create: function () {
		// Physics
		this.game.physics.startSystem(Phaser.Physics.ARCADE)

		// Load the map and tileset, with layer
		map = this.game.add.tilemap('map_test')
		map.addTilesetImage('Tileset_Test', 'tileset_test')
		map.setCollisionBetween(0, 15)
		layer = map.createLayer('Tile Layer 1')
		layer.resizeWorld()

		// Create the player object
		player = this.game.add.sprite(64, 380, 'placeholder_player')
		player.anchor.set(0.5, 1)
		this.game.physics.arcade.enable(player)
		player.body.bounce.y = 0
		player.body.gravity.y = 600
		
	},

	update: function () {

		// Collisions
		this.game.physics.arcade.collide(player, layer)

		// Movement & controls
		player.body.velocity.x = 0
		// Keyboard controls
		if (cursors.left.isDown) {
			player.body.velocity.x = -150
		}
		else if (cursors.right.isDown) {
			player.body.velocity.x = +150
		}
	}

}