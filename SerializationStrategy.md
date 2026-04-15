# Proposed Serialization Strategy for Corebridge Menu State Restoration

## Goal
Persist and restore menu state for:
- Panel Signs
- Billboard
- 3D
- Vehicle

State should survive menu close/reopen and be recoverable from a created Corebridge part item where the part notes/inner text stores a serialized string.

## Why this is needed
These menus currently create products/parts but do not persist full UI state for later rehydration. Some flows already store SVG content in notes, but not a complete cross-menu state bundle.

## Strategy Overview

### 1) Introduce a unified payload contract
Use one envelope shape for all menu types:

- `schemaVersion` (e.g. `1`)
- `menuType` (`panelSigns`, `billboard`, `menu3d`, `vehicle`)
- `createdAt` / `updatedAt`
- `scriptVersion` (from userscript metadata)
- `payload` (menu-specific state)
- `assets` (deduplicated SVG/canvas/image blobs)
- `integrity` (simple checksum/hash to detect truncation/corruption)

This allows migration by version and shared parsing logic.

### 2) Add menu-level serializer/deserializer interfaces
Each target menu should expose methods (naming TBD when implemented):

- serialize current state into JSON-safe object
- deserialize JSON-safe object back into UI state
- report missing dependencies/assets during restore

Keep this at menu-level so each menu owns its own state map, while a shared utility handles compression/splitting/storage.

### 3) Model state in three layers

1. **Structural state**
   - products/items list and creation order
   - component type per row
   - per-component unique IDs
   - subscription graph edges (publisher -> subscriber)

2. **Field/UI state**
   - all user-entered values, toggles, dropdown selections
   - visibility flags (show measurements, show handles, etc.)
   - active tool/view mode and layout orientation
   - ordering of rows/material blocks

3. **Geometry/media state**
   - full SVG document text where applicable
   - for canvases: store source model primitives, not raster pixels
   - for images: src/data URI, dimensions, transforms, anchors/corners
   - any vehicle skewable image coordinates and bounding rect data

### 4) Asset handling (SVG/canvas/images)
Store heavy media separately in `assets` and reference by ID from `payload`:

- canonicalize text (trim BOM/newline normalization) before hashing
- `assets` map: `{assetId: {type, mime, encoding, data}}`
- in payload keep refs (`assetRef`) instead of duplicating strings
- if asset is external URL, store both URL and last resolved data URI when available

For canvas-backed features, serialize the underlying model that can redraw canvas deterministically; avoid storing bitmap snapshots unless fallback is required.

### 5) Size-safe storage plan for Corebridge part notes
Because part notes/inner text may have practical limits, use chunking:

- JSON -> UTF-8 -> optional compression -> base64
- split into deterministic chunks with index metadata
- write chunks across one or more dedicated “state parts”
- include manifest fields: totalChunks, chunkIndex, totalBytes, checksum

Primary recommendation:
- Keep one visible anchor part (`CODE [Automatic]`) with a small manifest pointer.
- Store chunk bodies in additional hidden/no-cost parts with predictable descriptions.

### 6) Deterministic restore flow

1. Find state anchor part(s)
2. Reassemble chunks and verify checksum
3. Parse envelope and run schema migrations if needed
4. Open correct menu type
5. Rebuild structure first (rows/components)
6. Reapply subscriptions
7. Apply field values
8. Reattach assets and redraw SVG/canvas
9. Run one final recompute/update pass

### 7) Backward/forward compatibility
- Version every payload (`schemaVersion`).
- Add migration functions `vN -> vN+1`.
- Unknown fields should be ignored (forward compatibility).
- Missing optional fields should fall back to defaults.

### 8) Error handling and user feedback
- Corrupt/incomplete payload: show actionable message, offer partial restore.
- Missing assets: restore everything else, mark unresolved assets list.
- Mismatch between payload menu type and current menu: prompt to switch menu.

### 9) Security/safety constraints
- Treat serialized text as untrusted input.
- Never execute scripts from restored SVG/image content.
- Validate MIME/type and enforce maximum sizes before decode.

### 10) Incremental rollout plan
1. Implement shared envelope/chunk utility.
2. Start with Vehicle (richest geometry/media), validate model.
3. Extend to Billboard (existing SVG note behavior).
4. Extend to Panel Signs and 3D (component/subscription-heavy).
5. Add migration tests and real quote round-trip fixtures.

## Menu-specific notes

### Panel Signs / 3D
- Preserve `allMaterials` ordering and per-item class/type.
- Preserve product-number grouping used during CreateProduct.
- Persist subscription links using stable serialized IDs, not runtime object refs.

### Billboard
- Preserve attachment type, show-ground toggle, and all component field values.
- Persist generated SVG text and any values required to redraw measurements consistently.

### Vehicle
- Persist template rect list, visual toggles, layout orientation, and active template metadata.
- Persist skewable image geometry and source content (including SVG sources).
- Preserve background image selection and scale reference behavior.

## Acceptance criteria (for implementation phase)
- Round-trip restore reproduces identical menu state after close/reopen.
- Product creation after restore yields same part set/summary as before serialization.
- SVG/canvas/image-heavy templates restore without manual correction.
- Payload remains readable across schema updates through migrations.
