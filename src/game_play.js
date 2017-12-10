
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
		this.game.load.image('tileset_one', 'img/Tileset_one.png')
	},

	create: function () {

		this.stage.backgroundColor = '#838383'

		// Physics
		this.game.physics.startSystem(Phaser.Physics.ARCADE)
		this.game.physics.arcade.sortDirection = Phaser.Physics.Arcade.SORT_NONE

		// Load the test map and tileset, with layer
		map = this.game.add.tilemap('map_test') // GAH global :(
		map.addTilesetImage('Tileset_One', 'tileset_one')
		map.setCollisionBetween(0, 40)
		layer = map.createLayer('Tile Layer 1') // GAH global :(
		layer.resizeWorld()

		// Load entity objects (enemies, npcs)
		enemies = this.add.group()
		enemies.enableBody = true

		// Doors
		doors = this.add.group()
		doors.enableBody = true

		// Keys for doors
		door_keys = this.add.group()
		door_keys.enableBody = true


		var object_list = map.objects['Object Layer 1']
		for (var index in object_list) {
			// First load entities
			if (object_list[index].type == 'Slime') {
				var temp_entity = new MobileEntity(this, enemies, object_list[index].x, object_list[index].y, "test_slime")

				// Load animations
				temp_entity.sprite.animations.add("walk_left", [0, 1, 2, 3, 4, 5], 10, true)
				temp_entity.sprite.animations.add("walk_right", [6, 7, 8, 9, 10, 11], 10, true)
				temp_entity.sprite.animations.add("idle", [12, 13, 14, 15, 16, 17], 5, true)
			}
			// Next load player
			else if (object_list[index].type == 'Player') {
				player = new Player(this, object_list[index].x, object_list[index].y, "placeholder_player")

				player.fired_bullets = this.game.add.group()
				player.fired_bullets.enableBody = true

				
			}
			// We got doors!
			else if (object_list[index].type == 'door') {
				var temp_sprite = doors.create(object_list[index].x, object_list[index].y, object_list[index].name)
				temp_sprite.anchor.set(0.5, 0.5)
				temp_sprite.key = object_list[index].name
				temp_sprite.body.immovable = true
			}
			// Dem Keys
			else if (object_list[index].type == 'door_key') {
				var temp_pickup = new PickUp(this, door_keys, object_list[index].x, object_list[index].y, "pickup_placeholder")
				temp_pickup.sprite.anchor.set(0.5, 1)

				// What key is it?
				temp_pickup.door_key = object_list[index].properties.Door
			}

			// Load interactable objects

			// Load pickup-able objects
		}


		// Configure the camera
		this.game.camera.follow(player.sprite)
		this.game.camera.deadzone = new Phaser.Rectangle(
			this.game.camera.width / 4,
			this.game.camera.height / 3,
			this.game.camera.width - (this.game.camera.width / 2),
			this.game.camera.height - (this.game.camera.height / 1.5)
		)

		this.game_ui = new GameUI(this.game, player)
	},

	update: function () {

		// Collisions
		// TODO: Move callbacks into object code
		hit_platform = this.game.physics.arcade.collide(player.sprite, layer)
		this.game.physics.arcade.collide(enemies, layer)
		this.game.physics.arcade.overlap(player.sprite, enemies, enemyHitPlayerMelee)
		this.game.physics.arcade.collide(player.fired_bullets, layer, function (bullet, layer) {
			bullet.kill()
		})
		this.game.physics.arcade.collide(player.fired_bullets, enemies, function (bullet, enemy) {
			bullet.kill()
			enemy.entity.handleDamage(null, 30)
		})
		this.game.physics.arcade.collide(player.sprite, doors, checkDoorKey)
		this.game.physics.arcade.overlap(player.sprite, door_keys, pickUpKey)

		// Enemy pseudo-ai
		enemies.forEachExists(function (enemy) {
			enemy.entity.think(this, map, player.sprite)
		})

		// Movement & controls
		player.velocity_x = 0
		// Player control input
		checkInput(this.game, this.controls, player)

		// TODO: Terminal velocity for player

		// Remove dead objects
		player.fired_bullets.forEachDead(function (bullet) {
			bullet.destroy()
		}, this)

		doors.forEachDead(function (item) {
			item.destroy()
		}, this)

		door_keys.forEachDead(function (item) {
			item.destroy()
		}, this)

		this.game_ui.update()
	}

}

/*
* Enemy hits player
*/
function enemyHitPlayerMelee(p_sprite, enemy) {
	// TODO: Check enemy for damage type & amount
	p_sprite.entity.handleDamage(null, 3)
	p_sprite.entity.flinch(enemy)
	if (p_sprite.x > enemy.x) {
		enemy.entity.goLeft()
	}
	else {
		enemy.entity.goRight()
	}
}

/*
* Pick up the key
*/
function pickUpKey(p_sprite, key) {
	// TODO: Need to check if key is already in inventory
	p_sprite.entity.key_ring.push(key.entity.door_key)
	key.kill()
}

/*
* Check to see if player has appropriate key for collided door.
*
*/
function checkDoorKey(p_sprite, door) {
	for (var index in p_sprite.entity.key_ring) {
		if (p_sprite.entity.key_ring[index] == door.key) {
			door.kill()
			return
		}
	}
}

function checkInput(game, controls, player) {
	// TODO: Pull these numbers from config file or constants object

	// Keyboard
	if (controls.left_key.isDown) {
		player.goLeft()
	}
	else if (controls.right_key.isDown) {
		player.goRight()
	}

	if (controls.jump_key.isDown && player.sprite.body.blocked.down && hit_platform) {
		player.jump()
	}

	if (controls.fire_key.isDown) {
		player.shoot(game)
	}

	// Gamepad



	// Mouse



}