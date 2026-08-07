/**
 * CAPA DE DATOS
 * Único acceso del sistema administrativo a LocalStorage.
 * Toda la información vive bajo la llave raíz `adminpro_db`.
 */
const Storage = (() => {
  const ROOT_KEY = "adminpro_db";
  const ENTITIES = ["customers", "products", "suppliers", "orders"];
  const LEGACY_KEYS = Object.fromEntries(ENTITIES.map((entity) => [`adminpro_${entity}`, entity]));
  const emptyDatabase = () => ({ version: 2, customers: [], products: [], suppliers: [], orders: [], settings: {}, metadata: { updatedAt: new Date().toISOString() } });
  const entityName = (key) => LEGACY_KEYS[key] || key;

  function readRoot() {
    try {
      const parsed = JSON.parse(localStorage.getItem(ROOT_KEY));
      if (!parsed || typeof parsed !== "object") return emptyDatabase();
      ENTITIES.forEach((entity) => { if (!Array.isArray(parsed[entity])) parsed[entity] = []; });
      return { ...emptyDatabase(), ...parsed };
    } catch (error) {
      console.warn("La base local estaba dañada; se creó una estructura nueva.", error);
      return emptyDatabase();
    }
  }

  function writeRoot(database, changedEntity = "database") {
    database.metadata = { ...(database.metadata || {}), updatedAt: new Date().toISOString() };
    localStorage.setItem(ROOT_KEY, JSON.stringify(database));
    window.dispatchEvent(new CustomEvent("adminpro:datachange", { detail: { key: changedEntity } }));
  }

  function migrateLegacyData() {
    if (!localStorage.getItem(ROOT_KEY)) {
      const database = emptyDatabase();
      Object.entries(LEGACY_KEYS).forEach(([legacyKey, entity]) => {
        try { const data = JSON.parse(localStorage.getItem(legacyKey)); if (Array.isArray(data)) database[entity] = data; } catch { /* ignora datos heredados inválidos */ }
      });
      writeRoot(database, "migration");
    }
    Object.keys(LEGACY_KEYS).forEach((legacyKey) => localStorage.removeItem(legacyKey));
  }

  function get(key) {
    const entity = entityName(key);
    const value = readRoot()[entity];
    return Array.isArray(value) ? value : value ?? [];
  }

  function save(key, data) {
    const entity = entityName(key); const database = readRoot();
    database[entity] = data; writeRoot(database, entity); return data;
  }

  function add(key, object) {
    const entity = entityName(key); const data = get(entity);
    const record = { ...object, id: object.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`, createdAt: object.createdAt || new Date().toISOString() };
    data.push(record); save(entity, data); return record;
  }

  function update(key, id, changes) {
    const entity = entityName(key); let found = null;
    const data = get(entity).map((item) => String(item.id) === String(id) ? (found = { ...item, ...changes, updatedAt: new Date().toISOString() }) : item);
    save(entity, data); return found;
  }

  function remove(key, id) {
    const entity = entityName(key); const before = get(entity); const after = before.filter((item) => String(item.id) !== String(id));
    save(entity, after); return before.length !== after.length;
  }

  function find(key, id) { return get(key).find((item) => String(item.id) === String(id)); }
  function search(key, text) { const term = String(text || "").toLowerCase(); return get(key).filter((item) => JSON.stringify(item).toLowerCase().includes(term)); }
  function count(key) { return get(key).length; }
  function exists(key) { const entity = entityName(key); return Object.prototype.hasOwnProperty.call(readRoot(), entity); }
  function clear(key) { save(key, []); }
  function clearAll() { writeRoot(emptyDatabase(), "database"); }
  function last(key) { const data = get(key); return data[data.length - 1]; }
  function replace(key, data) { return save(key, data); }
  function exportEntity(key) { return JSON.stringify(get(key), null, 2); }
  function importEntity(key, json) { const data = JSON.parse(json); if (!Array.isArray(data)) throw new Error("La entidad importada debe ser un arreglo."); return save(key, data); }
  function getDatabase() { return JSON.parse(JSON.stringify(readRoot())); }
  function exportAll() { return JSON.stringify(readRoot(), null, 2); }
  function importAll(json) {
    const database = typeof json === "string" ? JSON.parse(json) : json;
    if (!database || typeof database !== "object" || ENTITIES.some((entity) => !Array.isArray(database[entity]))) throw new Error("El archivo no contiene una base AdminPro válida.");
    writeRoot({ ...emptyDatabase(), ...database, version: 2 }, "database"); return getDatabase();
  }
  function downloadAll(filename = "adminpro-backup.json") {
    const blob = new Blob([exportAll()], { type: "application/json" }); const url = URL.createObjectURL(blob); const link = document.createElement("a");
    link.href = url; link.download = filename; link.click(); setTimeout(() => URL.revokeObjectURL(url), 0);
  }
  function getSession() { try { return JSON.parse(localStorage.getItem("kinetic_session")); } catch { return null; } }

  migrateLegacyData();
  return { ROOT_KEY, get, save, add, update, delete: remove, find, search, count, exists, clear, clearAll, last, replace, export: exportEntity, import: importEntity, getDatabase, exportAll, importAll, downloadAll, getSession };
})();
window.Storage = Storage;
