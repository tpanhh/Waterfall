;(function(){

	// Initial containers
	let waterfallCols  = [],
		waterfallCards = [],
		// Get new dataset from ajax calls, simulating here
		ajaxHandler = {
			status: true,
			handler: null
		}

	const cardWidth = 200;

	function init(importData = ["l", "lx", "lxx", "l", "lx", "lxx", "l", "lx", "lxx"]) {

		let cardScale = {
			width: cardWidth
		};

		// Get client window scale
		let windowWidth = document.documentElement.clientWidth;
		let colsNum = Math.floor(windowWidth / (cardScale.width + 20));

		if(waterfallCols.length === colsNum) {
			return;
		}

		// Clear
		document.getElementById("container").innerHTML = "";

		// Save initial card instances
		waterfallCards = importData;
		waterfallCols  = [];

		// Create columns
		let docFragment = document.createDocumentFragment();

		for (let i = 0; i < colsNum; i ++) {

			// Append col containers
			let colEntity = document.createElement("div");
			colEntity.className = "col";
			docFragment.appendChild(colEntity);

			// Col collection
			waterfallCols[i] = {
				ele: colEntity,
				height: 0
			}

		}

		// Append to body
		document.getElementById("container").appendChild(docFragment);

		// Paint cards
		reload(importData);
	}

	function reload(dataset) {

		for (let i = 0; i < dataset.length; i ++) {
			// Create card element
			let div = document.createElement("div");
			div.className = "card " + dataset[i];

			// Choose a shortest col to append to
			let col = chooseCol(waterfallCols);

			// Append card to this col
			col.ele.appendChild(div);

			// Update col status (height)
			update(div, col.ele, waterfallCols);
		}

	}

	function update(ele, col, waterfallCols) {

		for (let item in waterfallCols) {

			if(waterfallCols[item].ele === col) {
				waterfallCols[item].height = waterfallCols[item].height + parseInt(window.getComputedStyle(ele).height.slice(0, -2));
				break;
			}

		}

	}

	function chooseCol(waterfallCols) {

		let result = {
			height: Number.MAX_VALUE
		};

		for (let item in waterfallCols) {

			if(waterfallCols[item].height < result.height) {
				result = waterfallCols[item];
			}
		}

		return result;
	}

	window.addEventListener("scroll", function() {

		if(window.scrollY >= parseInt(window.getComputedStyle(document.documentElement).height.slice(0, -2)) / 2) {

			if(ajaxHandler.status) {	
				ajaxHandler.status = false;
				// Simulate an ajax call
				ajaxHandler.handler = setTimeout(function()  {
					let ajaxContent = [];
					for (let i = 0; i < 8; i ++) {
						ajaxContent[i] = ["s", "sx", "sxx", "m", "mx", "mxx", "l", "lx", "lxx"][Math.round(Math.random() * 8)];
					}

					// Save instances
					waterfallCards = waterfallCards.concat(ajaxContent);

					reload.call(this, ajaxContent);

					ajaxHandler.status = true;
				}, 1000);
			}

		}

	});

	window.addEventListener("resize", function() {
		init(waterfallCards);
	});

	init();

})();
