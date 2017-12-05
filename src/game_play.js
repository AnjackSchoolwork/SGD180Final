
var game_play = function () {
}

game_play.prototype = {
	init: function (controls_object) {
		// Get the controls from the previous state
		this.controls = controls_object
	},

	preload: function () {
		// Load test map
		this.game.load.tilemap('map_test', 'maps/Map_Test.json', null, Phaser.Tilemap.TILED_JSON)
		this.game.load.image('tileset_test', 'img/Tileset_Test.png')

		//cursors = this.game.input.keyboard.createCursorKeys()
	},

	create: function () {
		// Physics
		this.game.physics.startSystem(Phaser.Physics.ARCADE)

		// Load the test map and tileset, with layer
		map = this.game.add.tilemap('map_test') // GAH global :(
		map.addTilesetImage('Tileset_Test', 'tileset_test')
		map.setCollisionBetween(0, 15)
		layer = map.createLayer('Tile Layer 1') // GAH global :(
		layer.resizeWorld()

		// Load entity objects (enemies, npcs)
		enemies = this.add.group()
		enemies.enableBody = true

		var object_list = map.objects['Object Layer 1']
		for (var index in object_list) {
			if (object_list[index].type == "Slime") {
				var temp_entity = new Entity(this, enemies, object_list[index].x, object_list[index].y, "test_slime")
			}
		}

		// Load interactable objects

		// Load pickup-able objects

		// Create group to hold players
		players = this.add.group() // GAH global :(
		
		// Generate player entities from map data
		map.createFromObjects('Object Layer 1', 'Player1', 'placeholder_player', 0, true, false, players)

		// Create the player object
		player = players.children[0] // GAH global :(
		if (typeof player != undefined) {
			player.anchor.set(0.5, 1)
			this.game.physics.arcade.enable(player)
			player.body.bounce.y = 0
			player.body.gravity.y = 1600
		}

		// Configure the camera
		this.game.camera.follow(player)
	},

	update: function () {

		// Collisions
		hit_platform = this.game.physics.arcade.collide(player, layer)
		hit_enemies_platform = this.game.physics.arcade.collide(enemies, layer)

		// Enemy pseudo-ai
		enemies.forEachExists(function (enemy) {
			enemy.entity.think(this, map, player)
		})

		// Movement & controls
		player.body.velocity.x = 0
		// Player control input
		checkInput(this.controls, player)

		// TODO: Terminal velocity for player
	}

}

function checkInput(controls, player) {
	// TODO: Pull these numbers from config file or constants object

	// Keyboard
	if (controls.left_key.isDown) {
		player.body.velocity.x = -250
	}
	else if (controls.right_key.isDown) {
		player.body.velocity.x = +250
	}

	if (controls.jump_key.isDown && player.body.blocked.down && hit_platform) {
		player.body.velocity.y = -700
	}

	// Gamepad



	// Mouse



}