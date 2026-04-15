class MenuStateSerializer {
      static SCHEMA_VERSION = 1;
      static MAX_STATE_BYTES = 1024 * 1024 * 2;

      static canonicalizeAssetText(text) {
            if(typeof text !== "string") return "";
            return text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").trim();
      }

      static hashString(value) {
            const input = String(value ?? "");
            let hash = 0x811c9dc5;
            for(let i = 0; i < input.length; i++) {
                  hash ^= input.charCodeAt(i);
                  hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
            }
            return (hash >>> 0).toString(16).padStart(8, "0");
      }

      static encodeUtf8Base64(value) {
            const bytes = new TextEncoder().encode(String(value ?? ""));
            let binary = "";
            for(let i = 0; i < bytes.length; i++) {
                  binary += String.fromCharCode(bytes[i]);
            }
            return btoa(binary);
      }

      static decodeUtf8Base64(value) {
            const binary = atob(String(value ?? ""));
            const bytes = new Uint8Array(binary.length);
            for(let i = 0; i < binary.length; i++) {
                  bytes[i] = binary.charCodeAt(i);
            }
            return new TextDecoder().decode(bytes);
      }

      static createEnvelope(options = {}) {
            const {
                  menuType,
                  payload = {},
                  assets = {},
                  schemaVersion = MenuStateSerializer.SCHEMA_VERSION,
                  scriptVersion = (typeof GM_info !== "undefined" && GM_info?.script?.version) ? GM_info.script.version : "unknown",
                  createdAt = new Date().toISOString(),
                  updatedAt = new Date().toISOString()
            } = options;

            const envelope = {
                  schemaVersion,
                  menuType,
                  createdAt,
                  updatedAt,
                  scriptVersion,
                  payload,
                  assets
            };

            const integritySource = JSON.stringify({schemaVersion, menuType, payload, assets});
            envelope.integrity = {
                  algorithm: "fnv1a32",
                  checksum: MenuStateSerializer.hashString(integritySource)
            };

            return envelope;
      }

      static verifyEnvelopeIntegrity(envelope) {
            if(!envelope || !envelope.integrity) return {valid: false, reason: "missingIntegrity"};
            const integritySource = JSON.stringify({
                  schemaVersion: envelope.schemaVersion,
                  menuType: envelope.menuType,
                  payload: envelope.payload,
                  assets: envelope.assets
            });
            const checksum = MenuStateSerializer.hashString(integritySource);
            if(checksum !== envelope.integrity.checksum) {
                  return {valid: false, reason: "checksumMismatch"};
            }
            return {valid: true};
      }

      static registerAsset(assetStore, options = {}) {
            const {
                  type = "unknown",
                  mime = "text/plain",
                  encoding = "utf8",
                  data = "",
                  sourceUrl = null,
                  fallbackData = null
            } = options;

            if(!assetStore || typeof assetStore !== "object") throw new Error("assetStore must be an object");

            const normalizedData = mime.includes("svg") || mime.startsWith("text/")
                  ? MenuStateSerializer.canonicalizeAssetText(data)
                  : String(data ?? "");

            const assetId = "asset-" + MenuStateSerializer.hashString([type, mime, encoding, normalizedData].join("|"));
            if(!assetStore[assetId]) {
                  assetStore[assetId] = {
                        type,
                        mime,
                        encoding,
                        data: normalizedData,
                        sourceUrl,
                        fallbackData
                  };
            }
            return assetId;
      }

      static chunkBase64(base64Content, options = {}) {
            const {chunkSize = 3500} = options;
            const chunks = [];
            const totalChunks = Math.max(1, Math.ceil(base64Content.length / chunkSize));
            for(let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
                  const start = chunkIndex * chunkSize;
                  const end = start + chunkSize;
                  chunks.push({
                        chunkIndex,
                        totalChunks,
                        body: base64Content.slice(start, end)
                  });
            }
            return chunks;
      }

      static serializeForStorage(envelope, options = {}) {
            const serializedJson = JSON.stringify(envelope);
            const totalBytes = new TextEncoder().encode(serializedJson).length;
            if(totalBytes > MenuStateSerializer.MAX_STATE_BYTES) {
                  throw new Error("Serialized payload exceeds maximum configured size.");
            }

            const encoded = MenuStateSerializer.encodeUtf8Base64(serializedJson);
            const checksum = MenuStateSerializer.hashString(encoded);
            const chunks = MenuStateSerializer.chunkBase64(encoded, options);

            return {
                  manifest: {
                        schemaVersion: envelope.schemaVersion,
                        menuType: envelope.menuType,
                        totalChunks: chunks.length,
                        totalBytes,
                        checksum,
                        createdAt: envelope.createdAt,
                        updatedAt: envelope.updatedAt
                  },
                  chunks
            };
      }

      static reassembleChunks(manifest, chunks = []) {
            if(!manifest || !Array.isArray(chunks)) {
                  throw new Error("manifest and chunks are required for reassembly");
            }

            const ordered = chunks
                  .slice()
                  .sort((a, b) => a.chunkIndex - b.chunkIndex)
                  .map((chunk) => chunk.body)
                  .join("");

            const checksum = MenuStateSerializer.hashString(ordered);
            if(checksum !== manifest.checksum) {
                  throw new Error("Chunk checksum mismatch");
            }

            const jsonString = MenuStateSerializer.decodeUtf8Base64(ordered);
            return JSON.parse(jsonString);
      }

      static captureUiState(rootElement) {
            if(!rootElement) return [];
            const fields = rootElement.querySelectorAll("input, select, textarea");
            const state = [];
            for(let i = 0; i < fields.length; i++) {
                  const field = fields[i];
                  const key = field.id || field.name || field.getAttribute("data-serialization-key");
                  if(!key) continue;
                  let value = field.value;
                  if(field.type === "checkbox" || field.type === "radio") {
                        value = field.checked;
                  }
                  state.push({
                        key,
                        tag: field.tagName,
                        type: field.type || null,
                        value
                  });
            }
            return state;
      }

      static applyUiState(rootElement, state = []) {
            if(!rootElement || !Array.isArray(state)) return;
            for(let i = 0; i < state.length; i++) {
                  const item = state[i];
                  const selector = `[id="${CSS.escape(item.key)}"],[name="${CSS.escape(item.key)}"],[data-serialization-key="${CSS.escape(item.key)}"]`;
                  const field = rootElement.querySelector(selector);
                  if(!field) continue;
                  if(field.type === "checkbox" || field.type === "radio") {
                        field.checked = !!item.value;
                  } else {
                        field.value = item.value;
                  }
                  field.dispatchEvent(new Event("change", {bubbles: true}));
            }
      }
}
