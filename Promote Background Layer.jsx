// Promote Background Layer - Adobe Photoshop Script
// Description: an event-based script that unlocks the Background layer and turns it into a real layer
// Requirements: Adobe Photoshop CS3, or higher
// Version: 1.0.0, 22/Feb/2014
// Author: Trevor Morris (trevor@morris-photographics.com)
// Website: http://morris-photographics.com/
// =======================================================
/** "$$$/JavaScripts/PromoteBackgroundLayer/Description=Unlock the Background layer and turn it into a real layer." **/
// =======================================================
// Installation:
// 1. Place script in "C:\Program Files\Adobe\Adobe Photoshop CS#\Presets\Scripts\Event Scripts Only"
// 2. Choose File > Scripts > Promote Background Layer
// 3. Select an event (e.g., Open Document ["Opn "], New Document ["Mk  "]) from the Photoshop Event drop-down
// 4. Select "Promote Background Layer.jsx" from the Script drop-down
// 5. Press the Add button
// 6. Press the Done button
// =======================================================

///////////////////////////////////////////////////////////////////////////////
// promoteBackgroundLayer - unlock/rename Background layer
///////////////////////////////////////////////////////////////////////////////
function promoteBackgroundLayer() {

	// declare local variables
	var doc = activeDocument;
	var layers = doc.layers;
	var layer = layers[layers.length - 1];

	// rename Background layer
	if (layer.isBackgroundLayer) {
		layer.name = 'Background';
	}
}

// run main function
if (documents.length) {
	promoteBackgroundLayer();
}