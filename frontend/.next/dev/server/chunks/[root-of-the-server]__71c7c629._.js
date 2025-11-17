module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next-connect [external] (next-connect, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("next-connect");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/multer [external] (multer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("multer", () => require("multer"));

module.exports = mod;
}),
"[externals]/csv-parse/sync [external] (csv-parse/sync, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("csv-parse/sync");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/mongodb [external] (mongodb, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mongodb", () => require("mongodb"));

module.exports = mod;
}),
"[project]/pages/api/upload.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "config",
    ()=>config,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$connect__$5b$external$5d$__$28$next$2d$connect$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/next-connect [external] (next-connect, esm_import)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$multer__$5b$external$5d$__$28$multer$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/multer [external] (multer, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$csv$2d$parse$2f$sync__$5b$external$5d$__$28$csv$2d$parse$2f$sync$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/csv-parse/sync [external] (csv-parse/sync, esm_import)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$connect__$5b$external$5d$__$28$next$2d$connect$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$csv$2d$parse$2f$sync__$5b$external$5d$__$28$csv$2d$parse$2f$sync$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$connect__$5b$external$5d$__$28$next$2d$connect$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$csv$2d$parse$2f$sync__$5b$external$5d$__$28$csv$2d$parse$2f$sync$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
const upload = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$multer__$5b$external$5d$__$28$multer$2c$__cjs$29$__["default"])({
    storage: __TURBOPACK__imported__module__$5b$externals$5d2f$multer__$5b$external$5d$__$28$multer$2c$__cjs$29$__["default"].memoryStorage()
});
const handler = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$connect__$5b$external$5d$__$28$next$2d$connect$2c$__esm_import$29$__["default"])({
    onError (err, req, res) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    },
    onNoMatch (req, res) {
        res.status(405).json({
            error: `Method ${req.method} not allowed`
        });
    }
});
handler.use(upload.single("file"));
handler.post(async (req, res)=>{
    if (!req.file) return res.status(400).json({
        error: "No file uploaded"
    });
    const buffer = req.file.buffer;
    let records;
    try {
        // parse CSV buffer to array of objects (header row required)
        records = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$csv$2d$parse$2f$sync__$5b$external$5d$__$28$csv$2d$parse$2f$sync$2c$__esm_import$29$__["parse"])(buffer, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });
    } catch (err) {
        console.error("CSV parse error", err);
        return res.status(400).json({
            error: "CSV parse error: " + err.message
        });
    }
    if (!Array.isArray(records) || records.length === 0) {
        return res.json({
            message: "No rows",
            count: 0
        });
    }
    // add createdAt and optionally normalize phone field name (example: phone)
    const docs = records.map((r)=>({
            ...r,
            createdAt: new Date()
        }));
    const client = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["MongoClient"](process.env.MONGODB_URI);
    try {
        await client.connect();
        const db = client.db(process.env.MONGO_DB || "voice_campaign");
        const result = await db.collection("contacts").insertMany(docs);
        res.json({
            message: "Inserted",
            count: result.insertedCount
        });
    } catch (err) {
        console.error("DB insert error", err);
        res.status(500).json({
            error: err.message
        });
    } finally{
        await client.close();
    }
});
const config = {
    api: {
        bodyParser: false
    }
};
const __TURBOPACK__default__export__ = handler;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__71c7c629._.js.map