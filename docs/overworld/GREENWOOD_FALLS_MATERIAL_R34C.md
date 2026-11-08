# Phase 9 R34c — finish removing square-textured land at Greenwood Falls

The real playable R34b screenshot confirmed the river currents had become coherent but **the adjacent land was still full of ugly, repeated square flecks**. Its climate-driven `thaw` and `wetland` materials, along with source rock/soil/road classes, were bypassing the new 256px native plate. This is fixed at the actual `terrain_art.stamp()` source: the *Falls-only* path now paints **all nine relevant material classes** as low-noise, seamless native ground plates, sharing stable world-grid coordinates at every streamed chunk seam. The 2013-looking 32px tile glyphs cannot reappear simply because the climate changed wetness or elevation.

Existing Greenwood proper keeps its original source palette choices; distant winter biomes are untouched. The physical Frostbridge River, seven crossings, 65 authored roads, 48 map nodes, native painted canopies, all quest and save data remain intact. The browser capture `GREENWOOD_R34C_ALL_NATIVE_SURFACES` shows the **real walking game**, not concept art. This is still not a finished waterfall landscape or creator-approved aesthetic.

**Phase 9 active, visual acceptance 0%, Phase 10 locked, physical iPhone testing outstanding.**
