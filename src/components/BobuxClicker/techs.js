
// name: name
// shortname: shorter name
// desc: description
// cost: cost in levels
// requirements: function: bool
// children: child nodes

const techs = [
	{
		"name": "Food yum",
		"shortname": "hom",
		"desc": "The beginning of the beginning.",
		"cost": 0,
		"requirements": () => true,
		"children": [
			{
				"name": "Inflation",
				"shortname": "inf",
				"desc": "Here you begin your journey into the world of bobux.",
				"cost": 0,
				"requirements": () => true,
				"children": [
					{
						"name": "Bruh",
						"shortname": "b",
						"desc": "burh bruh",
						"cost": 0,
						"requirements": () => true
					},
					{
						"name": "Bruh",
						"shortname": "be",
						"desc": "burh bruh",
						"cost": 0,
						"requirements": () => true
					},
					{
						"name": "Bruh",
						"shortname": "bee",
						"desc": "burh bruh",
						"cost": 0,
						"requirements": () => true
					}
				]
			},
			{
				"name": "Test",
				"shortname": "test",
				"desc": "Here you begin your journey into the world of bobux.",
				"cost": 0,
				"requirements": () => true,
				"coffset": 1,
				"children": [
					{
						"name": "Bruh",
						"shortname": "beee",
						"desc": "burh bruh",
						"cost": 0,
						"requirements": () => true
					},
					{
						"name": "Bruh",
						"shortname": "beeee",
						"desc": "burh bruh",
						"cost": 0,
						"requirements": () => true,
						"children": [
							{
								"name": "Bruh",
								"shortname": "beeeeeeeeeeeee",
								"desc": "burh bruh",
								"cost": 0,
								"requirements": () => true
							},
							{
								"name": "Bruh",
								"shortname": "beeeeee3ee",
								"desc": "burh bruh",
								"cost": 0,
								"requirements": () => true
							}
						]
					},
					{
						"name": "Bruh",
						"shortname": "beeeeeeee",
						"desc": "burh bruh",
						"cost": 0,
						"requirements": () => true
					}
				]
			},
			{
				"name": "Test",
				"shortname": "teste",
				"desc": "Here you begin your journey into the world of bobux.",
				"cost": 0,
				"requirements": () => true,
				"children": [
					{
						"name": "Bruh",
						"shortname": "beeeee",
						"desc": "burh bruh",
						"cost": 0,
						"requirements": () => true
					},
					{
						"name": "Bruh",
						"shortname": "beeeeeeeeeeee",
						"desc": "burh bruh",
						"cost": 1419424,
						"requirements": () => true
					},
					{
						"name": "Bruh",
						"shortname": "beeeeeee",
						"desc": "burh bruh",
						"cost": 0,
						"requirements": () => true
					}
				]
			}
		]
	}
];

export default techs;
